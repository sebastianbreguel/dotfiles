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
    arrow = Arrow(
        start.get_bottom()
        if start.get_center()[1] > end.get_center()[1]
        else start.get_right(),
        end.get_top()
        if start.get_center()[1] > end.get_center()[1]
        else end.get_left(),
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
    return Text(text, font_size=SMALL_SIZE, color=color, slant=ITALIC).to_edge(
        DOWN, buff=0.4
    )


def code_text(text: str, font_size: int = CODE_SIZE) -> Text:
    return Text(text, font_size=font_size, color=CORE_WHITE, font="Monospace")
