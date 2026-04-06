# Claude Code Ecosystem Animations — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 5 independent Manim GIF animations showing how each layer of the Claude Code ecosystem works, for onboarding.

**Architecture:** Modular Manim scenes sharing a common style/component library. Each scene renders independently to GIF. A Makefile orchestrates rendering.

**Tech Stack:** Python 3.10+, Manim Community Edition, ffmpeg, Pillow

---

## File Structure

```
animations/
├── common/
│   ├── styles.py            # Color palette, font sizes, shared constants
│   └── components.py        # Reusable: labeled_box(), arrow_between(), section_label()
├── scenes/
│   ├── overview.py          # Scene 1: big picture layers
│   ├── hooks.py             # Scene 2: hooks flow
│   ├── plugins_mcp.py       # Scene 3: plugins + MCP servers
│   ├── skills.py            # Scene 4: skills workflows
│   └── agents.py            # Scene 5: agent parallelism
├── output/                  # Generated GIFs
├── Makefile
└── requirements.txt
```

---

### Task 1: Project scaffold and common library

**Files:**
- Create: `animations/requirements.txt`
- Create: `animations/Makefile`
- Create: `animations/common/__init__.py`
- Create: `animations/common/styles.py`
- Create: `animations/common/components.py`
- Create: `animations/scenes/__init__.py`
- Create: `animations/output/.gitkeep`

- [ ] **Step 1: Create requirements.txt**

```txt
manim>=0.18.0
Pillow>=10.0.0
```

- [ ] **Step 2: Create Makefile**

```makefile
SCENES = overview hooks plugins_mcp skills agents
OUTPUT = output
QUALITY = -ql --format=gif

.PHONY: all clean $(SCENES)

all: $(SCENES)

$(SCENES):
	manim $(QUALITY) -o $@ scenes/$@.py $$(python -c "print(''.join(w.title() for w in '$@'.split('_')) + 'Scene')")
	mv media/videos/*/480p15/$@.gif $(OUTPUT)/

clean:
	rm -rf media $(OUTPUT)/*.gif
```

- [ ] **Step 3: Create styles.py**

```python
from manim import *

# Background
BG_COLOR = "#1a1a2e"

# Layer colors
CYAN = "#00d2ff"      # Hooks
PURPLE = "#a855f7"    # Plugins
MAGENTA = "#ec4899"   # MCP Servers
GREEN = "#22c55e"     # Skills
ORANGE = "#f97316"    # Agents
CORE_WHITE = "#e2e8f0"
DIM_TEXT = "#94a3b8"

# Font sizes
TITLE_SIZE = 36
LABEL_SIZE = 24
SMALL_SIZE = 18
CODE_SIZE = 16

# Animation timing
FAST = 0.4
MEDIUM = 0.7
SLOW = 1.0
PAUSE = 1.2
```

- [ ] **Step 4: Create components.py**

```python
from manim import *
from common.styles import *


def labeled_box(
    text: str,
    color: str,
    width: float = 3.5,
    height: float = 0.7,
    font_size: int = LABEL_SIZE,
    fill_opacity: float = 0.15,
) -> VGroup:
    """A rounded rectangle with centered text label."""
    rect = RoundedRectangle(
        corner_radius=0.15,
        width=width,
        height=height,
        color=color,
        fill_color=color,
        fill_opacity=fill_opacity,
        stroke_width=2,
    )
    label = Text(text, font_size=font_size, color=WHITE, font="Monospace")
    label.move_to(rect.get_center())
    group = VGroup(rect, label)
    return group


def arrow_between(
    start: Mobject,
    end: Mobject,
    color: str = CORE_WHITE,
    label_text: str | None = None,
    buff: float = 0.15,
) -> VGroup:
    """Arrow from start mobject to end mobject, optionally labeled."""
    arrow = Arrow(
        start.get_bottom() if start.get_center()[1] > end.get_center()[1] else start.get_right(),
        end.get_top() if start.get_center()[1] > end.get_center()[1] else end.get_left(),
        color=color,
        buff=buff,
        stroke_width=2,
        max_tip_length_to_length_ratio=0.15,
    )
    group = VGroup(arrow)
    if label_text:
        lbl = Text(label_text, font_size=SMALL_SIZE, color=DIM_TEXT)
        lbl.next_to(arrow, UP, buff=0.05)
        group.add(lbl)
    return group


def section_label(text: str, color: str = DIM_TEXT) -> Text:
    """Italic label for section captions at the bottom."""
    return Text(text, font_size=SMALL_SIZE, color=color, slant=ITALIC).to_edge(DOWN, buff=0.4)


def code_text(text: str, font_size: int = CODE_SIZE) -> Text:
    """Monospace text for code snippets."""
    return Text(text, font_size=font_size, color=CORE_WHITE, font="Monospace")
```

