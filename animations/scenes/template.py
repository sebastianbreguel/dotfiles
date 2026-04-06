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
        if input_text.width > 12:
            input_text.scale_to_fit_width(12)
        self.play(FadeIn(input_text, shift=DOWN * 0.2), run_time=FAST)

        # Arrow to main box
        main_box = labeled_box(name, color, width=5.5, height=1.0, fill_opacity=0.2)
        main_box.shift(UP * 1.2)
        arr_in = Arrow(
            input_text.get_bottom(),
            main_box.get_top(),
            color=color,
            buff=0.1,
            stroke_width=2,
        )
        self.play(GrowArrow(arr_in), FadeIn(main_box, scale=0.9), run_time=MEDIUM)

        # Uses boxes
        if uses:
            use_boxes = []
            total = len(uses)
            box_w = min(3.2, 12.0 / max(total, 1) - 0.8)
            spacing = box_w + 0.8
            start_x = -spacing * (total - 1) / 2
            use_font = SMALL_SIZE if total <= 3 else 20
            for i, use in enumerate(uses):
                box = labeled_box(
                    use,
                    color,
                    width=box_w,
                    height=0.7,
                    font_size=use_font,
                    fill_opacity=0.1,
                )
                box.move_to([start_x + i * spacing, -0.3, 0])
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

            use_arrows = []
            for box in use_boxes:
                arr = Arrow(
                    main_box.get_bottom(),
                    box.get_top(),
                    color=color,
                    buff=0.1,
                    stroke_width=1.5,
                    max_tip_length_to_length_ratio=0.15,
                )
                use_arrows.append(arr)
            self.play(*[GrowArrow(a) for a in use_arrows], run_time=FAST)

        # Output
        output_text = code_text(output).shift(DOWN * 2.2)
        if output_text.width > 12:
            output_text.scale_to_fit_width(12)

        if uses:
            out_arrows = []
            for box in use_boxes:
                arr = Arrow(
                    box.get_bottom(),
                    output_text.get_top(),
                    color=GREEN,
                    buff=0.1,
                    stroke_width=1.5,
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
                main_box.get_bottom(),
                output_text.get_top(),
                color=GREEN,
                buff=0.1,
                stroke_width=2,
            )
            self.play(
                GrowArrow(arr_out), FadeIn(output_text, shift=UP * 0.2), run_time=MEDIUM
            )

        self.wait(PAUSE)
