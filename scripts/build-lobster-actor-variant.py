#!/usr/bin/env python3

import json
import math
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
TARGET_ROOT = ROOT / "public/assets/generated/actors/lobster-claw-v1"
FRAME_SIZE = 32
OUTPUT_SCALE = 4
OUTPUT_SIZE = FRAME_SIZE * OUTPUT_SCALE

OUTLINE = (55, 12, 8, 255)
SHELL_DARK = (148, 36, 24, 255)
SHELL_MID = (206, 74, 44, 255)
SHELL_LIGHT = (255, 138, 99, 255)
UNDERBELLY = (255, 202, 146, 255)
EYE = (255, 252, 242, 255)
SHADOW = (25, 12, 12, 88)
PROP_PAPER = (240, 236, 224, 255)
PROP_BOOK = (86, 56, 124, 255)
PROP_TOOL = (146, 176, 192, 255)
PROP_COFFEE = (140, 92, 58, 255)
PROP_IDEA = (255, 222, 99, 255)
PROP_ERROR = (255, 80, 96, 255)

ACTIONS = [
    {"id": "stand_back", "kind": "back", "frames": 12, "fps": 6},
    {"id": "stand_front", "kind": "front", "frames": 12, "fps": 6},
    {"id": "rest", "kind": "front", "frames": 10, "fps": 6, "pose": "rest"},
    {"id": "sleep", "kind": "side", "frames": 10, "fps": 6, "pose": "sleep"},
    {"id": "coffee", "kind": "side", "frames": 12, "fps": 6, "pose": "coffee"},
    {"id": "lie_flat", "kind": "flat", "frames": 10, "fps": 6},
    {"id": "walk", "kind": "side", "frames": 12, "fps": 7, "pose": "walk"},
    {"id": "work", "kind": "side", "frames": 12, "fps": 6, "pose": "work"},
    {"id": "read", "kind": "side", "frames": 12, "fps": 6, "pose": "read"},
    {"id": "idea", "kind": "side", "frames": 12, "fps": 6, "pose": "idea"},
    {"id": "repair", "kind": "side", "frames": 12, "fps": 6, "pose": "repair"},
    {"id": "error", "kind": "side", "frames": 12, "fps": 6, "pose": "error"},
]


def make_canvas() -> Image.Image:
    return Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))


def scale_canvas(image: Image.Image) -> Image.Image:
    return image.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.Resampling.NEAREST)


def draw_shadow(draw: ImageDraw.ImageDraw, center_x: int, center_y: int, width: int, height: int) -> None:
    draw.ellipse((center_x - width, center_y - height, center_x + width, center_y + height), fill=SHADOW)


def draw_rect(draw: ImageDraw.ImageDraw, x0: int, y0: int, x1: int, y1: int, fill) -> None:
    draw.rectangle((x0, y0, x1, y1), fill=fill)


def draw_line(draw: ImageDraw.ImageDraw, points, fill, width: int = 1) -> None:
    draw.line(points, fill=fill, width=width)


