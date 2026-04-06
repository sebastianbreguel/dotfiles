from manim import *
import sys

sys.path.insert(0, "/Users/sebabreguel/personal/dotfiles/animations")
from common.styles import *
from common.components import labeled_box, section_label, code_text


class HooksScene(Scene):
    def setup(self):
        self.camera.background_color = BG_COLOR

    def construct(self):
        # --- Part 1: PreToolUse rewrite ---
        user_cmd = code_text("git status").shift(UP * 2.5)
        self.play(FadeIn(user_cmd, shift=DOWN * 0.3), run_time=FAST)

        hook_box = labeled_box("Hook: PreToolUse", CYAN, width=4, height=0.7)
        hook_box.shift(UP * 0.8)
        arr1 = Arrow(
            user_cmd.get_bottom(),
            hook_box.get_top(),
            color=CYAN,
            buff=0.1,
            stroke_width=2,
        )
        self.play(GrowArrow(arr1), FadeIn(hook_box, scale=0.9), run_time=MEDIUM)

        rewritten = code_text("rtk git status").shift(DOWN * 0.5)
        rewritten.set_color(CYAN)
        arr2 = Arrow(
            hook_box.get_bottom(),
            rewritten.get_top(),
            color=CYAN,
            buff=0.1,
            stroke_width=2,
        )
        self.play(GrowArrow(arr2), FadeIn(rewritten, shift=DOWN * 0.2), run_time=MEDIUM)

        savings = Text("60-90% fewer tokens", font_size=SMALL_SIZE, color=GREEN)
        savings.next_to(rewritten, DOWN, buff=0.3)
        self.play(FadeIn(savings, scale=0.8), run_time=FAST)
        self.wait(PAUSE)

        # Clear part 1
        self.play(
            *[FadeOut(m) for m in [user_cmd, arr1, hook_box, arr2, rewritten, savings]],
            run_time=FAST,
        )

        # --- Part 2: PostToolUse indexing ---
        output_label = code_text("Tool output (500 lines)").shift(UP * 2.5)
        self.play(FadeIn(output_label, shift=DOWN * 0.3), run_time=FAST)

        post_hook = labeled_box("Hook: PostToolUse", CYAN, width=4.5, height=0.7)
        post_hook.shift(UP * 0.8)
        arr3 = Arrow(
            output_label.get_bottom(),
            post_hook.get_top(),
            color=CYAN,
            buff=0.1,
            stroke_width=2,
        )
        self.play(GrowArrow(arr3), FadeIn(post_hook, scale=0.9), run_time=MEDIUM)

        ctx_box = labeled_box("context-mode", PURPLE, width=3.5, height=0.7)
        ctx_box.shift(DOWN * 0.5)
        arr4 = Arrow(
            post_hook.get_bottom(),
            ctx_box.get_top(),
            color=PURPLE,
            buff=0.1,
            stroke_width=2,
        )
        indexed = Text("indexed & searchable", font_size=SMALL_SIZE, color=PURPLE)
        indexed.next_to(ctx_box, DOWN, buff=0.3)
        self.play(GrowArrow(arr4), FadeIn(ctx_box, scale=0.9), run_time=MEDIUM)
        self.play(FadeIn(indexed, scale=0.8), run_time=FAST)

        # Final label
        final = section_label(
            "Hooks = invisible middleware optimizing every interaction"
        )
        self.play(FadeIn(final, shift=UP * 0.3), run_time=MEDIUM)
        self.wait(PAUSE)
