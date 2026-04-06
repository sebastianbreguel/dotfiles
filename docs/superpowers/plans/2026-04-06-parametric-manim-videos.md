# Parametric Manim Videos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate individual Manim videos for every claude-code item (plugins, skills, agents) from a parametric template, and display them in the web app's DetailPanel.

**Architecture:** A single Manim template scene reads flow data from env var, renders a uniform `Input → Tool → [Uses] → Output` animation. A batch script generates all videos. The web app shows per-item videos in DetailPanel.

**Tech Stack:** Python/Manim CE, ffmpeg, React/Vite

---

## File Structure

```
animations/
├── scenes/template.py         # NEW: parametric scene
├── flows.json                 # NEW: flow data for all items
├── generate_all.py            # NEW: batch generator
├── common/styles.py           # existing
├── common/components.py       # existing

app/
├── public/videos/items/       # NEW: per-item MP4s
├── src/components/DetailPanel.jsx  # MODIFY: add video display
├── src/App.css                     # MODIFY: add video styles
```

---

### Task 1: Manim template scene

**Files:**
- Create: `animations/scenes/template.py`

- [ ] **Step 1: Create template scene**

```python
import os
import json
from manim import *
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from common.styles import *
from common.components import labeled_box, section_label, code_text


class ItemFlowScene(Scene):
    def setup(self):
        self.camera.background_color = BG_COLOR
        raw = os.environ.get("FLOW_DATA", "{}")
        self.flow = json.loads(raw)

    def construct(self):
        f = self.flow
        name = f.get("name", "Unknown")
        color = f.get("color", CORE_WHITE)
        inp = f.get("input", "")
        uses = f.get("uses", [])
        output = f.get("output", "")

        # Input
        input_text = code_text(inp).shift(UP * 2.8)
        input_text.scale_to_fit_width(min(input_text.width, 12))
        self.play(FadeIn(input_text, shift=DOWN * 0.2), run_time=FAST)

        # Arrow to main box
        main_box = labeled_box(name, color, width=4.5, height=0.8, fill_opacity=0.2)
        main_box.shift(UP * 1.2)
        arr_in = Arrow(
            input_text.get_bottom(), main_box.get_top(),
            color=color, buff=0.1, stroke_width=2,
        )
        self.play(GrowArrow(arr_in), FadeIn(main_box, scale=0.9), run_time=MEDIUM)

        # Uses boxes
        if uses:
            use_boxes = []
            total = len(uses)
            spacing = min(2.5, 10.0 / max(total, 1))
            start_x = -spacing * (total - 1) / 2
            for i, use in enumerate(uses):
                box = labeled_box(
                    use, color, width=2.2, height=0.5,
                    font_size=12, fill_opacity=0.1,
                )
                box.move_to([start_x + i * spacing, -0.3, 0])
                # Scale down text if it overflows the box
                if box[1].width > box[0].width - 0.2:
                    box[1].scale_to_fit_width(box[0].width - 0.2)
                use_boxes.append(box)

            self.play(
                LaggedStart(
                    *[FadeIn(b, shift=UP * 0.2) for b in use_boxes],
                    lag_ratio=0.2,
                ),
                run_time=SLOW,
            )

            # Arrows from main to each use
            use_arrows = []
            for box in use_boxes:
                arr = Arrow(
                    main_box.get_bottom(), box.get_top(),
                    color=color, buff=0.1, stroke_width=1.5,
                    max_tip_length_to_length_ratio=0.15,
                )
                use_arrows.append(arr)
            self.play(*[GrowArrow(a) for a in use_arrows], run_time=FAST)

            # Merge point
            merge_y = -1.2
        else:
            merge_y = -0.3

        # Output
        output_text = code_text(output).shift(DOWN * 2.2)
        output_text.scale_to_fit_width(min(output_text.width, 12))

        if uses:
            # Arrows from uses to output
            out_arrows = []
            for box in use_boxes:
                arr = Arrow(
                    box.get_bottom(), output_text.get_top(),
                    color=GREEN, buff=0.1, stroke_width=1.5,
                    max_tip_length_to_length_ratio=0.15,
                )
                out_arrows.append(arr)
            self.play(
                *[GrowArrow(a) for a in out_arrows],
                FadeIn(output_text, shift=UP * 0.2),
                run_time=MEDIUM,
            )
        else:
            arr_out = Arrow(
                main_box.get_bottom(), output_text.get_top(),
                color=GREEN, buff=0.1, stroke_width=2,
            )
            self.play(GrowArrow(arr_out), FadeIn(output_text, shift=UP * 0.2), run_time=MEDIUM)

        self.wait(PAUSE)
```

