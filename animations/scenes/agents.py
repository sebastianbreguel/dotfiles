from manim import *
import sys

sys.path.insert(0, "/Users/sebabreguel/personal/dotfiles/animations")
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
        core = labeled_box(
            "Claude Code", CORE_WHITE, width=3, height=0.7, fill_opacity=0.25
        )
        core.shift(UP * 1.5)
        arr_in = Arrow(
            task.get_bottom(),
            core.get_top(),
            color=CORE_WHITE,
            buff=0.1,
            stroke_width=2,
        )
        self.play(GrowArrow(arr_in), FadeIn(core, scale=0.9), run_time=MEDIUM)

        # Fork into 2 agents
        agent1 = labeled_box("code-reviewer", ORANGE, width=3.5, height=0.7)
        agent1.shift(LEFT * 3.5)
        agent2 = labeled_box("refactor-architect", ORANGE, width=3.5, height=0.7)
        agent2.shift(RIGHT * 3.5)

        arr_l = Arrow(
            core.get_left(), agent1.get_top(), color=ORANGE, buff=0.1, stroke_width=2
        )
        arr_r = Arrow(
            core.get_right(), agent2.get_top(), color=ORANGE, buff=0.1, stroke_width=2
        )

        self.play(
            GrowArrow(arr_l),
            GrowArrow(arr_r),
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

        response = labeled_box(
            "Synthesized response", GREEN, width=4, height=0.6, fill_opacity=0.2
        )
        response.shift(DOWN * 1.5)
        arr_back_l = Arrow(
            agent1.get_bottom(),
            response.get_top() + LEFT * 0.5,
            color=GREEN,
            buff=0.1,
            stroke_width=2,
        )
        arr_back_r = Arrow(
            agent2.get_bottom(),
            response.get_top() + RIGHT * 0.5,
            color=GREEN,
            buff=0.1,
            stroke_width=2,
        )
        self.play(
            GrowArrow(arr_back_l),
            GrowArrow(arr_back_r),
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
            "Architecture": ["tech-lead", "refactor-arch", "db-engineering"],
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