- [ ] **Step 5: Create empty __init__.py files and output dir**

```bash
mkdir -p animations/common animations/scenes animations/output
touch animations/common/__init__.py animations/scenes/__init__.py animations/output/.gitkeep
```

- [ ] **Step 6: Commit scaffold**

```bash
git add animations/
git commit -m "feat: add Manim animation scaffold with common styles and components"
```

---

### Task 2: Scene 1 — Overview

**Files:**
- Create: `animations/scenes/overview.py`

- [ ] **Step 1: Write overview scene**

```python
from manim import *
from common.styles import *
from common.components import labeled_box, section_label

class OverviewScene(Scene):
    def setup(self):
        self.camera.background_color = BG_COLOR

    def construct(self):
        # Core
        core = labeled_box("Claude Code", CORE_WHITE, width=3, height=0.8, fill_opacity=0.25)
        self.play(FadeIn(core, scale=0.8), run_time=MEDIUM)
        self.wait(0.5)

        # Layers: innermost to outermost
        layers_data = [
            ("Hooks", CYAN, 5.5, 1.6, "intercept every command"),
            ("Plugins / MCP", PURPLE, 8, 2.6, "always-on services"),
            ("Skills", GREEN, 10.5, 3.6, "on-demand workflows"),
            ("Agents", ORANGE, 13, 4.6, "specialized subagents"),
        ]

        layer_groups = []
        for name, color, w, h, desc in layers_data:
            rect = RoundedRectangle(
                corner_radius=0.2, width=w, height=h,
                color=color, fill_color=color, fill_opacity=0.08,
                stroke_width=2,
            )
            label = Text(name, font_size=LABEL_SIZE, color=color, font="Monospace")
            label.next_to(rect, UP, buff=-0.35).align_to(rect, LEFT).shift(RIGHT * 0.3)
            desc_text = Text(desc, font_size=SMALL_SIZE, color=DIM_TEXT, slant=ITALIC)
            desc_text.next_to(rect, DOWN, buff=-0.3)
            group = VGroup(rect, label, desc_text)
            layer_groups.append(group)

        for lg in layer_groups:
            self.play(FadeIn(lg, scale=0.95), run_time=MEDIUM)
            self.wait(0.3)

        # Final label
        final = section_label("Each layer amplifies what Claude Code can do")
        self.play(FadeIn(final, shift=UP * 0.3), run_time=MEDIUM)
        self.wait(PAUSE)
```

- [ ] **Step 2: Test render**

```bash
cd animations && manim -ql --format=gif -o overview scenes/overview.py OverviewScene
```

Expected: GIF renders showing concentric layers appearing around "Claude Code" core.

- [ ] **Step 3: Commit**

```bash
git add animations/scenes/overview.py
git commit -m "feat: add overview scene — ecosystem layers animation"
```

---

### Task 3: Scene 2 — Hooks

**Files:**
- Create: `animations/scenes/hooks.py`

- [ ] **Step 1: Write hooks scene**

