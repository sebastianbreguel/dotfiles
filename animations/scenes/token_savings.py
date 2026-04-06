from manim import *
import sys

sys.path.insert(0, "/Users/sebabreguel/personal/dotfiles/animations")
from common.styles import *
from common.components import labeled_box, section_label, code_text


class TokenSavingsScene(Scene):
    def setup(self):
        self.camera.background_color = BG_COLOR

    def construct(self):
        # Title
        title = Text(
            "A typical Claude Code request",
            font_size=LABEL_SIZE,
            color=CORE_WHITE,
            font="Monospace",
        )
        title.to_edge(UP, buff=0.5)
        self.play(FadeIn(title, shift=DOWN * 0.2), run_time=FAST)

        # User command
        user_cmd = code_text("git diff").next_to(title, DOWN, buff=0.5)
        self.play(FadeIn(user_cmd, shift=DOWN * 0.2), run_time=FAST)
        self.wait(0.3)

        # --- Step 1: PreToolUse Hook → RTK ---
        step1_label = Text(
            "1. PreToolUse Hook", font_size=SMALL_SIZE, color=CYAN, font="Monospace"
        )
        step1_label.shift(LEFT * 3.5 + UP * 0.5)
        self.play(FadeIn(step1_label, shift=RIGHT * 0.2), run_time=FAST)

        # Token bar: before
        bar_y = 0
        bar_before_1 = Rectangle(
            width=5,
            height=0.35,
            color=RED,
            fill_color=RED,
            fill_opacity=0.6,
            stroke_width=1,
        )
        bar_before_1.shift(LEFT * 1 + UP * bar_y)
        label_before_1 = Text(
            "1,000 tokens raw output", font_size=12, color=WHITE, font="Monospace"
        )
        label_before_1.move_to(bar_before_1.get_center())
        self.play(FadeIn(bar_before_1), FadeIn(label_before_1), run_time=FAST)

        # Arrow + RTK compression
        arrow1 = Arrow(
            LEFT * 1 + DOWN * 0.2,
            LEFT * 1 + DOWN * 0.6,
            color=CYAN,
            buff=0,
            stroke_width=2,
        )
        rtk_label = Text("RTK compresses", font_size=12, color=CYAN, font="Monospace")
        rtk_label.next_to(arrow1, RIGHT, buff=0.2)
        self.play(GrowArrow(arrow1), FadeIn(rtk_label), run_time=FAST)

        # Token bar: after RTK
        bar_after_1 = Rectangle(
            width=0.75,
            height=0.35,
            color=GREEN,
            fill_color=GREEN,
            fill_opacity=0.6,
            stroke_width=1,
        )
        bar_after_1.shift(LEFT * 3.1 + DOWN * 0.9)
        label_after_1 = Text("150 tokens", font_size=12, color=WHITE, font="Monospace")
        label_after_1.next_to(bar_after_1, RIGHT, buff=0.15)
        saving_1 = Text(
            "-85%", font_size=14, color=GREEN, font="Monospace", weight=BOLD
        )
        saving_1.next_to(label_after_1, RIGHT, buff=0.3)
        self.play(
            FadeIn(bar_after_1),
            FadeIn(label_after_1),
            FadeIn(saving_1),
            run_time=MEDIUM,
        )
        self.wait(0.5)

        # --- Step 2: context-mode indexing ---
        step2_label = Text(
            "2. context-mode indexes",
            font_size=SMALL_SIZE,
            color=PURPLE,
            font="Monospace",
        )
        step2_label.shift(LEFT * 3.2 + DOWN * 1.6)
        self.play(FadeIn(step2_label, shift=RIGHT * 0.2), run_time=FAST)

        # Explanation
        ctx_explain = Text(
            "Large outputs → knowledge base, not context window",
            font_size=12,
            color=DIM_TEXT,
            font="Monospace",
        )
        ctx_explain.shift(DOWN * 2.1)
        bar_ctx = Rectangle(
            width=0.3,
            height=0.35,
            color=GREEN,
            fill_color=GREEN,
            fill_opacity=0.6,
            stroke_width=1,
        )
        bar_ctx.shift(LEFT * 3.35 + DOWN * 2.5)
        label_ctx = Text(
            "50 tokens (summary only)", font_size=12, color=WHITE, font="Monospace"
        )
        label_ctx.next_to(bar_ctx, RIGHT, buff=0.15)
        saving_2 = Text(
            "-67%", font_size=14, color=GREEN, font="Monospace", weight=BOLD
        )
        saving_2.next_to(label_ctx, RIGHT, buff=0.3)
        self.play(FadeIn(ctx_explain), run_time=FAST)
        self.play(FadeIn(bar_ctx), FadeIn(label_ctx), FadeIn(saving_2), run_time=MEDIUM)
        self.wait(0.5)

        # Clear all intermediate
        self.play(*[FadeOut(m) for m in self.mobjects], run_time=FAST)

        # --- Final comparison ---
        compare_title = Text(
            "Total token cost per interaction",
            font_size=LABEL_SIZE,
            color=CORE_WHITE,
            font="Monospace",
        )
        compare_title.to_edge(UP, buff=0.8)
        self.play(FadeIn(compare_title, shift=DOWN * 0.2), run_time=FAST)

        # Without optimization
        without_label = Text(
            "Without optimization", font_size=SMALL_SIZE, color=RED, font="Monospace"
        )
        without_label.shift(UP * 1.2 + LEFT * 1.5)
        bar_without = Rectangle(
            width=6,
            height=0.6,
            color=RED,
            fill_color=RED,
            fill_opacity=0.5,
            stroke_width=1,
        )
        bar_without.next_to(without_label, DOWN, buff=0.3).align_to(without_label, LEFT)
        without_tokens = Text(
            "~5,000 tokens", font_size=SMALL_SIZE, color=WHITE, font="Monospace"
        )
        without_tokens.move_to(bar_without.get_center())
        self.play(
            FadeIn(without_label),
            FadeIn(bar_without),
            FadeIn(without_tokens),
            run_time=MEDIUM,
        )

        # With ecosystem
        with_label = Text(
            "With ecosystem", font_size=SMALL_SIZE, color=GREEN, font="Monospace"
        )
        with_label.shift(DOWN * 0.3 + LEFT * 1.5)
        bar_with = Rectangle(
            width=0.96,
            height=0.6,
            color=GREEN,
            fill_color=GREEN,
            fill_opacity=0.5,
            stroke_width=1,
        )
        bar_with.next_to(with_label, DOWN, buff=0.3).align_to(with_label, LEFT)
        with_tokens = Text(
            "~800 tokens", font_size=SMALL_SIZE, color=WHITE, font="Monospace"
        )
        with_tokens.next_to(bar_with, RIGHT, buff=0.2)
        self.play(
            FadeIn(with_label), FadeIn(bar_with), FadeIn(with_tokens), run_time=MEDIUM
        )

        # Savings highlight
        savings_pct = Text(
            "84% savings",
            font_size=TITLE_SIZE,
            color=GREEN,
            font="Monospace",
            weight=BOLD,
        )
        savings_pct.shift(DOWN * 2)
        self.play(FadeIn(savings_pct, scale=1.3), run_time=MEDIUM)

        # Final label
        final = section_label(
            "Every interaction passes through multiple optimization layers"
        )
        self.play(FadeIn(final, shift=UP * 0.3), run_time=MEDIUM)
        self.wait(PAUSE)