- [ ] **Step 2: Test with a single item**

```bash
cd /Users/sebabreguel/personal/dotfiles/animations && FLOW_DATA='{"name":"context-mode","color":"#a855f7","input":"Tool output (500+ lines)","uses":["FTS5 indexing","Token counting","ctx_search API"],"output":"Indexed knowledge base"}' python3 -m manim -ql --format=gif -o test_template scenes/template.py ItemFlowScene
```

Expected: GIF renders showing Input → context-mode → 3 uses → Output.

- [ ] **Step 3: Commit**

```bash
git add animations/scenes/template.py
git commit -m "feat: add parametric Manim template scene for per-item videos"
```

---

### Task 2: flows.json with all items

**Files:**
- Create: `animations/flows.json`

- [ ] **Step 1: Create flows.json**

Create the file with flow data for all claude-code category items. Here is the complete content:

```json
[
  {
    "id": "plugin-context-mode",
    "name": "context-mode",
    "color": "#a855f7",
    "input": "Tool output (500+ lines)",
    "uses": ["FTS5 indexing", "Token counting", "ctx_search API"],
    "output": "Indexed knowledge base"
  },
  {
    "id": "plugin-code-simplifier",
    "name": "code-simplifier",
    "color": "#a855f7",
    "input": "Recently modified code",
    "uses": ["AST analysis", "Pattern detection", "Refactor rules"],
    "output": "Simplified, cleaner code"
  },
  {
    "id": "plugin-context7",
    "name": "context7",
    "color": "#a855f7",
    "input": "Library name + question",
    "uses": ["Doc resolver", "Snippet search", "Version matching"],
    "output": "Up-to-date documentation"
  },
  {
    "id": "plugin-frontend-design",
    "name": "frontend-design",
    "color": "#a855f7",
    "input": "UI requirements",
    "uses": ["Component patterns", "CSS generation", "Layout system"],
    "output": "Production-grade UI code"
  },
  {
    "id": "plugin-playwright",
    "name": "playwright",
    "color": "#a855f7",
    "input": "Browser action request",
    "uses": ["Headless Chrome", "DOM interaction", "Screenshots"],
    "output": "Browser automation results"
  },
  {
    "id": "plugin-skill-creator",
    "name": "skill-creator",
    "color": "#a855f7",
    "input": "Skill idea or existing skill",
    "uses": ["Template scaffolding", "Eval runner", "Benchmarks"],
    "output": "Tested, deployable skill"
  },
  {
    "id": "plugin-superpowers",
    "name": "superpowers",
    "color": "#a855f7",
    "input": "Task or feature request",
    "uses": ["Brainstorming", "Plan writing", "TDD", "Debugging"],
    "output": "Structured implementation"
  },
  {
    "id": "plugin-claude-hud",
    "name": "claude-hud",
    "color": "#a855f7",
    "input": "Session state",
    "uses": ["Status rendering", "Token tracking", "Layout engine"],
    "output": "Real-time status line"
  },
  {
    "id": "plugin-feature-dev",
    "name": "feature-dev",
    "color": "#a855f7",
    "input": "Feature requirement",
    "uses": ["Codebase analysis", "Architecture planning", "Code review"],
    "output": "Implemented feature with tests"
  },
  {
    "id": "plugin-claude-subconscious",
    "name": "claude-subconscious",
    "color": "#a855f7",
    "input": "Conversation context",
    "uses": ["Memory persistence", "Cross-session recall", "Letta AI"],
    "output": "Persistent agent memory"
  },
  {
    "id": "skill-browser-automation",
    "name": "/browser-automation",
    "color": "#22c55e",
    "input": "URL + action to perform",
    "uses": ["Page navigation", "Element interaction", "Screenshots"],
    "output": "Browser task completed"
  },
  {
    "id": "skill-cross-ai-debate",
    "name": "/cross-ai-debate",
    "color": "#22c55e",
    "input": "Topic + evaluation criteria",
    "uses": ["Claude Code", "Codex CLI", "Gemini CLI"],
    "output": "Multi-perspective analysis"
  },
  {
    "id": "skill-doc-sync",
    "name": "/doc-sync",
    "color": "#22c55e",
    "input": "Repository path",
    "uses": ["CLAUDE.md audit", "README.md audit", "Drift detection"],
    "output": "Synchronized documentation"
  },
  {
    "id": "skill-dream",
    "name": "/dream",
    "color": "#22c55e",
    "input": "Existing memories + logs",
    "uses": ["Signal gathering", "Topic merging", "Index pruning"],
    "output": "Consolidated memory system"
  },
  {
    "id": "skill-electron",
    "name": "/electron",
    "color": "#22c55e",
    "input": "Electron app + task",
    "uses": ["CDP connection", "DevTools Protocol", "App interaction"],
    "output": "Desktop app automated"
  },
  {
    "id": "skill-explore-app",
    "name": "/explore-app",
    "color": "#22c55e",
    "input": "Web app URL",
    "uses": ["Page discovery", "Interaction testing", "Bug detection"],
    "output": "Bug report + UX issues"
  },
  {
    "id": "skill-health",
    "name": "/health",
    "color": "#22c55e",
    "input": "Current session state",
    "uses": ["Hook audit", "MCP check", "Rule validation"],
    "output": "Health diagnosis + fixes"
  },
  {
    "id": "skill-weekly-retro",
    "name": "/weekly-retro",
    "color": "#22c55e",
    "input": "Git history (7 days)",
    "uses": ["Commit analysis", "Pattern detection", "Per-person stats"],
    "output": "Engineering retrospective"
  },
  {
    "id": "skill-ship-pr",
    "name": "/ship-pr",
    "color": "#22c55e",
    "input": "Completed feature branch",
    "uses": ["Merge main", "Run tests", "Review diff", "Bump VERSION"],
    "output": "PR created and pushed"
  },
  {
    "id": "skill-test-and-fix",
    "name": "/test-and-fix",
    "color": "#22c55e",
    "input": "Web app to QA",
    "uses": ["Diff analysis", "Page testing", "Bug reproduction"],
    "output": "Bugs found and fixed"
  },
  {
    "id": "skill-pre-merge-review",
    "name": "/pre-merge-review",
    "color": "#22c55e",
    "input": "PR diff vs main",
    "uses": ["SQL safety", "LLM trust boundaries", "Side effects"],
    "output": "Pre-landing review report"
  },
  {
    "id": "skill-pipeline-review",
    "name": "/pipeline-review",
    "color": "#22c55e",
    "input": "Pipeline codebase",
    "uses": ["Parallel agents", "Stage analysis", "Pattern audit"],
    "output": "Full pipeline code audit"
  },
  {
    "id": "skill-project-docs",
    "name": "/project-docs",
    "color": "#22c55e",
    "input": "Project directory",
    "uses": ["Code scanning", "DB schema extraction", "Doc generation"],
    "output": "vambe.md + db.md"
  },
  {
    "id": "skill-refactor-analysis",
    "name": "/refactor-analysis",
    "color": "#22c55e",
    "input": "Codebase or module",
    "uses": ["Tech debt scoring", "Friction mapping", "Dependency analysis"],
    "output": "Refactoring priority report"
  },
  {
    "id": "skill-generate-readme",
    "name": "/generate-readme",
    "color": "#22c55e",
    "input": "Python project",
    "uses": ["Code analysis", "Dependency scan", "Usage extraction"],
    "output": "Accurate README.md"
  },
  {
    "id": "skill-panel",
    "name": "/panel",
    "color": "#22c55e",
    "input": "Decision to evaluate",
    "uses": ["Simplification lens", "Architecture lens", "Product lens"],
    "output": "Three-perspective feedback"
  },
  {
    "id": "skill-redesign-ui",
    "name": "/redesign-ui",
    "color": "#22c55e",
    "input": "UI component path",
    "uses": ["UI designer agent", "UX designer agent", "Code generation"],
    "output": "Redesigned component"
  },
  {
    "id": "agent-code-reviewer",
    "name": "code-reviewer",
    "color": "#f97316",
    "input": "Code diff or PR",
    "uses": ["Glob", "Grep", "Read", "Pattern matching"],
    "output": "Review with issues ranked by confidence"
  },
  {
    "id": "agent-tech-lead",
    "name": "tech-lead",
    "color": "#f97316",
    "input": "Cross-domain problem",
    "uses": ["Problem decomposition", "Architecture review", "Coordination"],
    "output": "Technical decision + workstream plan"
  },
  {
    "id": "agent-code-simplifier",
    "name": "code-simplifier agent",
    "color": "#f97316",
    "input": "Complex or messy code",
    "uses": ["Redundancy detection", "Logic flattening", "Helper extraction"],
    "output": "Simplified code, same behavior"
  },
  {
    "id": "agent-code-modularizer",
    "name": "code-modularizer",
    "color": "#f97316",
    "input": "Large file or module",
    "uses": ["Boundary analysis", "Interface design", "Code splitting"],
    "output": "Modular architecture with clear boundaries"
  },
  {
    "id": "agent-fullstack-refactor",
    "name": "fullstack-refactor-architect",
    "color": "#f97316",
    "input": "Architecture question",
    "uses": ["API design", "Service extraction", "Error patterns"],
    "output": "Cross-stack architecture plan"
  },
  {
    "id": "agent-db-engineering",
    "name": "db-engineering",
    "color": "#f97316",
    "input": "DB schema or slow query",
    "uses": ["Query optimization", "Index strategy", "Migration planning"],
    "output": "Optimized schema + migration plan"
  },
  {
    "id": "agent-ai-ml-expert",
    "name": "ai-ml-expert",
    "color": "#f97316",
    "input": "AI/ML design question",
    "uses": ["Model selection", "RAG architecture", "Eval framework"],
    "output": "AI architecture decision"
  },
  {
    "id": "agent-prompt-engineering",
    "name": "prompt-engineering",
    "color": "#f97316",
    "input": "Prompt to optimize",
    "uses": ["Output analysis", "Few-shot design", "Schema structuring"],
    "output": "Optimized prompt + examples"
  },
  {
    "id": "agent-ai-researcher",
    "name": "ai-researcher",
    "color": "#f97316",
    "input": "Research question",
    "uses": ["Literature analysis", "Experiment design", "Statistical review"],
    "output": "Research findings + methodology"
  },
  {
    "id": "agent-qa-test-engineer",
    "name": "qa-test-engineer",
    "color": "#f97316",
    "input": "Feature to test",
    "uses": ["Edge case generation", "Test code writing", "Load planning"],
    "output": "Comprehensive test suite"
  },
  {
    "id": "agent-skeptical-reviewer",
    "name": "skeptical-reviewer",
    "color": "#f97316",
    "input": "Proposal or decision",
    "uses": ["Assumption challenging", "Counter-arguments", "Evidence demands"],
    "output": "Stress-tested decision"
  },
  {
    "id": "agent-data-science",
    "name": "data-science-analytics",
    "color": "#f97316",
    "input": "Data + analysis question",
    "uses": ["EDA", "Statistical testing", "Visualization"],
    "output": "Analytical insights + charts"
  },
  {
    "id": "agent-ops-impact",
    "name": "ops-impact-analyst",
    "color": "#f97316",
    "input": "Feature or model change",
    "uses": ["KPI analysis", "Cost modeling", "ROI calculation"],
    "output": "Business impact report"
  },
  {
    "id": "agent-ceo-strategist",
    "name": "ceo-product-strategist",
    "color": "#f97316",
    "input": "Product or roadmap question",
    "uses": ["Market analysis", "Client value mapping", "Priority framework"],
    "output": "Strategic recommendation"
  },
  {
    "id": "agent-karpathy",
    "name": "andrej-karpathy",
    "color": "#f97316",
    "input": "Code or AI architecture",
    "uses": ["Simplicity lens", "First principles", "Complexity stripping"],
    "output": "Brutally simple implementation"
  },
  {
    "id": "agent-sutskever",
    "name": "ilya-sutskever",
    "color": "#f97316",
    "input": "AI trajectory question",
    "uses": ["Scaling analysis", "Safety reasoning", "Deep conviction"],
    "output": "Oracle-like AI assessment"
  },
  {
    "id": "agent-lecun",
    "name": "yann-lecun",
    "color": "#f97316",
    "input": "AI approach to critique",
    "uses": ["World-model thinking", "Hype detection", "Alternative proposals"],
    "output": "Contrarian AI perspective"
  },
  {
    "id": "agent-da-vinci",
    "name": "leonardo-da-vinci",
    "color": "#f97316",
    "input": "Design or architecture problem",
    "uses": ["Cross-domain patterns", "Nature-inspired design", "First principles"],
    "output": "Polymathic design insight"
  }
]
```