```python
from manim import *
from common.styles import *
from common.components import labeled_box, arrow_between, section_label, code_text

class HooksScene(Scene):
    def setup(self):
        self.camera.background_color = BG_COLOR

    def construct(self):
        # --- Part 1: PreToolUse rewrite ---
        user_cmd = code_text("git status").shift(UP * 2.5)
        self.play(FadeIn(user_cmd, shift=DOWN * 0.3), run_time=FAST)

        hook_box = labeled_box("Hook: PreToolUse", CYAN, width=4, height=0.7)
        hook_box.shift(UP * 0.8)
        arr1 = Arrow(user_cmd.get_bottom(), hook_box.get_top(), color=CYAN, buff=0.1, stroke_width=2)
        self.play(GrowArrow(arr1), FadeIn(hook_box, scale=0.9), run_time=MEDIUM)

        rewritten = code_text("rtk git status").shift(DOWN * 0.5)
        rewritten.set_color(CYAN)
        arr2 = Arrow(hook_box.get_bottom(), rewritten.get_top(), color=CYAN, buff=0.1, stroke_width=2)
        self.play(GrowArrow(arr2), FadeIn(rewritten, shift=DOWN * 0.2), run_time=MEDIUM)

        savings = Text("60-90% fewer tokens", font_size=SMALL_SIZE, color=GREEN)
        savings.next_to(rewritten, DOWN, buff=0.3)
        self.play(FadeIn(savings, scale=0.8), run_time=FAST)
        self.wait(PAUSE)

        # Clear part 1
        self.play(*[FadeOut(m) for m in [user_cmd, arr1, hook_box, arr2, rewritten, savings]], run_time=FAST)

        # --- Part 2: PostToolUse indexing ---
        output_label = code_text("Tool output (500 lines)").shift(UP * 2.5)
        self.play(FadeIn(output_label, shift=DOWN * 0.3), run_time=FAST)

        post_hook = labeled_box("Hook: PostToolUse", CYAN, width=4.5, height=0.7)
        post_hook.shift(UP * 0.8)
        arr3 = Arrow(output_label.get_bottom(), post_hook.get_top(), color=CYAN, buff=0.1, stroke_width=2)
        self.play(GrowArrow(arr3), FadeIn(post_hook, scale=0.9), run_time=MEDIUM)

        ctx_box = labeled_box("context-mode", PURPLE, width=3.5, height=0.7)
        ctx_box.shift(DOWN * 0.5)
        arr4 = Arrow(post_hook.get_bottom(), ctx_box.get_top(), color=PURPLE, buff=0.1, stroke_width=2)
        indexed = Text("indexed & searchable", font_size=SMALL_SIZE, color=PURPLE)
        indexed.next_to(ctx_box, DOWN, buff=0.3)
        self.play(GrowArrow(arr4), FadeIn(ctx_box, scale=0.9), run_time=MEDIUM)
        self.play(FadeIn(indexed, scale=0.8), run_time=FAST)

        # Final label
        final = section_label("Hooks = invisible middleware optimizing every interaction")
        self.play(FadeIn(final, shift=UP * 0.3), run_time=MEDIUM)
        self.wait(PAUSE)
```

- [ ] **Step 2: Test render**

```bash
cd animations && manim -ql --format=gif -o hooks scenes/hooks.py HooksScene
```

- [ ] **Step 3: Commit**

```bash
git add animations/scenes/hooks.py
git commit -m "feat: add hooks scene — PreToolUse and PostToolUse animation"
```

---

### Task 4: Scene 3 — Plugins + MCP

**Files:**
- Create: `animations/scenes/plugins_mcp.py`

- [ ] **Step 1: Write plugins_mcp scene**

