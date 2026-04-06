from manim import *
import sys

sys.path.insert(0, "/Users/sebabreguel/personal/dotfiles/animations")
from common.styles import *
from common.components import labeled_box, section_label, code_text


class PluginsMcpScene(Scene):
    def setup(self):
        self.camera.background_color = BG_COLOR

    def construct(self):
        # Core
        core = labeled_box(
            "Claude Code", CORE_WHITE, width=3, height=0.7, fill_opacity=0.25
        )
        self.play(FadeIn(core, scale=0.8), run_time=FAST)

        # Plugins (left)
        plugins_title = Text(
            "Plugins", font_size=LABEL_SIZE, color=PURPLE, font="Monospace"
        )
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
            LaggedStart(
                *[FadeIn(b, shift=RIGHT * 0.3) for b in plugin_boxes], lag_ratio=0.3
            ),
            run_time=SLOW,
        )

        # MCP Servers (right)
        mcp_title = Text(
            "MCP Servers", font_size=LABEL_SIZE, color=MAGENTA, font="Monospace"
        )
        mcp_title.shift(RIGHT * 4.5 + UP * 2.5)
        self.play(FadeIn(mcp_title, shift=DOWN * 0.2), run_time=FAST)

        mcps = [
            ("ClickUp", "task management"),
            ("PostHog", "analytics & flags"),
            ("Excalidraw", "diagrams"),
        ]
        mcp_boxes = []
        for i, (name, desc) in enumerate(mcps):
            box = labeled_box(
                name, MAGENTA, width=3.5, height=0.55, font_size=CODE_SIZE
            )
            box.shift(RIGHT * 4.5 + UP * (1.3 - i * 0.9))
            mcp_boxes.append(box)

        self.play(
            LaggedStart(
                *[FadeIn(b, shift=LEFT * 0.3) for b in mcp_boxes], lag_ratio=0.3
            ),
            run_time=SLOW,
        )

        # Arrows to core
        arrows = []
        for box in plugin_boxes:
            arr = Arrow(
                box.get_right(),
                core.get_left(),
                color=PURPLE,
                buff=0.1,
                stroke_width=1.5,
            )
            arrows.append(arr)
        for box in mcp_boxes:
            arr = Arrow(
                box.get_left(),
                core.get_right(),
                color=MAGENTA,
                buff=0.1,
                stroke_width=1.5,
            )
            arrows.append(arr)

        self.play(*[GrowArrow(a) for a in arrows], run_time=MEDIUM)
        self.wait(0.5)

        # Mini example: context7 flow
        highlight = SurroundingRectangle(
            plugin_boxes[3], color=YELLOW, buff=0.08, stroke_width=2
        )
        query = code_text("Need React docs...").scale(0.7).next_to(core, DOWN, buff=0.5)
        self.play(Create(highlight), FadeIn(query), run_time=MEDIUM)
        self.wait(0.5)
        response = Text("Up-to-date docs returned", font_size=SMALL_SIZE, color=GREEN)
        response.next_to(query, DOWN, buff=0.3)
        self.play(FadeIn(response, shift=UP * 0.2), run_time=FAST)
        self.wait(0.3)
        self.play(FadeOut(highlight), FadeOut(query), FadeOut(response), run_time=FAST)

        # Final label
        final = section_label(
            "Plugins = local capabilities. MCP = external integrations."
        )
        self.play(FadeIn(final, shift=UP * 0.3), run_time=MEDIUM)
        self.wait(PAUSE)