- [ ] **Step 2: Verify JSON parses**

```bash
cd /Users/sebabreguel/personal/dotfiles/animations && python3 -c "import json; d=json.load(open('flows.json')); print(f'{len(d)} items loaded')"
```

Expected: `45 items loaded` (approximately)

- [ ] **Step 3: Commit**

```bash
git add animations/flows.json
git commit -m "feat: add flow data for all claude-code items"
```

---

### Task 3: Batch generator script

**Files:**
- Create: `animations/generate_all.py`

- [ ] **Step 1: Create generate_all.py**

```python
#!/usr/bin/env python3
"""Generate Manim videos for all items in flows.json."""

import json
import os
import subprocess
import sys
from pathlib import Path

ANIMATIONS_DIR = Path(__file__).parent
SCENES_DIR = ANIMATIONS_DIR / "scenes"
OUTPUT_DIR = Path(__file__).parent.parent / "app" / "public" / "videos" / "items"


def render_item(item: dict) -> bool:
    """Render a single item's flow video. Returns True on success."""
    item_id = item["id"]
    gif_name = item_id

    env = os.environ.copy()
    env["FLOW_DATA"] = json.dumps(item)

    cmd = [
        sys.executable, "-m", "manim",
        "-ql", "--format=gif",
        "-o", gif_name,
        str(SCENES_DIR / "template.py"),
        "ItemFlowScene",
    ]

    print(f"  Rendering {item_id}...", end=" ", flush=True)
    result = subprocess.run(
        cmd, env=env, cwd=str(ANIMATIONS_DIR),
        capture_output=True, text=True,
    )

    if result.returncode != 0:
        print(f"FAIL")
        print(f"    stderr: {result.stderr[-200:]}")
        return False

    # Find and convert GIF to MP4
    gif_path = None
    media_dir = ANIMATIONS_DIR / "media"
    for gif in media_dir.rglob(f"{gif_name}.gif"):
        gif_path = gif
        break

    if not gif_path:
        print("FAIL (no GIF found)")
        return False

    mp4_path = OUTPUT_DIR / f"{item_id}.mp4"
    ffmpeg_cmd = [
        "ffmpeg", "-y", "-i", str(gif_path),
        "-movflags", "faststart",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
        "-c:v", "libx264", "-crf", "28", "-preset", "fast",
        str(mp4_path),
    ]

    ff_result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
    if ff_result.returncode != 0:
        print(f"FAIL (ffmpeg)")
        return False

    size_kb = mp4_path.stat().st_size // 1024
    print(f"OK ({size_kb}KB)")
    return True


def main():
    flows_path = ANIMATIONS_DIR / "flows.json"
    with open(flows_path) as f:
        items = json.load(f)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Filter by CLI arg if provided
    if len(sys.argv) > 1:
        filter_id = sys.argv[1]
        items = [i for i in items if i["id"] == filter_id]
        if not items:
            print(f"No item found with id '{filter_id}'")
            sys.exit(1)

    print(f"Generating {len(items)} videos...\n")

    success = 0
    fail = 0
    for item in items:
        if render_item(item):
            success += 1
        else:
            fail += 1

    print(f"\nDone: {success} OK, {fail} failed")


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Test with a single item**

```bash
cd /Users/sebabreguel/personal/dotfiles/animations && python3 generate_all.py plugin-context-mode
```

Expected: Renders one video, outputs `1 OK, 0 failed`, creates `app/public/videos/items/plugin-context-mode.mp4`.

- [ ] **Step 3: Commit**

```bash
git add animations/generate_all.py
git commit -m "feat: add batch generator for per-item Manim videos"
```

---

### Task 4: Generate all videos

- [ ] **Step 1: Run full batch generation**

```bash
cd /Users/sebabreguel/personal/dotfiles/animations && python3 generate_all.py
```

Expected: ~45 items rendered, all MP4s in `app/public/videos/items/`.

- [ ] **Step 2: Verify output**

```bash
ls -la /Users/sebabreguel/personal/dotfiles/app/public/videos/items/ | wc -l
```

Expected: ~45 MP4 files.

- [ ] **Step 3: Commit videos**

```bash
git add app/public/videos/items/
git commit -m "feat: generate all per-item flow videos"
```

---

### Task 5: Show videos in DetailPanel

**Files:**
- Modify: `app/src/components/DetailPanel.jsx`
- Modify: `app/src/App.css`

- [ ] **Step 1: Add video to DetailPanel**

In `app/src/components/DetailPanel.jsx`, add a video element after the description paragraph (line 47). Add this block between the `<p className="detail-desc">` and the `{item.why && (` block:

```jsx
          {item.category === 'claude-code' && (
            <div className="detail-video-wrap">
              <video
                key={item.id}
                autoPlay
                loop
                muted
                playsInline
                className="detail-video"
                onError={(e) => { e.target.parentElement.style.display = 'none' }}
              >
                <source src={`/videos/items/${item.id}.mp4`} type="video/mp4" />
              </video>
            </div>
          )}
```

- [ ] **Step 2: Add CSS styles**

Append to `app/src/App.css`:

```css
/* ========== Detail Video ========== */
.detail-video-wrap {
  margin: 1rem 0;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  background: #1a1a2e;
}

.detail-video {
  width: 100%;
  display: block;
}
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:5173`, click on a Claude Code plugin (e.g. context-mode). The video should autoplay in the detail panel. Click on a non-claude-code item — no video should appear.

- [ ] **Step 4: Commit**

```bash
git add app/src/components/DetailPanel.jsx app/src/App.css
git commit -m "feat: show per-item flow videos in DetailPanel"
```