def draw_side_lobster(draw: ImageDraw.ImageDraw, frame_index: int, frame_count: int, pose: str) -> None:
    cycle = (frame_index / max(1, frame_count))
    step = frame_index % 4
    bob = 1 if pose in {"walk", "coffee"} and step in {1, 2} else 0
    body_y = 16 + bob
    tail_x = 8
    head_x = 20

    draw_shadow(draw, 16, 26, 7, 2)

    # Tail fan
    draw.polygon([(tail_x, body_y + 1), (tail_x - 2, body_y - 1), (tail_x - 2, body_y + 3)], fill=SHELL_DARK)
    draw.polygon([(tail_x + 1, body_y + 1), (tail_x - 1, body_y - 2), (tail_x + 1, body_y - 1)], fill=SHELL_LIGHT)

    # Tail/body segments
    draw_rect(draw, 9, body_y - 1, 11, body_y + 2, SHELL_DARK)
    draw_rect(draw, 10, body_y, 18, body_y + 4, SHELL_MID)
    draw_rect(draw, 11, body_y + 1, 17, body_y + 2, SHELL_LIGHT)
    draw_rect(draw, 18, body_y - 1, 22, body_y + 4, SHELL_DARK)
    draw_rect(draw, 18, body_y, 23, body_y + 3, SHELL_MID)
    draw_rect(draw, 19, body_y + 1, 22, body_y + 2, SHELL_LIGHT)

    # Underbelly
    draw_rect(draw, 12, body_y + 4, 20, body_y + 5, UNDERBELLY)

    # Eyes and antennae
    draw_rect(draw, head_x + 2, body_y, head_x + 2, body_y, EYE)
    draw_rect(draw, head_x + 3, body_y + 1, head_x + 3, body_y + 1, OUTLINE)
    antenna_shift = -1 if step in {0, 1} else 1
    draw_line(draw, [(head_x + 2, body_y - 1), (27, 9 + antenna_shift)], SHELL_LIGHT)
    draw_line(draw, [(head_x + 1, body_y), (26, 12 - antenna_shift)], SHELL_LIGHT)

    # Legs
    leg_offsets = [-1, 1, -1, 1]
    if pose == "walk":
      leg_offsets = [(-2 if step in {0, 3} else 1), (1 if step in {0, 3} else -2), (-1 if step in {1, 2} else 2), (2 if step in {1, 2} else -1)]
    for idx, x in enumerate([12, 15, 18, 21]):
        y = body_y + 5
        draw_line(draw, [(x, y), (x - 1, 23 + leg_offsets[idx] // 2), (x + leg_offsets[idx], 25 + leg_offsets[idx] // 2)], OUTLINE)
        draw_line(draw, [(x, y), (x - 1, 22 + leg_offsets[idx] // 2), (x + leg_offsets[idx], 24 + leg_offsets[idx] // 2)], SHELL_MID)

    # Claws
    claw_spread = 2 if pose in {"walk", "idea", "error"} and step in {0, 2} else 1
    upper_claw_y = body_y - 1
    lower_claw_y = body_y + 4
    draw_line(draw, [(22, body_y + 1), (25, upper_claw_y)], SHELL_DARK)
    draw_line(draw, [(22, body_y + 2), (25, lower_claw_y)], SHELL_DARK)
    draw.polygon([(25, upper_claw_y), (28, upper_claw_y - claw_spread), (27, upper_claw_y + 1)], fill=SHELL_MID)
    draw.polygon([(25, lower_claw_y), (28, lower_claw_y + claw_spread), (27, lower_claw_y - 1)], fill=SHELL_MID)
    draw_line(draw, [(25, upper_claw_y), (27, upper_claw_y)], SHELL_LIGHT)
    draw_line(draw, [(25, lower_claw_y), (27, lower_claw_y)], SHELL_LIGHT)

    # Pose props
    if pose == "work":
        draw_rect(draw, 24, 11, 28, 15, PROP_TOOL)
        draw_rect(draw, 25, 12, 27, 13, (30, 55, 70, 255))
    elif pose == "read":
        draw_rect(draw, 23, 11, 27, 15, PROP_PAPER)
        draw_line(draw, [(25, 11), (25, 15)], OUTLINE)
    elif pose == "idea":
        bulb_y = 7 if step in {0, 1} else 6
        draw.ellipse((22, bulb_y, 26, bulb_y + 4), fill=PROP_IDEA)
        draw_rect(draw, 23, bulb_y + 4, 25, bulb_y + 5, OUTLINE)
    elif pose == "repair":
        draw_line(draw, [(23, 11), (27, 15)], PROP_TOOL, width=2)
        draw_rect(draw, 26, 14, 28, 16, PROP_TOOL)
    elif pose == "coffee":
        mug_y = 14 if step in {0, 1} else 13
        draw_rect(draw, 24, mug_y, 27, mug_y + 3, PROP_COFFEE)
        draw_rect(draw, 27, mug_y + 1, 28, mug_y + 2, PROP_COFFEE)
    elif pose == "error":
        draw_line(draw, [(23, 10), (28, 15)], PROP_ERROR, width=2)
        draw_line(draw, [(28, 10), (23, 15)], PROP_ERROR, width=2)
    elif pose == "sleep":
        draw_rect(draw, 20, body_y + 5, 23, body_y + 6, UNDERBELLY)
        z_x = 22 + (frame_index % 3)
        draw_rect(draw, z_x, 8, z_x + 1, 8, EYE)
        draw_rect(draw, z_x + 1, 9, z_x + 2, 9, EYE)
        draw_rect(draw, z_x, 10, z_x + 1, 10, EYE)
    elif pose == "rest":
        draw_rect(draw, 23, 14, 26, 16, PROP_COFFEE)


def draw_front_lobster(draw: ImageDraw.ImageDraw, frame_index: int, frame_count: int, back: bool, pose: str) -> None:
    bob = 1 if frame_index % 4 in {1, 2} else 0
    body_y = 14 + bob
    draw_shadow(draw, 16, 26, 6, 2)

    draw_rect(draw, 12, body_y - 1, 19, body_y + 6, SHELL_DARK)
    draw_rect(draw, 13, body_y, 18, body_y + 5, SHELL_MID)
    draw_rect(draw, 14, body_y + 1, 17, body_y + 3, SHELL_LIGHT)
    draw_rect(draw, 14, body_y + 6, 17, body_y + 7, UNDERBELLY)

    draw_rect(draw, 11, body_y + 1, 12, body_y + 3, SHELL_DARK)
    draw_rect(draw, 19, body_y + 1, 20, body_y + 3, SHELL_DARK)
    draw_line(draw, [(12, body_y + 2), (8, body_y)], SHELL_MID)
    draw_line(draw, [(19, body_y + 2), (23, body_y)], SHELL_MID)
    draw_line(draw, [(8, body_y), (6, body_y - 2)], SHELL_LIGHT)
    draw_line(draw, [(23, body_y), (25, body_y - 2)], SHELL_LIGHT)

    for x, leg_dx in [(13, -2), (15, -1), (17, 1), (19, 2)]:
        draw_line(draw, [(x, body_y + 7), (x + leg_dx, 24), (x + leg_dx, 26)], SHELL_MID)

    if not back:
        draw_rect(draw, 14, body_y, 14, body_y, EYE)
        draw_rect(draw, 17, body_y, 17, body_y, EYE)
        draw_line(draw, [(14, body_y - 1), (11, 9)], SHELL_LIGHT)
        draw_line(draw, [(17, body_y - 1), (20, 9)], SHELL_LIGHT)

    if pose == "rest":
        draw_rect(draw, 10, body_y + 6, 13, body_y + 8, PROP_COFFEE)


def draw_flat_lobster(draw: ImageDraw.ImageDraw, frame_index: int, frame_count: int) -> None:
    twitch = 1 if frame_index % 5 == 0 else 0
    draw_shadow(draw, 16, 26, 7, 2)
    draw_rect(draw, 9, 18, 23, 22, SHELL_DARK)
    draw_rect(draw, 10, 19, 22, 21, SHELL_MID)
    draw_rect(draw, 12, 20, 20, 20, SHELL_LIGHT)
    draw_line(draw, [(8, 20), (5, 18 - twitch)], SHELL_MID)
    draw_line(draw, [(23, 19), (28, 16)], SHELL_MID)
    draw_line(draw, [(23, 21), (28, 24)], SHELL_MID)
    draw_line(draw, [(14, 17), (11, 13)], SHELL_LIGHT)
    draw_line(draw, [(18, 17), (21, 13)], SHELL_LIGHT)
    draw_line(draw, [(13, 22), (11, 25)], SHELL_MID)
    draw_line(draw, [(16, 22), (16, 25)], SHELL_MID)
    draw_line(draw, [(19, 22), (21, 25)], SHELL_MID)
    draw_line(draw, [(12, 17), (12, 17)], EYE)
    draw_line(draw, [(19, 17), (19, 17)], EYE)


def add_title(frame: Image.Image, text: str) -> Image.Image:
    if not text:
        return frame
    overlay = frame.copy()
    draw = ImageDraw.Draw(overlay)
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None
    draw.text((6, 6), text, fill=(255, 244, 220, 255), font=font)
    return overlay


def render_action(action: dict) -> list[Image.Image]:
    frames = []
    for frame_index in range(action["frames"]):
        frame = make_canvas()
        draw = ImageDraw.Draw(frame)
        kind = action["kind"]
        pose = action.get("pose", "idle")
        if kind == "side":
            draw_side_lobster(draw, frame_index, action["frames"], pose)
        elif kind == "front":
            draw_front_lobster(draw, frame_index, action["frames"], back=False, pose=pose)
        elif kind == "back":
            draw_front_lobster(draw, frame_index, action["frames"], back=True, pose=pose)
        elif kind == "flat":
            draw_flat_lobster(draw, frame_index, action["frames"])
        frames.append(scale_canvas(add_title(frame, "")))
    return frames


def build_sheet(frames: list[Image.Image], output_path: Path) -> dict[str, int]:
    frame_width, frame_height = frames[0].size
    cols = min(6, max(1, math.ceil(math.sqrt(len(frames)))))
    rows = math.ceil(len(frames) / cols)
    sheet = Image.new("RGBA", (frame_width * cols, frame_height * rows), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        col = index % cols
        row = index // cols
        sheet.alpha_composite(frame, (col * frame_width, row * frame_height))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output_path)
    return {
        "frameWidth": frame_width,
        "frameHeight": frame_height,
        "frameCount": len(frames),
        "columns": cols,
        "rows": rows,
    }


def main() -> None:
    if TARGET_ROOT.exists():
        shutil.rmtree(TARGET_ROOT)

    sheets_dir = TARGET_ROOT / "sheets"
    sheets_dir.mkdir(parents=True, exist_ok=True)

    manifest_actions = []
    for action in ACTIONS:
        frames = render_action(action)
        sheet_path = sheets_dir / f"{action['id']}-spritesheet.png"
        poster_path = sheets_dir / f"{action['id']}-poster.png"
        sheet_meta = build_sheet(frames, sheet_path)
        frames[0].save(poster_path)
        manifest_actions.append(
            {
                "id": action["id"],
                "spritesheet": str(sheet_path.relative_to(ROOT)),
                "poster": str(poster_path.relative_to(ROOT)),
                "fps": action["fps"],
                "sheet": sheet_meta,
            }
        )

    (TARGET_ROOT / "manifest.json").write_text(
        json.dumps(
            {
                "variant": "lobster-claw",
                "label": "Lobster-Claw",
                "frameCanvas": {"width": OUTPUT_SIZE, "height": OUTPUT_SIZE},
                "actions": manifest_actions,
            },
            indent=2,
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