```python
from manim import *
from common.styles import *
from common.components import labeled_box, section_label, code_text

class PluginsMcpScene(Scene):
    def setup(self):
        self.camera.background_color = BG_COLOR

    def construct(self):
        # Core
        core = labeled_box("Claude Code", CORE_WHITE, width=3, height=0.7, fill_opacity=0.25)
        self.play(FadeIn(core, scale=0.8), run_time=FAST)

        # Plugins (left)
        plugins_title = Text("Plugins", font_size=LABEL_SIZE, color=PURPLE, font="Monospace")
        plugins_title.shift(LEFT * 4.5 + UP * 2.5)
        self.play(FadeIn(plugins_title, shift=DOWN * 0.2), run_time=FAST)

        plugins = [
            ("context-mode", "index & save tokens"),
            ("claude-mem", "cross-session memory"),
            ("playwright", "browser automation"),
            ("context7", "live library docs"),
        ]
        plugin_boxes = []
        for i, (name, desc) in enumerate(plugins):
            box = labeled_box(name, PURPLE, width=3.5, height=0.55, font_size=CODE_SIZE)
            box.shift(LEFT * 4.5 + UP * (1.3 - i * 0.9))
            plugin_boxes.append(box)

        self.play(
            LaggedStart(*[FadeIn(b, shift=RIGHT * 0.3) for b in plugin_boxes], lag_ratio=0.3),
            run_time=SLOW,
        )

        # MCP Servers (right)
        mcp_title = Text("MCP Servers", font_size=LABEL_SIZE, color=MAGENTA, font="Monospace")
        mcp_title.shift(RIGHT * 4.5 + UP * 2.5)
        self.play(FadeIn(mcp_title, shift=DOWN * 0.2), run_time=FAST)

        mcps = [
            ("ClickUp", "task management"),
            ("PostHog", "analytics & flags"),
            ("Excalidraw", "diagrams"),
        ]
        mcp_boxes = []
        for i, (name, desc) in enumerate(mcps):
            box = labeled_box(name, MAGENTA, width=3.5, height=0.55, font_size=CODE_SIZE)
            box.shift(RIGHT * 4.5 + UP * (1.3 - i * 0.9))
            mcp_boxes.append(box)

        self.play(
            LaggedStart(*[FadeIn(b, shift=LEFT * 0.3) for b in mcp_boxes], lag_ratio=0.3),
            run_time=SLOW,
        )

        # Arrows to core
        arrows = []
        for box in plugin_boxes:
            arr = Arrow(box.get_right(), core.get_left(), color=PURPLE, buff=0.1, stroke_width=1.5)
            arrows.append(arr)
        for box in mcp_boxes:
            arr = Arrow(box.get_left(), core.get_right(), color=MAGENTA, buff=0.1, stroke_width=1.5)
            arrows.append(arr)

        self.play(*[GrowArrow(a) for a in arrows], run_time=MEDIUM)
        self.wait(0.5)

        # Mini example: context7 flow
        highlight = SurroundingRectangle(plugin_boxes[3], color=YELLOW, buff=0.08, stroke_width=2)
        query = code_text("Need React docs...").scale(0.7).next_to(core, DOWN, buff=0.5)
        self.play(Create(highlight), FadeIn(query), run_time=MEDIUM)
        self.wait(0.5)
        response = Text("Up-to-date docs returned", font_size=SMALL_SIZE, color=GREEN)
        response.next_to(query, DOWN, buff=0.3)
        self.play(FadeIn(response, shift=UP * 0.2), run_time=FAST)
        self.wait(0.3)
        self.play(FadeOut(highlight), FadeOut(query), FadeOut(response), run_time=FAST)

        # Final label
        final = section_label("Plugins = local capabilities. MCP = external integrations.")
        self.play(FadeIn(final, shift=UP * 0.3), run_time=MEDIUM)
        self.wait(PAUSE)
```

- [ ] **Step 2: Test render**

```bash
cd animations && manim -ql --format=gif -o plugins_mcp scenes/plugins_mcp.py PluginsMcpScene
```

- [ ] **Step 3: Commit**

```bash
git add animations/scenes/plugins_mcp.py
git commit -m "feat: add plugins + MCP scene — local vs external integrations"
```

---

### Task 5: Scene 4 — Skills

**Files:**
- Create: `animations/scenes/skills.py`

- [ ] **Step 1: Write skills scene**

