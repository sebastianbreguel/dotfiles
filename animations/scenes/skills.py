from manim import *
import sys

sys.path.insert(0, "/Users/sebabreguel/personal/dotfiles/animations")
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
        arr = Arrow(
            user_cmd.get_bottom(),
            skill_box.get_top(),
            color=GREEN,
            buff=0.1,
            stroke_width=2,
        )
        self.play(GrowArrow(arr), FadeIn(skill_box, scale=0.9), run_time=MEDIUM)

        # Pipeline steps
        steps = [
            "git status",
            "git diff",
            "git log",
            "draft msg",
            "commit",
            "push",
            "PR",
        ]
        step_boxes = []
        start_x = -4.5
        for i, step in enumerate(steps):
            box = labeled_box(
                step, GREEN, width=1.6, height=0.5, font_size=12, fill_opacity=0.1
            )
            box.move_to([start_x + i * 1.5, 0, 0])
            step_boxes.append(box)

        self.play(
            LaggedStart(
                *[FadeIn(b, shift=UP * 0.2) for b in step_boxes], lag_ratio=0.15
            ),
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
            "Process": [
                ("brainstorming", "→"),
                ("writing-plans", "→"),
                ("executing-plans", ""),
            ],
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
                    font_size=CODE_SIZE,
                    color=CORE_WHITE,
                    font="Monospace",
                )
                item_text.move_to([col_x[ci], 1.5 - i * 0.7, 0])
                self.play(FadeIn(item_text, shift=RIGHT * 0.2), run_time=0.2)

        # Final label
        final = section_label(
            "Skills = complete workflows activated with a slash command"
        )
        self.play(FadeIn(final, shift=UP * 0.3), run_time=MEDIUM)
        self.wait(PAUSE)
