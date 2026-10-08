#!/usr/bin/env python3
"""Health check for Yuyo's knowledge base.

Three things a language model should never be trusted to do by eye:

  1. tell whether a file is past its TTL (arithmetic on dates)
  2. tell whether a cited URL still resolves (link rot invalidates the backing)
  3. count principles and backing levels (an edit can silently drop half a file)

Writes knowledge/STATUS.md and exits non-zero if anything is stale or broken,
so it can gate a refresh.

Usage:
    python3 check_knowledge.py                 # staleness + counts, no network
    python3 check_knowledge.py --check-links   # also verifies every cited URL
    python3 check_knowledge.py --json out.json
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime
from pathlib import Path

KNOWLEDGE = Path(__file__).resolve().parent.parent / "knowledge"

HEADER = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.S)
FIELD = re.compile(r"^(\w+):\s*(.+?)\s*$", re.M)
# Los archivos usan dos estilos de encabezado ("## A1. Titulo" y "## Seccion" +
# "### Principio"), asi que contar por heading da falsos ceros. El campo
# "What it requires" abre todos los principios y ninguna otra cosa.
PRINCIPLE = re.compile(r"^\*\*What it requires\.\*\*", re.M)
URL = re.compile(r"https?://[^\s)\]<>\"'`]+")
BACKING = re.compile(r"\*\*Backing\.\*\*\s*([^\n]+)")

LEVELS = ("source", "evidence", "consensus", "debated")
TTL_MONTHS = {"none": None}

USER_AGENT = "yuyo-knowledge-check/1.0"
TIMEOUT = 12


def parse_ttl(raw: str) -> int | None:
    """'6 months' -> 6; 'none' -> None. Un TTL que no se entiende es un error, no un cero."""
    raw = raw.strip().lower()
    if raw in TTL_MONTHS:
        return TTL_MONTHS[raw]
    match = re.match(r"(\d+)\s*month", raw)
    if not match:
        raise ValueError(f"ttl ilegible: {raw!r}")
    return int(match.group(1))


def months_between(start: date, end: date) -> int:
    return (end.year - start.year) * 12 + (end.month - start.month)


def read_file(path: Path, today: date) -> dict:
    text = path.read_text(encoding="utf-8")
    header = HEADER.match(text)
    fields = dict(FIELD.findall(header.group(1))) if header else {}

    urls = sorted(set(URL.findall(text)))
    backings = [b.lower() for b in BACKING.findall(text)]
    levels = {level: sum(1 for b in backings if level in b) for level in LEVELS}

    entry = {
        "file": str(path.relative_to(KNOWLEDGE)),
        "principles": len(PRINCIPLE.findall(text)),
        "urls": urls,
        "url_count": len(urls),
        "declared_sources": fields.get("sources"),
        "levels": levels,
        "problems": [],
    }

    if not header:
        entry["problems"].append("sin cabecera YAML")
        return entry

    updated_raw = fields.get("updated")
    try:
        updated = datetime.strptime(updated_raw, "%Y-%m-%d").date()
    except (TypeError, ValueError):
        entry["problems"].append(f"campo 'updated' invalido: {updated_raw!r}")
        return entry

    entry["updated"] = updated.isoformat()

    try:
        ttl = parse_ttl(fields.get("ttl", ""))
    except ValueError as exc:
        entry["problems"].append(str(exc))
        return entry

    entry["ttl_months"] = ttl
    age = months_between(updated, today)
    entry["age_months"] = age

    if ttl is None:
        entry["status"] = "permanente"
    elif age >= ttl:
        entry["status"] = "vencido"
        entry["problems"].append(f"vencido: {age} meses, TTL {ttl}")
    elif age >= ttl - 1:
        entry["status"] = "por vencer"
    else:
        entry["status"] = "vigente"

    # Citar MAS URLs de las declaradas es normal: la cabecera cuenta fuentes de
    # respaldo y el archivo tambien enlaza apendices y referencias cruzadas.
    # Citar MENOS es perdida de contenido, y eso si es un problema.
    declared = fields.get("sources")
    if declared and declared.isdigit() and int(declared) > len(urls):
        entry["problems"].append(
            f"cabecera declara {declared} fuentes pero el archivo solo cita {len(urls)}"
        )

    if entry["principles"] == 0 and path.name != "INDEX.md":
        entry["problems"].append("sin principios (posible edicion que borro contenido)")

    return entry


def check_url(url: str) -> tuple[str, int | str]:
    request = urllib.request.Request(url, method="HEAD", headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
            return url, response.status
    except urllib.error.HTTPError as exc:
        # Varios sitios rechazan HEAD pero responden GET: 405 no es link rot.
        if exc.code in (403, 405, 406):
            return url, exc.code
        return url, exc.code
    except Exception as exc:  # noqa: BLE001 - queremos el motivo, sea cual sea
        return url, type(exc).__name__


def render(entries: list[dict], link_results: dict, today: date) -> str:
    lines = [
        "<!-- GENERADO por scripts/check_knowledge.py. No editar a mano. -->",
        "",
        "# Estado de la base de conocimiento",
        "",
        f"Verificado el {today.isoformat()}.",
        "",
        "| Archivo | Principios | Fuentes | Actualizado | Edad | TTL | Estado |",
        "|---|---:|---:|---|---:|---:|---|",
    ]
    for e in sorted(entries, key=lambda x: x["file"]):
        ttl = e.get("ttl_months")
        lines.append(
            f"| `{e['file']}` | {e['principles']} | {e['url_count']} | "
            f"{e.get('updated', '?')} | {e.get('age_months', '?')} | "
            f"{'-' if ttl is None else ttl} | {e.get('status', 'ERROR')} |"
        )

    totals = {level: sum(e["levels"][level] for e in entries) for level in LEVELS}
    lines += [
        "",
        "## Respaldo",
        "",
        " · ".join(f"**{level}**: {count}" for level, count in totals.items()),
        "",
    ]

    problems = [(e["file"], p) for e in entries for p in e["problems"]]
    if problems:
        lines += ["## Problemas", ""]
        lines += [f"- `{f}` — {p}" for f, p in problems]
        lines.append("")

    if link_results:
        rotten = {u: s for u, s in link_results.items() if not isinstance(s, int) or s >= 400}
        lines += [
            "## Enlaces",
            "",
            f"{len(link_results)} URLs verificadas, {len(rotten)} con problema.",
            "",
        ]
        if rotten:
            lines += [f"- `{status}` {url}" for url, status in sorted(rotten.items())]
            lines += [
                "",
                "Un 403 o 406 suele ser el sitio bloqueando bots, no un enlace muerto: "
                "confirmalo a mano antes de sacar la cita.",
                "",
            ]

    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--check-links", action="store_true", help="verificar que cada URL citada responda")
    parser.add_argument("--json", type=Path, help="volcar el informe completo a un JSON")
    parser.add_argument("--today", help="fecha de referencia YYYY-MM-DD (para probar el vencimiento)")
    args = parser.parse_args()

    if not KNOWLEDGE.is_dir():
        print(f"ERROR: no existe {KNOWLEDGE}", file=sys.stderr)
        return 2

    today = datetime.strptime(args.today, "%Y-%m-%d").date() if args.today else date.today()
    entries = [read_file(p, today) for p in sorted(KNOWLEDGE.rglob("*.md")) if p.name != "STATUS.md"]

    link_results: dict[str, int | str] = {}
    if args.check_links:
        urls = sorted({u for e in entries for u in e["urls"]})
        print(f"verificando {len(urls)} URLs...", file=sys.stderr)
        with ThreadPoolExecutor(max_workers=8) as pool:
            link_results = dict(pool.map(check_url, urls))

    (KNOWLEDGE / "STATUS.md").write_text(render(entries, link_results, today), encoding="utf-8")

    stale = [e for e in entries if e.get("status") == "vencido"]
    broken = [e for e in entries if e["problems"]]
    rotten = [u for u, s in link_results.items() if not isinstance(s, int) or s >= 400]

    print(f"{len(entries)} archivos · "
          f"{sum(e['principles'] for e in entries)} principios · "
          f"{len({u for e in entries for u in e['urls']})} URLs distintas")
    print(f"vencidos: {len(stale)} · con problemas: {len(broken)}"
          + (f" · enlaces caidos: {len(rotten)}" if link_results else ""))
    print(f"escrito {KNOWLEDGE / 'STATUS.md'}")

    if args.json:
        args.json.write_text(json.dumps({"entries": entries, "links": link_results},
                                        ensure_ascii=False, indent=2), encoding="utf-8")

    return 1 if (stale or broken or rotten) else 0


if __name__ == "__main__":
    raise SystemExit(main())