```python
from manim import *
from common.styles import *
from common.components import labeled_box, section_label, code_text

class SkillsScene(Scene):
    def setup(self):
        self.camera.background_color = BG_COLOR

    def construct(self):
        # User types /commit
        user_cmd = code_text("/commit").shift(UP * 3)
        self.play(FadeIn(user_cmd, shift=DOWN * 0.3), run_time=FAST)

        # Skill box
        skill_box = labeled_box("Skill: ship-pr", GREEN, width=4, height=0.7)
        skill_box.shift(UP * 1.8)
        arr = Arrow(user_cmd.get_bottom(), skill_box.get_top(), color=GREEN, buff=0.1, stroke_width=2)
        self.play(GrowArrow(arr), FadeIn(skill_box, scale=0.9), run_time=MEDIUM)

        # Pipeline steps
        steps = ["git status", "git diff", "git log", "draft msg", "commit", "push", "PR"]
        step_boxes = []
        start_x = -4.5
        for i, step in enumerate(steps):
            box = labeled_box(step, GREEN, width=1.6, height=0.5, font_size=12, fill_opacity=0.1)
            box.move_to([start_x + i * 1.5, 0, 0])
            step_boxes.append(box)

        self.play(
            LaggedStart(*[FadeIn(b, shift=UP * 0.2) for b in step_boxes], lag_ratio=0.15),
            run_time=SLOW,
        )

        # Check each step
        checks = []
        for box in step_boxes:
            check = Text("✓", font_size=20, color=GREEN)
            check.move_to(box.get_center())
            checks.append(check)

        self.play(
            LaggedStart(*[FadeIn(c, scale=1.5) for c in checks], lag_ratio=0.12),
            run_time=SLOW,
        )
        self.wait(0.5)

        # Clear pipeline
        self.play(
            *[FadeOut(m) for m in [user_cmd, arr, skill_box, *step_boxes, *checks]],
            run_time=FAST,
        )

        # Skill categories
        categories = {
            "Process": [("brainstorming", "→"), ("writing-plans", "→"), ("executing-plans", "")],
            "QA": [("test-and-fix", ""), ("pre-merge-review", ""), ("explore-app", "")],
            "Ops": [("dream", ""), ("doc-sync", ""), ("weekly-retro", "")],
        }

        col_x = [-4, 0, 4]
        for ci, (cat_name, items) in enumerate(categories.items()):
            title = Text(cat_name, font_size=LABEL_SIZE, color=GREEN, font="Monospace")
            title.move_to([col_x[ci], 2.5, 0])
            self.play(FadeIn(title, shift=DOWN * 0.2), run_time=0.3)

            for i, (name, connector) in enumerate(items):
                item_text = Text(
                    f"{name} {connector}" if connector else name,
                    font_size=CODE_SIZE, color=CORE_WHITE, font="Monospace",
                )
                item_text.move_to([col_x[ci], 1.5 - i * 0.7, 0])
                self.play(FadeIn(item_text, shift=RIGHT * 0.2), run_time=0.2)

        # Final label
        final = section_label("Skills = complete workflows activated with a slash command")
        self.play(FadeIn(final, shift=UP * 0.3), run_time=MEDIUM)
        self.wait(PAUSE)
```

- [ ] **Step 2: Test render**

```bash
cd animations && manim -ql --format=gif -o skills scenes/skills.py SkillsScene
```

- [ ] **Step 3: Commit**

```bash
git add animations/scenes/skills.py
git commit -m "feat: add skills scene — slash command workflows animation"
```

---

### Task 6: Scene 5 — Agents

**Files:**
- Create: `animations/scenes/agents.py`

- [ ] **Step 1: Write agents scene**

