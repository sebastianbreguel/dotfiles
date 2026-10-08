#!/usr/bin/env python3
"""Fusiona patterns.BE.json y patterns.FE.json en el patterns.json unico del pipeline.

La fase 2 lanza un agente por repo y cada uno ve un solo digest. Sin este paso pasan
dos cosas malas:

  - layer='core' es inalcanzable. Core exige comment_ids de los DOS repos dentro del
    MISMO patron, y ningun agente de la fase 2 ve los dos digests. PROFILE.md, que el
    agente reviewer lee siempre, saldria vacio por construccion.
  - Concatenar los dos archivos a mano no funciona: los dos agentes producen keys
    identicas de forma natural ('reutilizar-antes-de-crear') y compute.py aborta con
    'key duplicada' en vez de fusionar.

El plan de fusion lo escribe un tercer agente que lee SOLO key/title/statement de los
dos archivos (nunca citas ni numeros, para no romper el invariante del pipeline):

    {
      "merges": [
        {"key": "reutilizar-antes-de-crear",
         "title": "Buscar antes de crear",
         "statement": "...", "trigger": "...", "what_to_comment": "...",
         "from": ["reutilizar-antes-de-crear", "no-duplicar-helpers"]}
      ]
    }

Los `from` se buscan en los dos archivos; los comment_ids de todas las keys de origen
se unen bajo la key fusionada. Las keys que ningun merge menciona pasan tal cual, y si
la misma key existe en los dos repos sin estar fusionada se renombra con prefijo de
repo (`be-`, `fe-`) para que compute.py no aborte.

Uso:
    python3 merge_patterns.py <corpus_dir>
    python3 merge_patterns.py <corpus_dir> --plan .pipeline/merge_plan.json
    python3 merge_patterns.py <corpus_dir> --no-plan       # solo concatenar y desambiguar

Sale con codigo != 0 si un `from` no existe, si una key fusionada choca con una suelta
o si algun archivo esta malformado. Ante cualquier error no escribe nada.
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path

from rules import KEY_RE, LLM_FIELDS, PATTERNS_FILE, brain_file, die, pipeline_file, read_json

REPO_PATTERN_FILES = {"BE": "patterns.BE.json", "FE": "patterns.FE.json"}
PLAN_FILE = "merge_plan.json"
KEY_PREFIX = {"BE": "be-", "FE": "fe-"}


def load_repo_patterns(corpus: Path) -> dict[str, list[dict]]:
    loaded = {}
    for repo, name in REPO_PATTERN_FILES.items():
        path = pipeline_file(corpus, name)
        if not path.is_file():
            continue
        document = read_json(path)
        patterns = document.get("patterns") if isinstance(document, dict) else None
        if not isinstance(patterns, list):
            die(f"{path} debe tener una lista en 'patterns'")
        loaded[repo] = patterns
    if not loaded:
        die(
            "no hay ninguno de "
            + ", ".join(REPO_PATTERN_FILES.values())
            + f" en {pipeline_file(corpus, '')}"
        )
    return loaded


def check_sources(by_repo: dict[str, list[dict]]) -> list[str]:
    return [
        f"{REPO_PATTERN_FILES[repo]} patron #{position}: "
        + (
            f"'key' debe ser kebab-case (llego {pattern.get('key')!r})"
            if not isinstance(pattern.get("key"), str) or not KEY_RE.match(pattern["key"])
            else f"le faltan campos {sorted(set(LLM_FIELDS) - set(pattern))}"
            if not set(LLM_FIELDS).issubset(pattern)
            else "'comment_ids' debe ser una lista"
        )
        for repo, patterns in by_repo.items()
        for position, pattern in enumerate(patterns)
        if not isinstance(pattern.get("key"), str)
        or not KEY_RE.match(pattern["key"])
        or not set(LLM_FIELDS).issubset(pattern)
        or not isinstance(pattern.get("comment_ids"), list)
    ] + [
        f"{REPO_PATTERN_FILES[repo]}: key duplicada {key!r} dentro del mismo archivo"
        for repo, patterns in by_repo.items()
        for key, count in Counter(p.get("key") for p in patterns).items()
        if count > 1
    ]


def sources_index(by_repo: dict[str, list[dict]]) -> dict[tuple[str, str], dict]:
    return {
        (repo, pattern["key"]): pattern
        for repo, patterns in by_repo.items()
        for pattern in patterns
    }


def resolve_origin(origin: str, index: dict[tuple[str, str], dict]) -> list[tuple[str, str]]:
    """Un `from` puede venir calificado ('BE:key') o suelto ('key', en cualquier repo)."""
    if ":" in origin:
        repo, key = origin.split(":", 1)
        return [(repo, key)] if (repo, key) in index else []
    return [pair for pair in index if pair[1] == origin]


def apply_merges(plan: dict, index: dict[tuple[str, str], dict]) -> tuple[list[dict], set, list[str]]:
    errors: list[str] = []
    merged: list[dict] = []
    consumed: set = set()

    for position, merge in enumerate(plan.get("merges") or []):
        key = merge.get("key")
        if not isinstance(key, str) or not KEY_RE.match(key):
            errors.append(f"merge #{position}: 'key' debe ser kebab-case (llego {key!r})")
            continue
        missing_fields = sorted(set(LLM_FIELDS) - set(merge))
        if missing_fields:
            errors.append(f"merge '{key}': le faltan campos {missing_fields}")
            continue

        origins = [
            pair
            for origin in merge.get("from") or []
            for pair in resolve_origin(origin, index)
        ]
        unknown = [
            origin
            for origin in merge.get("from") or []
            if not resolve_origin(origin, index)
        ]
        errors += [
            f"merge '{key}': el origen {origin!r} no existe en "
            + " ni ".join(REPO_PATTERN_FILES.values())
            for origin in unknown
        ]
        already = [pair for pair in origins if pair in consumed]
        errors += [
            f"merge '{key}': el origen {repo}:{origin_key} ya lo consumio otro merge"
            for repo, origin_key in already
        ]
        if unknown or already or not origins:
            if not origins and not unknown:
                errors.append(f"merge '{key}': 'from' vacio, no fusiona nada")
            continue

        consumed |= set(origins)
        merged.append(
            {
                **{field: merge[field] for field in LLM_FIELDS},
                "key": key,
                "comment_ids": list(
                    dict.fromkeys(
                        comment_id
                        for pair in origins
                        for comment_id in index[pair]["comment_ids"]
                    )
                ),
            }
        )
    return merged, consumed, errors


def carry_over(index: dict[tuple[str, str], dict], consumed: set) -> tuple[list[dict], list[str]]:
    """Las keys sueltas pasan tal cual; si chocan entre repos se prefijan con el repo."""
    remaining = [pair for pair in index if pair not in consumed]
    clashing = {
        key for key, count in Counter(key for _, key in remaining).items() if count > 1
    }
    final_key = {
        (repo, key): f"{KEY_PREFIX[repo]}{key}" if key in clashing else key
        for repo, key in remaining
    }
    patterns = [
        {
            **{field: index[pair][field] for field in LLM_FIELDS},
            "key": final_key[pair],
            "comment_ids": list(dict.fromkeys(index[pair]["comment_ids"])),
        }
        for pair in remaining
    ]
    renames = [
        f"{pair[0]}:{pair[1]} -> {final_key[pair]}"
        for pair in remaining
        if final_key[pair] != pair[1]
    ]
    return patterns, renames


def check_result(patterns: list[dict]) -> list[str]:
    return [
        f"key duplicada {key!r} tras la fusion ({count} veces): revisa el plan"
        for key, count in Counter(p["key"] for p in patterns).items()
        if count > 1
    ]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Fusiona los patterns.BE.json / patterns.FE.json que produce la fase 2 en el "
            f"{PATTERNS_FILE} unico que consume compute.py, uniendo los comment_ids de las "
            "keys que el plan de fusion declara equivalentes."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "ejemplo:\n"
            "  python3 merge_patterns.py ~/vambe/all_vambe/lucas_pr\n"
            "\nSin plan de fusion ningun patron puede llegar a layer='core', porque core\n"
            "exige citas de los dos repos dentro del mismo patron.\n"
        ),
    )
    parser.add_argument("corpus_dir", type=Path, help="directorio del corpus del reviewer")
    parser.add_argument(
        "--plan",
        type=Path,
        help=f"plan de fusion (default: <corpus_dir>/.pipeline/{PLAN_FILE})",
    )
    parser.add_argument(
        "--no-plan",
        action="store_true",
        help="no fusionar: solo concatenar los dos archivos desambiguando las keys repetidas",
    )
    parser.add_argument(
        "--out",
        type=Path,
        help=f"archivo de salida (default: <corpus_dir>/brain/{PATTERNS_FILE})",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    corpus = args.corpus_dir.expanduser().resolve()
    if not corpus.is_dir():
        die(f"{corpus} no es un directorio")

    plan_path = args.plan or pipeline_file(corpus, PLAN_FILE)
    out_path = args.out or brain_file(corpus, PATTERNS_FILE)

    by_repo = load_repo_patterns(corpus)
    for repo, patterns in by_repo.items():
        print(f"leido    {pipeline_file(corpus, REPO_PATTERN_FILES[repo])}  ({len(patterns)} patrones)")

    source_errors = check_sources(by_repo)
    if source_errors:
        print("ERRORES de forma, no se escribio nada:", file=sys.stderr)
        for message in source_errors:
            print(f"  - {message}", file=sys.stderr)
        return 1

    index = sources_index(by_repo)
    if args.no_plan:
        plan, errors = {}, []
        print("sin plan de fusion (--no-plan): ningun patron podra ser 'core'")
    else:
        plan = read_json(plan_path, required=False) or {}
        if not plan.get("merges"):
            print(
                f"AVISO: {plan_path} no existe o no tiene 'merges'. Sin fusiones ningun "
                "patron puede llegar a 'core' y PROFILE.md quedaria vacio."
            )
        else:
            print(f"leido    {plan_path}  ({len(plan['merges'])} fusiones)")
        errors = []

    merged, consumed, merge_errors = apply_merges(plan, index)
    kept, renamed = carry_over(index, consumed)
    result = merged + kept
    errors += merge_errors + check_result(result)

    if errors:
        print(f"\n{len(errors)} ERROR(ES), no se escribio nada:", file=sys.stderr)
        for message in errors:
            print(f"  - {message}", file=sys.stderr)
        return 1

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(
        json.dumps({"patterns": result}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    print(f"\nescrito  {out_path}")
    print(f"  fusionados  {len(merged)} patrones desde {len(consumed)} originales")
    print(f"  sueltos     {len(kept)}")
    if renamed:
        print(f"  renombrados por choque de key entre repos: {', '.join(sorted(renamed))}")
    print(f"  total       {len(result)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
