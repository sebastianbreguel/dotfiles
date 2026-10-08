#!/usr/bin/env python3
"""Baja de GitHub la actividad de review de una persona y escribe el corpus crudo.

Produce, dentro de <corpus_dir>:

  SOURCE_ACTIVITY.json          actividad cruda del repo backend (fuente primaria)
  SOURCE_ACTIVITY.front.json    idem frontend (cuando se corre con --prefix front-)
  pr-<n>.md / front-pr-<n>.md   una ficha por PR con texto utilizable
  INDEX.md / FRONT-INDEX.md     indice de fichas
  SKIPPED.md / FRONT-SKIPPED.md PRs candidatas sin texto utilizable

Las fichas son TRANSCRIPCION, no analisis: metadata verificable, body literal y
diff_hunk literal. No llevan tema, practica ni confianza. Toda interpretacion vive
en patterns.json y la confianza la calcula compute.py desde el numero de PRs
distintas; una segunda confianza estimada por regex en la ficha le daria al agente
dos respuestas contradictorias para la misma pregunta.

Actualizacion incremental: cada PR guarda el `updated_at` que devolvio la busqueda.
En la corrida siguiente se vuelven a bajar solo las PRs cuyo `updated_at` cambio
(comentarios nuevos o editados) mas las que no estaban. --refetch fuerza el rebuild
completo y --since fuerza las actualizadas despues de una fecha.

Nunca toca PROFILE*.md, README.md ni agent/: esos son prosa a mano.
Requiere `gh` autenticado.

Uso:
    python3 build_corpus.py <corpus_dir> "<Nombre>" <login>
    python3 build_corpus.py <corpus_dir> "<Nombre>" <login> \\
        --repo vambeai/vambe-turborepo-frontend --prefix front-

Ejemplo:
    python3 build_corpus.py ~/vambe/all_vambe/lucas_pr "Lucas" ljrodriguez1
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import time
from collections import Counter
from pathlib import Path

KINDS = ("reviews", "review_comments", "issue_comments")

RATE_LIMIT_RETRIES = 90
RATE_LIMIT_SLEEP_SECONDS = 65


def gh_json(path: str, params: dict | None = None) -> list:
    cmd = ["gh", "api", "-X", "GET", "--paginate", path]
    for key, value in (params or {}).items():
        cmd += ["-f", f"{key}={value}"]

    for _ in range(RATE_LIMIT_RETRIES):
        out = subprocess.run(cmd, capture_output=True, text=True)
        if out.returncode == 0:
            break
        if "rate limit" not in out.stderr:
            raise RuntimeError(out.stderr.strip()[:300])
        time.sleep(RATE_LIMIT_SLEEP_SECONDS)
    else:
        raise RuntimeError("rate limit never recovered")

    return flatten_pages(out.stdout.strip())


def flatten_pages(text: str) -> list:
    """`gh --paginate` concatena JSON sueltos; hay que decodificarlos uno tras otro."""
    if not text:
        return []
    decoder = json.JSONDecoder()
    objects, cursor = [], 0
    while cursor < len(text):
        obj, cursor = decoder.raw_decode(text, cursor)
        objects.append(obj)
        while cursor < len(text) and text[cursor].isspace():
            cursor += 1
    return [
        item
        for obj in objects
        for item in (
            obj
            if isinstance(obj, list)
            else obj["items"]
            if isinstance(obj, dict) and "items" in obj
            else [obj]
        )
    ]


def search_candidates(repo: str, login: str) -> dict[int, dict]:
    found: dict[int, dict] = {}
    for filter_kind in (f"reviewed-by:{login}", f"commenter:{login}"):
        for item in gh_json(
            "search/issues",
            {"q": f"repo:{repo} {filter_kind} is:pr", "per_page": "100"},
        ):
            found[item["number"]] = {
                "number": item["number"],
                "title": item["title"],
                "url": item["html_url"],
                "state": item["state"],
                "author": (item.get("user") or {}).get("login"),
                "updated_at": item.get("updated_at"),
            }
    return found


def stale_numbers(
    candidates: dict[int, dict], previous: dict, since: str | None
) -> tuple[list[int], int]:
    """PRs a (re)bajar y cuantas quedaron sin `updated_at` guardado de una version vieja."""
    unstamped = 0
    stale = []
    for number in sorted(candidates):
        stored = previous.get(str(number))
        if stored is None:
            stale.append(number)
            continue
        fresh_updated = candidates[number].get("updated_at")
        if since and fresh_updated and fresh_updated >= since:
            stale.append(number)
            continue
        stored_updated = (stored.get("meta") or {}).get("updated_at")
        if stored_updated is None:
            unstamped += 1
            continue
        if fresh_updated and fresh_updated != stored_updated:
            stale.append(number)
    return stale, unstamped


def fetch_pr(repo: str, number: int, login: str, meta: dict) -> dict:
    is_reviewer = (
        lambda item: ((item.get("user") or {}).get("login") or "").casefold()
        == login.casefold()
    )
    return {
        "meta": meta,
        "reviews": [
            x for x in gh_json(f"/repos/{repo}/pulls/{number}/reviews") if is_reviewer(x)
        ],
        "review_comments": [
            x for x in gh_json(f"/repos/{repo}/pulls/{number}/comments") if is_reviewer(x)
        ],
        "issue_comments": [
            x for x in gh_json(f"/repos/{repo}/issues/{number}/comments") if is_reviewer(x)
        ],
    }


def fetch_activity(
    repo: str, login: str, candidates: dict[int, dict], previous: dict, since: str | None
) -> dict:
    activity = dict(previous)
    for number, meta in candidates.items():
        stored = activity.get(str(number))
        if stored is not None:
            stored["meta"] = {**stored.get("meta", {}), **meta}

    pending, unstamped = stale_numbers(candidates, previous, since)
    if unstamped:
        print(
            f"AVISO: {unstamped} PRs guardadas sin 'updated_at' (corpus de una version "
            "anterior); se dan por vigentes. Corre con --refetch para rebajarlas.",
            flush=True,
        )
    print(f"a bajar {len(pending)} de {len(candidates)} PRs candidatas", flush=True)

    for position, number in enumerate(pending, start=1):
        try:
            activity[str(number)] = fetch_pr(repo, number, login, candidates[number])
        except Exception as exc:
            print(f"ERROR PR #{number}: {exc}", file=sys.stderr)
        if position % 25 == 0 or position == len(pending):
            print(f"{position}/{len(pending)}", flush=True)
    return activity


def bodies(entry: dict, kind: str) -> list[dict]:
    return [x for x in entry.get(kind) or [] if (x.get("body") or "").strip()]


def has_text(entry: dict) -> bool:
    return any(bodies(entry, kind) for kind in KINDS)


def is_own_pr(entry: dict, login: str) -> bool:
    return ((entry.get("meta") or {}).get("author") or "").casefold() == login.casefold()


def fence(text: str) -> str:
    longest = max((len(run) for run in re.findall(r"`+", text or "")), default=0)
    return "`" * max(4, longest + 1)


def event_kind(kind: str, event: dict) -> str:
    if kind == "reviews":
        return "review general"
    if kind == "issue_comments":
        return "issue comment"
    return "seguimiento" if event.get("in_reply_to_id") else "comentario inline"


METADATA_FIELDS = (
    ("commit_id", "commit_id"),
    ("pull_request_review_id", "pull_request_review_id"),
    ("in_reply_to_id", "in_reply_to_id"),
    ("archivo (path)", "path"),
    ("line", "line"),
    ("start_line", "start_line"),
    ("side", "side"),
    ("original_line", "original_line"),
)


def render_event(repo: str, number: int, kind: str, event: dict, ordinal: int, login: str) -> str:
    body = (event.get("body") or "").strip()
    url = event.get("html_url") or event.get("url") or f"https://github.com/{repo}/pull/{number}"
    date = event.get("created_at") or event.get("submitted_at") or event.get("updated_at")
    lines = [
        f'### {event_kind(kind, event).title()} {ordinal} — ID {event.get("id")}',
        f"- tipo de fuente: `{kind}` ({event_kind(kind, event)})",
        f'- ID: `{event.get("id")}`',
        f'- autor: `{(event.get("user") or {}).get("login", login)}`',
        f'- fecha: {date or "no informada en JSON"}',
        f'- estado: {event.get("state") or "no informado en JSON"}',
        f"- URL: {url}",
    ]
    lines += [
        f'- {label}: {event.get(key) if event.get(key) not in (None, "") else "no informado en JSON"}'
        for label, key in METADATA_FIELDS
    ]
    lines += ["", "**Body literal:**", f"{fence(body)}text", body, fence(body)]

    hunk = event.get("diff_hunk") or ""
    if hunk.strip():
        lines += [
            "",
            "**diff_hunk literal — contexto separado del body:**",
            f"{fence(hunk)}text",
            hunk,
            fence(hunk),
        ]
    else:
        lines += ["", "**diff_hunk literal — contexto separado del body:** no informado o vacio en el JSON."]
    return "\n".join(lines)


def source_filename(prefix: str) -> str:
    return f'SOURCE_ACTIVITY.{prefix.rstrip("-")}.json' if prefix else "SOURCE_ACTIVITY.json"


def render_pr(repo: str, prefix: str, number: int, entry: dict, display: str, login: str) -> str:
    meta = entry.get("meta") or {}
    counted = {kind: len(bodies(entry, kind)) for kind in KINDS}
    hunks = sum(
        1 for kind in KINDS for x in entry.get(kind) or [] if (x.get("diff_hunk") or "").strip()
    )
    text = [
        f'# PR #{number} — {meta.get("title", "")}',
        "",
        "## Metadata",
        f'- titulo: {meta.get("title", "")}',
        f'- estado: {meta.get("state", "unknown")}',
        f'- URL: {meta.get("url", f"https://github.com/{repo}/pull/{number}")}',
        f'- autor de la PR: `{meta.get("author") or "no informado"}`',
        f"- reviewer: {display} (`{login}`)",
        f"- repo: `{repo}`",
        f"- fuente primaria unica: `{source_filename(prefix)}`",
        "",
        "## Cobertura de la ficha",
        "- actividad en JSON: "
        + ", ".join(f'`{kind}={len(entry.get(kind) or [])}`' for kind in KINDS),
        "- cuerpos no vacios documentados: "
        + ", ".join(f"`{kind}={counted[kind]}`" for kind in KINDS),
        f"- `diff_hunk` no vacios documentados: `{hunks}`",
        "",
    ]
    if is_own_pr(entry, login):
        text += [
            "> **PR propia del reviewer.** Los comentarios de abajo son respuestas como "
            "AUTOR de la PR, no criterio de review. El pipeline los excluye de la evidencia.",
            "",
        ]
    text += [
        "> Transcripcion literal. Esta ficha no interpreta ni clasifica: el criterio "
        "tecnico se extrae en `patterns.json` y la confianza la calcula `compute.py`.",
        "",
    ]

    sections = (
        ("## Review general", bodies(entry, "reviews"), "reviews"),
        (
            "## Comentarios inline",
            [x for x in bodies(entry, "review_comments") if not x.get("in_reply_to_id")],
            "review_comments",
        ),
        (
            "## Seguimientos",
            [x for x in bodies(entry, "review_comments") if x.get("in_reply_to_id")],
            "review_comments",
        ),
        ("## Issue comments", bodies(entry, "issue_comments"), "issue_comments"),
    )
    for title, selected, kind in sections:
        text.append(title)
        if not selected:
            text += ["No hay registros con body no vacio en esta seccion.", ""]
        for ordinal, event in enumerate(selected, start=1):
            text += [render_event(repo, number, kind, event, ordinal, login), ""]

    text += [
        "## Limites de esta ficha",
        "- Los eventos sin body no se transcriben: no son evidencia citable.",
        "- La ausencia de comentario no demuestra ausencia de riesgo ni aprobacion exhaustiva.",
        "- El `diff_hunk` es contexto del comentario, no evidencia independiente.",
        "",
    ]
    return "\n".join(text)


def write_fichas(root: Path, repo: str, prefix: str, activity: dict, display: str, login: str) -> int:
    documented = [
        (int(number), entry) for number, entry in activity.items() if has_text(entry)
    ]
    for number, entry in documented:
        (evidence_subdir(root, prefix) / f"{prefix}pr-{number}.md").write_text(
            render_pr(repo, prefix, number, entry, display, login), encoding="utf-8"
        )
    return len(documented)


def md_cell(text: str) -> str:
    return (text or "").replace("|", "\\|").replace("\n", " ")


def write_index(root: Path, repo: str, prefix: str, activity: dict, display: str, login: str) -> tuple[int, int]:
    candidates = sorted(int(key) for key in activity)
    documented = [number for number in candidates if has_text(activity[str(number)])]
    totals = Counter(
        {
            kind: sum(len(bodies(activity[str(number)], kind)) for number in documented)
            for kind in KINDS
        }
    )
    own = sum(is_own_pr(activity[str(number)], login) for number in documented)

    index = [
        f"# Indice de fichas de `{display}`",
        "",
        f"Repositorio: `{repo}`.",
        "",
        f"Incluye PRs donde `{display}` (`{login}`) dejo al menos un body no vacio.",
        "",
        "Las filas marcadas `propia` son PRs escritas por el reviewer: sus comentarios "
        "ahi son respuestas como autor, no criterio de review.",
        "",
        "| PR | Titulo | Estado | Rol | Reviews | Inline | Issue comments |",
        "|---:|---|---|---|---:|---:|---:|",
    ]
    index += [
        "| [#{n}](./{prefix}pr-{n}.md) | {title} | `{state}` | {role} | {r} | {c} | {i} |".format(
            n=number,
            prefix=prefix,
            title=md_cell((activity[str(number)].get("meta") or {}).get("title")),
            state=(activity[str(number)].get("meta") or {}).get("state", "unknown"),
            role="propia" if is_own_pr(activity[str(number)], login) else "reviewer",
            r=len(bodies(activity[str(number)], "reviews")),
            c=len(bodies(activity[str(number)], "review_comments")),
            i=len(bodies(activity[str(number)], "issue_comments")),
        )
        for number in documented
    ]
    index += [
        "",
        "## Conteos",
        "",
        f"- PRs candidatas: **{len(candidates)}**.",
        f"- PRs con ficha: **{len(documented)}** ({len(documented) - own} como reviewer, {own} propias).",
        f"- Comentarios no vacios: **{sum(totals.values())}** — {totals['review_comments']} inline, "
        f"{totals['reviews']} reviews generales y {totals['issue_comments']} issue comments.",
        f"- PRs omitidas: **{len(candidates) - len(documented)}**.",
        "",
        f"Las PRs sin texto utilizable estan en `{prefix.upper()}SKIPPED.md`.",
    ]
    (evidence_root(root) / f"{prefix.upper()}INDEX.md").write_text("\n".join(index) + "\n", encoding="utf-8")

    skipped = [
        "# PRs omitidas",
        "",
        "PRs candidatas sin ningun body no vacio utilizable como evidencia.",
        "",
        "| PR | Titulo | Estado | Motivo |",
        "|---:|---|---|---|",
    ]
    skipped += [
        "| [#{n}](https://github.com/{repo}/pull/{n}) | {title} | `{state}` | {reason} |".format(
            n=number,
            repo=repo,
            title=md_cell((activity[str(number)].get("meta") or {}).get("title")),
            state=(activity[str(number)].get("meta") or {}).get("state", "unknown"),
            reason=(
                "actividad sin texto"
                if any(activity[str(number)].get(kind) for kind in KINDS)
                else "sin registros recuperables"
            ),
        )
        for number in candidates
        if number not in set(documented)
    ]
    (evidence_root(root) / f"{prefix.upper()}SKIPPED.md").write_text("\n".join(skipped) + "\n", encoding="utf-8")
    return len(candidates), len(documented)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Baja de GitHub la actividad de review de una persona y escribe el corpus "
            "crudo (SOURCE_ACTIVITY*.json, fichas pr-<n>.md, INDEX.md, SKIPPED.md). "
            "Las fichas son transcripcion literal: no clasifican ni estiman confianza."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "ejemplos:\n"
            "  python3 build_corpus.py ~/vambe/all_vambe/lucas_pr 'Lucas' ljrodriguez1\n"
            "  python3 build_corpus.py ~/vambe/all_vambe/lucas_pr 'Lucas' ljrodriguez1 \\\n"
            "      --repo vambeai/vambe-turborepo-frontend --prefix front-\n"
            "\nActualizar un corpus existente: correr el mismo comando. Se rebajan solo\n"
            "las PRs cuyo updated_at cambio desde la ultima corrida.\n"
        ),
    )
    parser.add_argument("corpus_dir", type=Path, help="directorio del corpus (se crea si no existe)")
    parser.add_argument("display", help="nombre visible del reviewer, ej: 'Lucas'")
    parser.add_argument("login", help="login de GitHub del reviewer")
    parser.add_argument(
        "--repo",
        default="vambeai/vambeai-backend",
        help="repositorio owner/name a recorrer (default: %(default)s)",
    )
    parser.add_argument(
        "--prefix",
        default="",
        help="prefijo de los archivos generados, ej: 'front-' para el repo frontend",
    )
    parser.add_argument(
        "--refetch",
        action="store_true",
        help="ignorar el SOURCE_ACTIVITY existente y volver a bajar todo (lento)",
    )
    parser.add_argument(
        "--since",
        help="ISO date/datetime: rebajar tambien las PRs actualizadas desde entonces",
    )
    return parser.parse_args()



def evidence_root(root):
    d = root / "evidence"
    d.mkdir(parents=True, exist_ok=True)
    return d


def evidence_subdir(root, prefix):
    d = evidence_root(root) / ("frontend" if prefix else "backend")
    d.mkdir(parents=True, exist_ok=True)
    return d


def pipeline_root(root):
    d = root / ".pipeline"
    d.mkdir(parents=True, exist_ok=True)
    return d

def main() -> int:
    args = parse_args()
    root = args.corpus_dir.expanduser().resolve()
    if not root.exists() and not root.parent.is_dir():
        print(
            f"ERROR: no existe {root} ni su directorio padre {root.parent}. "
            "Pasa una ruta absoluta o relativa al directorio actual.",
            file=sys.stderr,
        )
        return 2
    root.mkdir(parents=True, exist_ok=True)

    source = pipeline_root(root) / source_filename(args.prefix)
    previous = (
        {}
        if args.refetch or not source.exists()
        else json.loads(source.read_text(encoding="utf-8"))
    )

    print(f"corpus   {root}")
    print(f"repo     {args.repo}")
    print(f"fuente   {source}{'' if previous else '  (rebuild completo)'}")

    candidates = search_candidates(args.repo, args.login)
    print(f"candidatas {len(candidates)}", flush=True)

    activity = fetch_activity(args.repo, args.login, candidates, previous, args.since)
    source.write_text(json.dumps(activity, ensure_ascii=False), encoding="utf-8")

    written = write_fichas(root, args.repo, args.prefix, activity, args.display, args.login)
    total, documented = write_index(root, args.repo, args.prefix, activity, args.display, args.login)

    print(f"escrito  {source}")
    print(f"fichas   {written}")
    print(f"indice   {total} PRs candidatas, {documented} con ficha")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