```python
from manim import *
from common.styles import *
from common.components import labeled_box, section_label, code_text

class AgentsScene(Scene):
    def setup(self):
        self.camera.background_color = BG_COLOR

    def construct(self):
        # Task arrives
        task = code_text("Review PR + plan refactor").shift(UP * 3)
        self.play(FadeIn(task, shift=DOWN * 0.3), run_time=FAST)

        # Claude Code core
        core = labeled_box("Claude Code", CORE_WHITE, width=3, height=0.7, fill_opacity=0.25)
        core.shift(UP * 1.5)
        arr_in = Arrow(task.get_bottom(), core.get_top(), color=CORE_WHITE, buff=0.1, stroke_width=2)
        self.play(GrowArrow(arr_in), FadeIn(core, scale=0.9), run_time=MEDIUM)

        # Fork into 2 agents
        agent1 = labeled_box("code-reviewer", ORANGE, width=3.5, height=0.7)
        agent1.shift(LEFT * 3.5)
        agent2 = labeled_box("refactor-architect", ORANGE, width=3.5, height=0.7)
        agent2.shift(RIGHT * 3.5)

        arr_l = Arrow(core.get_left(), agent1.get_top(), color=ORANGE, buff=0.1, stroke_width=2)
        arr_r = Arrow(core.get_right(), agent2.get_top(), color=ORANGE, buff=0.1, stroke_width=2)

        self.play(
            GrowArrow(arr_l), GrowArrow(arr_r),
            FadeIn(agent1, shift=LEFT * 0.3),
            FadeIn(agent2, shift=RIGHT * 0.3),
            run_time=MEDIUM,
        )

        # Parallel work indicators
        spin1 = Text("analyzing diff...", font_size=SMALL_SIZE, color=DIM_TEXT)
        spin1.next_to(agent1, DOWN, buff=0.3)
        spin2 = Text("designing plan...", font_size=SMALL_SIZE, color=DIM_TEXT)
        spin2.next_to(agent2, DOWN, buff=0.3)
        self.play(FadeIn(spin1), FadeIn(spin2), run_time=FAST)
        self.wait(0.8)

        # Results converge
        done1 = Text("✓ review complete", font_size=SMALL_SIZE, color=GREEN)
        done1.move_to(spin1)
        done2 = Text("✓ plan ready", font_size=SMALL_SIZE, color=GREEN)
        done2.move_to(spin2)
        self.play(
            ReplacementTransform(spin1, done1),
            ReplacementTransform(spin2, done2),
            run_time=MEDIUM,
        )

        arr_back_l = Arrow(agent1.get_bottom(), core.get_bottom() + DOWN * 0.8, color=GREEN, buff=0.1, stroke_width=2)
        arr_back_r = Arrow(agent2.get_bottom(), core.get_bottom() + DOWN * 0.8, color=GREEN, buff=0.1, stroke_width=2)

        response = labeled_box("Synthesized response", GREEN, width=4, height=0.6, fill_opacity=0.2)
        response.shift(DOWN * 1.5)
        self.play(
            GrowArrow(arr_back_l), GrowArrow(arr_back_r),
            FadeIn(response, scale=0.9),
            run_time=MEDIUM,
        )
        self.wait(0.5)

        # Clear and show agent grid
        self.play(
            *[FadeOut(m) for m in self.mobjects],
            run_time=FAST,
        )

        # Agent grid
        grid = {
            "Code": ["code-reviewer", "code-simplifier", "code-modularizer"],
            "Architecture": ["tech-lead", "refactor-architect", "db-engineering"],
            "AI/ML": ["ai-ml-expert", "prompt-eng", "ai-researcher"],
            "Personas": ["karpathy", "sutskever", "lecun", "da-vinci"],
        }

        col_x = [-5, -1.5, 2, 5.5]
        for ci, (cat, agents) in enumerate(grid.items()):
            title = Text(cat, font_size=LABEL_SIZE, color=ORANGE, font="Monospace")
            title.move_to([col_x[ci], 2.5, 0])
            self.play(FadeIn(title, shift=DOWN * 0.2), run_time=0.2)

            for i, agent_name in enumerate(agents):
                txt = Text(agent_name, font_size=14, color=CORE_WHITE, font="Monospace")
                txt.move_to([col_x[ci], 1.5 - i * 0.7, 0])
                self.play(FadeIn(txt, shift=RIGHT * 0.1), run_time=0.15)

        # Final label
        final = section_label("Agents = on-demand specialists that work in parallel")
        self.play(FadeIn(final, shift=UP * 0.3), run_time=MEDIUM)
        self.wait(PAUSE)
```

- [ ] **Step 2: Test render**

```bash
cd animations && manim -ql --format=gif -o agents scenes/agents.py AgentsScene
```

- [ ] **Step 3: Commit**

```bash
git add animations/scenes/agents.py
git commit -m "feat: add agents scene — parallel subagent animation"
```

---

### Task 7: Install dependencies and render all

- [ ] **Step 1: Install Manim**

```bash
pip install manim Pillow
```

Verify: `manim --version` should output Manim Community version.

- [ ] **Step 2: Render all scenes**

```bash
cd animations && make all
```

Expected: 5 GIFs in `animations/output/`: `overview.gif`, `hooks.gif`, `plugins_mcp.gif`, `skills.gif`, `agents.gif`

- [ ] **Step 3: Verify GIFs**

Open each GIF and verify:
- Animations play smoothly
- Text is readable
- Colors match the style spec
- Each GIF is ~15-25 seconds

- [ ] **Step 4: Fix any rendering issues**

Iterate on positioning, timing, or text sizes as needed.

- [ ] **Step 5: Final commit**

```bash
git add animations/output/*.gif
git commit -m "feat: render all 5 ecosystem animation GIFs"
```
