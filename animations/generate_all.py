#!/usr/bin/env python3
"""Generate Manim videos for all items in flows.json."""

import json
import os
import subprocess
import sys
from pathlib import Path

ANIMATIONS_DIR = Path(__file__).parent
SCENES_DIR = ANIMATIONS_DIR / "scenes"
OUTPUT_DIR = Path(__file__).parent.parent / "app" / "public" / "videos" / "items"


def render_item(item: dict) -> bool:
    """Render a single item's flow video. Returns True on success."""
    item_id = item["id"]

    env = os.environ.copy()
    env["FLOW_DATA"] = json.dumps(item)

    cmd = [
        sys.executable,
        "-m",
        "manim",
        "-qm",
        "--format=gif",
        "-o",
        item_id,
        str(SCENES_DIR / "template.py"),
        "ItemFlowScene",
    ]

    print(f"  Rendering {item_id}...", end=" ", flush=True)
    result = subprocess.run(
        cmd,
        env=env,
        cwd=str(ANIMATIONS_DIR),
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        print("FAIL")
        print(f"    stderr: {result.stderr[-200:]}")
        return False

    # Find GIF
    gif_path = None
    media_dir = ANIMATIONS_DIR / "media"
    for gif in media_dir.rglob(f"{item_id}.gif"):
        gif_path = gif
        break

    if not gif_path:
        print("FAIL (no GIF found)")
        return False

    # Convert to MP4
    mp4_path = OUTPUT_DIR / f"{item_id}.mp4"
    ffmpeg_cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(gif_path),
        "-movflags",
        "faststart",
        "-pix_fmt",
        "yuv420p",
        "-vf",
        "scale=trunc(iw/2)*2:trunc(ih/2)*2",
        "-c:v",
        "libx264",
        "-crf",
        "28",
        "-preset",
        "fast",
        str(mp4_path),
    ]

    ff_result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
    if ff_result.returncode != 0:
        print("FAIL (ffmpeg)")
        return False

    size_kb = mp4_path.stat().st_size // 1024
    print(f"OK ({size_kb}KB)")
    return True


def main():
    flows_path = ANIMATIONS_DIR / "flows.json"
    with open(flows_path) as f:
        items = json.load(f)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Filter by CLI arg if provided
    if len(sys.argv) > 1:
        filter_id = sys.argv[1]
        items = [i for i in items if i["id"] == filter_id]
        if not items:
            print(f"No item found with id '{filter_id}'")
            sys.exit(1)

    print(f"Generating {len(items)} videos...\n")

    success = 0
    fail = 0
    for item in items:
        if render_item(item):
            success += 1
        else:
            fail += 1

    print(f"\nDone: {success} OK, {fail} failed")


if __name__ == "__main__":
    main()
