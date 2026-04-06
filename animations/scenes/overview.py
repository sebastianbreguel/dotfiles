from manim import *
import sys

sys.path.insert(0, "/Users/sebabreguel/personal/dotfiles/animations")
from common.styles import *
from common.components import labeled_box, section_label


class OverviewScene(Scene):
    def setup(self):
        self.camera.background_color = BG_COLOR

    def construct(self):
        # Core
        core = labeled_box(
            "Claude Code", CORE_WHITE, width=3, height=0.8, fill_opacity=0.25
        )
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
                corner_radius=0.2,
                width=w,
                height=h,
                color=color,
                fill_color=color,
                fill_opacity=0.08,
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
