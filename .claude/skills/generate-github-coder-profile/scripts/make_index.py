#!/usr/bin/env python3
"""Indexa el corpus de un reviewer y prepara el material que lee el LLM.

Lee SOURCE_ACTIVITY.json (repo backend) y SOURCE_ACTIVITY.front.json (repo
frontend) de un corpus construido por build_corpus.py y escribe, en
<corpus_dir>/.pipeline/ (o en --out-dir):

  comments.json   indice canonico "<REPO>:<comment_id>" -> {pr, repo, kind, own,
                  citable, has_hunk, path, body, url, line, created_at}. Es la
                  unica fuente de texto literal: las citas se inyectan desde aca,
                  el LLM nunca las escribe. Solo entran los comentarios CON
                  cuerpo: una aprobacion vacia no se puede citar y solo inflaria
                  los conteos de cobertura.
  digest_BE.md    una linea por comentario citable del repo backend.
  digest_FE.md    idem para el repo frontend.

La clave lleva el repo adelante porque los ids de GitHub se solapan entre repos
y entre tipos de evento: sin prefijo, un comentario de FE podia pisar a uno de BE
y el pipeline citaba texto de otra PR sin un solo error.

Citable = comentario escrito por el reviewer en una PR que NO es suya
(own=False) y con cuerpo util (no vacio, no solo imagen, no solo emoji, no de
menos de 8 caracteres). El flag viaja en comments.json para que compute.py pueda
rechazar ids que el digest nunca le mostro al LLM.

Uso:
    python3 make_index.py <corpus_dir> <login> [--out-dir DIR]

Ejemplo:
    python3 make_index.py ~/vambe/all_vambe/lucas_pr ljrodriguez1
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from collections import Counter
from pathlib import Path

import rules
from authorship import is_tool_output

from rules import pipeline_dir

SOURCE_FILES = {"BE": "SOURCE_ACTIVITY.json", "FE": "SOURCE_ACTIVITY.front.json"}

KIND_LETTERS = {"reviews": "R", "review_comments": "C", "issue_comments": "I"}
FOLLOW_UP_LETTER = "F"

MIN_BODY_CHARS = 8
DIGEST_BODY_CHARS = 600

MARKDOWN_IMAGE = re.compile(r"!\[[^\]]*\]\([^)]*\)")
HTML_IMAGE = re.compile(r"<img\b[^>]*>", re.IGNORECASE)
BARE_ASSET_URL = re.compile(
    r"https?://\S+\.(?:png|jpe?g|gif|webp|svg|mov|mp4)\b", re.IGNORECASE
)
EMOJI_SHORTCODE = re.compile(r":[a-z0-9_+-]+:", re.IGNORECASE)
SYMBOL_CATEGORIES = {"So", "Sk", "Cf", "Mn", "Cs"}

DISCARD_LABELS = {
    "empty": "cuerpo vacio",
    "image_only": "solo imagen / adjunto",
    "emoji_only": "solo emoji o reaccion",
    "too_short": f"menos de {MIN_BODY_CHARS} caracteres",
}


def collapse(body: str) -> str:
    return re.sub(r"\s+", " ", body).strip()


def strip_visual_noise(body: str) -> str:
    without_images = BARE_ASSET_URL.sub(
        "", HTML_IMAGE.sub("", MARKDOWN_IMAGE.sub("", body))
    )
    return collapse(without_images)


def strip_emoji(text: str) -> str:
    without_shortcodes = EMOJI_SHORTCODE.sub("", text)
    return "".join(
        char
        for char in without_shortcodes
        if unicodedata.category(char) not in SYMBOL_CATEGORIES
    ).strip()


def discard_reason(body: str) -> str | None:
    collapsed = collapse(body)
    if not collapsed:
        return "empty"
    without_images = strip_visual_noise(body)
    if not without_images:
        return "image_only"
    meaningful = strip_emoji(without_images)
    if not meaningful:
        return "emoji_only"
    if len(meaningful) < MIN_BODY_CHARS:
        return "too_short"
    return None


def kind_letter(kind: str, raw: dict) -> str:
    if kind == "review_comments" and raw.get("in_reply_to_id"):
        return FOLLOW_UP_LETTER
    return KIND_LETTERS[kind]


def comment_id_for(repo: str, raw: dict) -> str:
    return f"{repo}:{raw.get('id')}"


def normalize_comment(raw: dict, kind: str, pr_number: int, repo: str, own: bool) -> dict:
    body = raw.get("body") or ""
    tool, tool_signals = is_tool_output(body)
    return {
        "pr": pr_number,
        "repo": repo,
        "kind": kind,
        "own": own,
        # authored=False: lo posteo el reviewer pero lo redacto su herramienta de
        # review. El criterio sigue avalado (eligio postearlo) y es citable como
        # patron; lo que NO puede hacer es alimentar el lexicon: no es su voz.
        "authored": not tool,
        "tool_signals": tool_signals,
        "citable": not own and discard_reason(body) is None,
        "has_hunk": bool((raw.get("diff_hunk") or "").strip()),
        "path": raw.get("path"),
        "body": body,
        "url": raw.get("html_url"),
        "line": raw.get("line"),
        "created_at": raw.get("created_at") or raw.get("submitted_at"),
    }


def load_activity(corpus_dir: Path, repo: str) -> dict:
    path = rules.source_path(corpus_dir, repo)
    if not path.exists():
        return {}
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def index_repo(
    activity: dict, repo: str, login: str
) -> tuple[dict, dict[str, str], list[str], int]:
    lowered_login = login.lower()
    comments: dict[str, dict] = {}
    letters: dict[str, str] = {}
    collisions: list[str] = []
    bodyless = 0

    for pr_key in sorted(activity, key=lambda key: int(key)):
        entry = activity[pr_key]
        meta = entry.get("meta") or {}
        pr_number = int(meta.get("number") or pr_key)
        own = (meta.get("author") or "").lower() == lowered_login

        for kind in KIND_LETTERS:
            for raw in entry.get(kind) or []:
                comment_id = comment_id_for(repo, raw)
                if comment_id in comments:
                    collisions.append(comment_id)
                    continue
                if not collapse(raw.get("body") or ""):
                    bodyless += 1
                    continue
                comments[comment_id] = normalize_comment(raw, kind, pr_number, repo, own)
                letters[comment_id] = kind_letter(kind, raw)

    return comments, letters, collisions, bodyless


def pr_headers(activity: dict) -> dict[int, str]:
    return {
        int((entry.get("meta") or {}).get("number") or pr_key): "### PR #{} — {} — {}".format(
            (entry.get("meta") or {}).get("number") or pr_key,
            (entry.get("meta") or {}).get("title") or "(sin titulo)",
            (entry.get("meta") or {}).get("url") or "(sin url)",
        )
        for pr_key, entry in activity.items()
    }


def digest_line(comment_id: str, comment: dict, raw_kind_letter: str) -> str:
    body = collapse(comment["body"])
    truncated = len(body) > DIGEST_BODY_CHARS
    if truncated:
        body = body[: DIGEST_BODY_CHARS - 1] + "…"
    flags = [raw_kind_letter]
    if not comment.get("authored", True):
        flags.append("HERRAMIENTA")
    if comment["has_hunk"]:
        flags.append("hunk=1")
    if truncated:
        flags.append("TRUNCADO")
    return "[id={} {} {}] {}".format(
        comment_id, " ".join(flags), comment["path"] or "-", body
    )


def render_digest(
    citable: list[tuple[str, dict, str]], headers: dict[int, str], repo: str, login: str
) -> str:
    by_pr: dict[int, list[str]] = {}
    for comment_id, comment, letter in citable:
        by_pr.setdefault(comment["pr"], []).append(
            digest_line(comment_id, comment, letter)
        )

    sections = [
        "\n".join([headers.get(pr, f"### PR #{pr}"), ""] + by_pr[pr])
        for pr in sorted(by_pr)
    ]
    preamble = (
        f"# Digest {repo} — comentarios de review de @{login}\n\n"
        f"{len(citable)} comentarios citables en {len(by_pr)} PRs de otros autores.\n"
        "Formato: [id=<REPO>:<comment_id> <R|C|F|I> [hunk=1] [TRUNCADO] <path>] <body>. "
        "R=review general, C=inline, F=seguimiento, I=comentario de PR.\n"
        "El id incluye el repo: copialo entero, es la clave con la que el pipeline "
        "resuelve la cita.\n"
        f"hunk=1: el comentario tiene diff_hunk; leelo en la ficha pr-<n>.md antes de "
        "escribir un trigger.\n"
        f"TRUNCADO: el body se corto a {DIGEST_BODY_CHARS} caracteres; no lo conviertas "
        "en patron sin abrir la ficha pr-<n>.md y leerlo completo.\n"
        "Para citar un patron devolve el id; nunca copies el texto.\n"
    )
    return preamble + "\n" + "\n\n".join(sections) + "\n"


def summarize(repo_stats: dict[str, dict]) -> str:
    lines = []
    for repo, stats in repo_stats.items():
        lines.append(
            "  {}: {} con cuerpo | {} de PRs propias | {} utilizables | {} citables en {} PRs".format(
                repo,
                stats["total"],
                stats["own"],
                stats["usable"],
                stats["citable"],
                stats["citable_prs"],
            )
        )
        lines.append(
            f"      {stats['bodyless']} sin cuerpo (aprobaciones vacias) fuera del indice"
        )
        discarded = stats["discarded"]
        if discarded:
            detail = ", ".join(
                f"{DISCARD_LABELS[reason]}={count}"
                for reason, count in sorted(discarded.items())
            )
            lines.append(f"      descartados {sum(discarded.values())}: {detail}")
    return "\n".join(lines)


def index_all(corpus_dir: Path, login: str) -> tuple[dict, dict, list[str], list[str], list[str]]:
    all_comments: dict[str, dict] = {}
    digests: dict[str, str] = {}
    repo_stats: dict[str, dict] = {}
    collisions: list[str] = []
    missing_sources: list[str] = []
    warnings: list[str] = []

    for repo in SOURCE_FILES:
        activity = load_activity(corpus_dir, repo)
        if not activity:
            missing_sources.append(SOURCE_FILES[repo])
            continue

        comments, letters, repo_collisions, bodyless = index_repo(activity, repo, login)
        collisions.extend(repo_collisions)
        collisions.extend(sorted(set(all_comments) & set(comments)))
        all_comments.update(comments)

        reviewed = {
            comment_id: comment
            for comment_id, comment in comments.items()
            if not comment["own"]
        }
        discarded = Counter(
            reason
            for reason in (
                discard_reason(comment["body"]) for comment in reviewed.values()
            )
            if reason
        )
        citable = sorted(
            (
                (comment_id, comment, letters[comment_id])
                for comment_id, comment in reviewed.items()
                if comment["citable"]
            ),
            key=lambda item: (item[1]["pr"], item[1]["created_at"] or "", item[0]),
        )

        authors = {
            (pr.get("meta") or {}).get("author", "").lower()
            for pr in activity.values()
        }
        if login.lower() not in authors:
            near = sorted(a for a in authors if a and login.lower()[:5] in a)
            warnings.append(
                f"{repo}: @{login} no figura como autor de ninguna de las {len(activity)} PRs, "
                f"asi que no se excluyo ninguna PR propia. Casi siempre es el login equivocado"
                + (f"; parecidos en el corpus: {', '.join(near)}" if near else "")
            )

        digests[repo] = render_digest(citable, pr_headers(activity), repo, login)
        repo_stats[repo] = {
            "total": len(comments),
            "own": sum(1 for comment in comments.values() if comment["own"]),
            "usable": len(reviewed),
            "bodyless": bodyless,
            "citable": len(citable),
            "citable_prs": len({comment["pr"] for _, comment, _ in citable}),
            "discarded": dict(discarded),
        }

    return all_comments, {"digests": digests, "stats": repo_stats}, collisions, missing_sources, warnings


def build(corpus_dir: Path, login: str, out_dir: Path) -> int:
    all_comments, rendered, collisions, missing_sources, warnings = index_all(corpus_dir, login)
    repo_stats = rendered["stats"]

    if not repo_stats:
        print(
            f"ERROR: no se encontro ningun SOURCE_ACTIVITY en {corpus_dir}", file=sys.stderr
        )
        return 1

    if collisions:
        print(
            f"ERROR: {len(collisions)} comment_id duplicados dentro del mismo repo, "
            "no se escribio nada: " + ", ".join(sorted(set(collisions))[:10]),
            file=sys.stderr,
        )
        print(
            "  El prefijo de repo ya evita los choques entre BE y FE. Si estos ids "
            "chocan entre tipos de evento del mismo repo, cambia comment_id_for() a "
            f"f'{{repo}}:{{kind}}:{{id}}'; si son un duplicado real del SOURCE_ACTIVITY, "
            "vuelve a bajarlo con build_corpus.py --refetch.",
            file=sys.stderr,
        )
        return 1

    out_dir.mkdir(parents=True, exist_ok=True)
    comments_path = out_dir / "comments.json"
    comments_path.write_text(
        json.dumps(all_comments, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    digest_paths = {}
    for repo, content in rendered["digests"].items():
        digest_paths[repo] = out_dir / f"digest_{repo}.md"
        digest_paths[repo].write_text(content, encoding="utf-8")

    total = sum(stats["total"] for stats in repo_stats.values())
    own = sum(stats["own"] for stats in repo_stats.values())
    usable = sum(stats["usable"] for stats in repo_stats.values())
    citable = sum(stats["citable"] for stats in repo_stats.values())
    distinct_prs = len({(c["repo"], c["pr"]) for c in all_comments.values()})
    citable_prs = sum(stats["citable_prs"] for stats in repo_stats.values())

    print(f"corpus   {corpus_dir}")
    print(f"reviewer @{login}")
    for warning in warnings:
        print(f"AVISO: {warning}", file=sys.stderr)
    for name in missing_sources:
        print(f"AVISO: falta {name}, ese repo queda fuera del indice")
    print(f"escrito  {comments_path} ({len(all_comments)} entradas)")
    for path in digest_paths.values():
        print(f"escrito  {path}")
    print("")
    print(f"comentarios con cuerpo   {total} (los vacios no se indexan)")
    print(f"  de PRs propias         {own} (no son evidencia de review)")
    print(f"  utilizables            {usable}")
    print(f"  citables               {citable} (utilizables menos emoji/imagen/muy cortos)")
    print(f"PRs distintas            {distinct_prs} (con citas: {citable_prs})")
    print(summarize(repo_stats))
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Construye comments.json (indice canonico de citas, con clave "
            "<REPO>:<comment_id>) y los digests digest_BE.md / digest_FE.md que lee "
            "el LLM, a partir de los SOURCE_ACTIVITY*.json de un corpus de reviewer."
        ),
        epilog="ejemplo: python3 make_index.py ~/vambe/all_vambe/lucas_pr ljrodriguez1",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "corpus_dir",
        type=Path,
        help="directorio del corpus (contiene SOURCE_ACTIVITY.json y SOURCE_ACTIVITY.front.json)",
    )
    parser.add_argument(
        "login",
        help="login de GitHub del reviewer; sus propias PRs se marcan own=true y no son citables",
    )
    parser.add_argument(
        "--out-dir",
        type=Path,
        default=None,
        help="donde escribir la salida (por defecto <corpus_dir>/.pipeline)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    corpus_dir = args.corpus_dir.expanduser().resolve()
    if not corpus_dir.is_dir():
        print(f"ERROR: {corpus_dir} no es un directorio", file=sys.stderr)
        return 1
    out_dir = (
        args.out_dir.expanduser().resolve() if args.out_dir else pipeline_dir(corpus_dir)
    )
    return build(corpus_dir, args.login, out_dir)


if __name__ == "__main__":
    raise SystemExit(main())
