#!/usr/bin/env python3
"""Convierte patterns.json (lo escribe el LLM) en patterns.resolved.json (mecanico).

El LLM solo aporta semantica: key, title, statement, trigger, what_to_comment y una
lista de comment_ids. Todo lo contable lo decide este script leyendo comments.json:

  - texto literal de cada cita  -> inyectado desde comments.json (el LLM nunca lo escribe)
  - owner de cada cita          -> un comment_id pertenece a un solo patron; en los demas
                                   queda owner=false (referencia cruzada, no suma nada)
  - pr_count / prs              -> PRs distintas entre las citas PROPIAS del patron
  - confidence                  -> umbrales de rules.py / profile_config.json sobre pr_count
  - layer                       -> core solo si las citas PROPIAS llegan al minimo de PRs
                                   distintas en CADA repo; si no, la capa del repo dominante

Una PR distinta es el par (repo, pr): la PR 42 de BE y la 42 de FE no son la misma.

Todo lo derivado se calcula sobre las citas PROPIAS. Una cita prestada de otro patron
no prueba nada nuevo: contarla para la capa dejaba patrones declarados 'nucleo' cuya
unica evidencia del segundo repo la misma seccion desmentia como referencia cruzada.
El dueno se decide antes, con un pr_count provisional sobre todas las citas validas,
para que la asignacion no dependa de un campo que todavia no existe.

Uso:
    python3 compute.py <corpus_dir>
    python3 compute.py <corpus_dir> --patterns patterns.json --out patterns.resolved.json

Sale con codigo != 0 si algun comment_id no existe, si no es citable (el digest nunca
se lo mostro al LLM), si un patron se queda sin citas propias, o si patterns.json esta
malformado. Ante cualquier error no escribe nada.
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

from rules import (
    CONFIDENCE_ORDER,
    KEY_RE,
    LAYER_ORDER,
    LLM_FIELDS,
    REPOS,
    comment_key,
    die,
    expected_confidence,
    expected_layer,
    load_config,
    min_prs_per_repo_of,
    brain_file,
    pipeline_file,
    read_json,
    thresholds_of,
)


def load_comments(path: Path) -> dict[str, dict]:
    raw = read_json(path)
    if not isinstance(raw, dict):
        die(f"{path} debe ser un objeto {{comment_id: {{...}}}}")
    return {str(comment_id): payload for comment_id, payload in raw.items()}


def load_patterns(path: Path) -> list[dict]:
    raw = read_json(path)
    patterns = raw.get("patterns") if isinstance(raw, dict) else None
    if not isinstance(patterns, list) or not patterns:
        die(f"{path} debe tener una lista no vacia en 'patterns'")
    return patterns


def check_shape(patterns: list[dict]) -> list[str]:
    bad_keys = [
        f"patron #{position}: 'key' debe ser un string kebab-case no vacio "
        f"(llego {pattern.get('key')!r})"
        for position, pattern in enumerate(patterns)
        if not isinstance(pattern.get("key"), str) or not KEY_RE.match(pattern["key"])
    ]
    missing_fields = [
        f"patron #{position}: le faltan campos {sorted(set(LLM_FIELDS) - set(pattern))}"
        for position, pattern in enumerate(patterns)
        if not set(LLM_FIELDS).issubset(pattern)
    ]
    bad_ids = [
        f"patron '{pattern.get('key', f'#{position}')}': 'comment_ids' debe ser una lista"
        for position, pattern in enumerate(patterns)
        if not isinstance(pattern.get("comment_ids"), list)
    ]
    repeated = [
        f"key duplicada {key!r} ({count} veces): las keys deben ser unicas"
        for key, count in Counter(pattern.get("key") for pattern in patterns).items()
        if count > 1
    ]
    return bad_keys + missing_fields + bad_ids + repeated


def dedupe(comment_ids: list) -> list[str]:
    return list(dict.fromkeys(str(comment_id) for comment_id in comment_ids))


def classify_ids(pattern: dict, comments: dict[str, dict]) -> dict[str, list[str]]:
    unique = dedupe(pattern["comment_ids"])
    duplicated = [
        comment_id
        for comment_id, count in Counter(
            str(raw_id) for raw_id in pattern["comment_ids"]
        ).items()
        if count > 1
    ]
    missing = [comment_id for comment_id in unique if comment_id not in comments]
    known = [comment_id for comment_id in unique if comment_id in comments]
    own = [comment_id for comment_id in known if comments[comment_id].get("own") is True]
    not_citable = [
        comment_id
        for comment_id in known
        if comment_id not in own and not comments[comment_id].get("citable")
    ]
    usable = [
        comment_id
        for comment_id in known
        if comment_id not in own and comment_id not in not_citable
    ]
    return {
        "usable": usable,
        "missing": missing,
        "own": own,
        "not_citable": not_citable,
        "duplicated": duplicated,
    }


def distinct_prs(comment_ids: list[str], comments: dict[str, dict]) -> list[dict]:
    pairs = sorted(
        {comment_key(comments[comment_id]) for comment_id in comment_ids},
        key=lambda pair: (str(pair[0]), str(pair[1])),
    )
    return [{"repo": repo, "pr": pr} for repo, pr in pairs]


def prs_per_repo(comment_ids: list[str], comments: dict[str, dict]) -> dict[str, int]:
    return {
        repo: len(
            {
                comment_key(comments[comment_id])
                for comment_id in comment_ids
                if comments[comment_id].get("repo") == repo
            }
        )
        for repo in REPOS
    }


def assign_owners(usable_by_key: dict[str, list[str]], comments: dict[str, dict]) -> dict[str, str]:
    """Gana el patron con mas PRs distintas; si empatan, la key alfabeticamente menor.

    El criterio no puede mirar la capa: la capa se calcula despues, justamente a
    partir de las citas que este reparto decide.
    """
    claimants = defaultdict(list)
    for key, comment_ids in usable_by_key.items():
        for comment_id in comment_ids:
            claimants[comment_id].append(key)

    breadth = {
        key: len({comment_key(comments[comment_id]) for comment_id in comment_ids})
        for key, comment_ids in usable_by_key.items()
    }
    return {
        comment_id: min(keys, key=lambda key: (-breadth[key], key))
        for comment_id, keys in claimants.items()
    }


def citation(comment_id: str, comment: dict, owner_key: str, key: str) -> dict:
    return {
        "comment_id": comment_id,
        "pr": comment.get("pr"),
        "repo": comment.get("repo"),
        "kind": comment.get("kind"),
        "path": comment.get("path"),
        "body": comment.get("body"),
        "url": comment.get("url"),
        "owner": owner_key == key,
    }


def collect_ids(
    patterns: list[dict], comments: dict[str, dict]
) -> tuple[dict[str, list[str]], list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    usable_by_key: dict[str, list[str]] = {}

    for pattern in patterns:
        key = pattern["key"]
        buckets = classify_ids(pattern, comments)
        errors += [
            f"patron '{key}': comment_id {comment_id} no existe en comments.json"
            for comment_id in buckets["missing"]
        ]
        errors += [
            f"patron '{key}': comment_id {comment_id} no es citable "
            "(emoji, imagen o menos de 8 caracteres): el digest nunca se lo mostro al LLM"
            for comment_id in buckets["not_citable"]
        ]
        warnings += [
            f"patron '{key}': comment_id {comment_id} descartado, es de una PR del propio reviewer (own=true)"
            for comment_id in buckets["own"]
        ]
        warnings += [
            f"patron '{key}': comment_id {comment_id} estaba repetido en comment_ids, se conto una sola vez"
            for comment_id in buckets["duplicated"]
        ]
        if not buckets["usable"] and not buckets["missing"] and not buckets["not_citable"]:
            errors.append(f"patron '{key}': se quedo sin citas utilizables")
        usable_by_key[key] = buckets["usable"]

    return usable_by_key, errors, warnings


def resolve(
    patterns: list[dict],
    comments: dict[str, dict],
    thresholds: dict,
    min_prs_per_repo: int,
) -> tuple[list[dict], list[str], list[str]]:
    usable_by_key, errors, warnings = collect_ids(patterns, comments)
    if errors:
        return [], errors, warnings

    owner_by_comment = assign_owners(usable_by_key, comments)

    resolved = []
    for pattern in patterns:
        key = pattern["key"]
        comment_ids = usable_by_key[key]
        owned = [
            comment_id
            for comment_id in comment_ids
            if owner_by_comment[comment_id] == key
        ]
        borrowed = [comment_id for comment_id in comment_ids if comment_id not in owned]
        warnings += [
            f"patron '{key}': comment_id {comment_id} ya pertenece a '{owner_by_comment[comment_id]}', "
            f"queda como referencia cruzada y no suma confianza ni capa"
            for comment_id in borrowed
        ]
        if not owned:
            errors.append(
                f"patron '{key}': todas sus citas ya pertenecen a otros patrones, "
                "no le queda evidencia propia con que declarar confianza; "
                "dale citas propias o fusionalo con el patron dueno"
            )
            continue

        by_repo = prs_per_repo(owned, comments)
        layer = expected_layer(by_repo, min_prs_per_repo)
        warnings += [
            f"patron '{key}': evidencia propia en {repo} de {by_repo[repo]} PR(s), "
            f"menos de las {min_prs_per_repo} que exige el nucleo; queda en '{layer}' "
            f"y esas citas valen como evidencia secundaria"
            for repo in REPOS
            if layer != "core" and 0 < by_repo[repo] < min_prs_per_repo
        ]
        prs = distinct_prs(owned, comments)
        resolved.append(
            {
                **{field: pattern[field] for field in LLM_FIELDS},
                "layer": layer,
                "confidence": expected_confidence(len(prs), thresholds),
                "pr_count": len(prs),
                "prs": prs,
                "prs_per_repo": by_repo,
                "comment_ids": comment_ids,
                "citations": [
                    citation(comment_id, comments[comment_id], owner_by_comment[comment_id], key)
                    for comment_id in comment_ids
                ],
            }
        )
    return resolved, errors, warnings


def summary_table(resolved: list[dict]) -> str:
    grid = Counter((pattern["layer"], pattern["confidence"]) for pattern in resolved)
    header = f"{'capa':<10}" + "".join(f"{name:>8}" for name in CONFIDENCE_ORDER) + f"{'total':>8}"
    rows = [
        f"{layer:<10}"
        + "".join(f"{grid[(layer, level)]:>8}" for level in CONFIDENCE_ORDER)
        + f"{sum(grid[(layer, level)] for level in CONFIDENCE_ORDER):>8}"
        for layer in LAYER_ORDER
        if any(grid[(layer, level)] for level in CONFIDENCE_ORDER)
    ]
    totals = (
        f"{'TOTAL':<10}"
        + "".join(
            f"{sum(grid[(layer, level)] for layer in LAYER_ORDER):>8}"
            for level in CONFIDENCE_ORDER
        )
        + f"{len(resolved):>8}"
    )
    return "\n".join([header, "-" * len(header), *rows, "-" * len(header), totals])


def citation_stats(resolved: list[dict]) -> str:
    owned = sum(
        1 for pattern in resolved for cite in pattern["citations"] if cite["owner"]
    )
    borrowed = sum(
        1 for pattern in resolved for cite in pattern["citations"] if not cite["owner"]
    )
    return f"citas propias: {owned} | referencias cruzadas: {borrowed}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Resuelve patterns.json -> patterns.resolved.json: valida comment_ids contra "
            "comments.json, inyecta el texto literal de cada cita y calcula layer, "
            "confidence, pr_count y el dueño de cada cita."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "reglas (los umbrales efectivos se imprimen al arrancar; salen de\n"
            ".pipeline/profile_config.json via rules.py, el mismo modulo que usa validate.py):\n"
            "  confidence  alta / media / baja segun las PRs distintas de las citas PROPIAS\n"
            "  layer       core si las citas propias llegan al minimo de PRs en CADA repo\n"
            "  dueño       gana el patron con mas PRs distintas; si empata, la key menor\n"
            "\nver los umbrales de un corpus:  python3 rules.py <corpus_dir>\n"
            "\nejemplo:\n"
            "  python3 compute.py ~/vambe/all_vambe/lucas_pr\n"
        ),
    )
    parser.add_argument(
        "corpus_dir",
        type=Path,
        help="directorio del corpus del reviewer (sus artefactos viven en .pipeline/)",
    )
    parser.add_argument(
        "--patterns",
        type=Path,
        help="patterns.json de entrada (default: <corpus_dir>/.pipeline/patterns.json)",
    )
    parser.add_argument(
        "--out",
        type=Path,
        help="archivo de salida (default: <corpus_dir>/.pipeline/patterns.resolved.json)",
    )
    parser.add_argument(
        "--comments",
        type=Path,
        help="comments.json de entrada (default: <corpus_dir>/.pipeline/comments.json)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    corpus = args.corpus_dir.expanduser().resolve()
    if not corpus.is_dir():
        die(f"{corpus} no es un directorio")

    comments_path = args.comments or pipeline_file(corpus, "comments.json")
    patterns_path = args.patterns or brain_file(corpus, "patterns.json")
    out_path = args.out or pipeline_file(corpus, "patterns.resolved.json")

    config = load_config(corpus)
    thresholds = thresholds_of(config)
    min_prs = min_prs_per_repo_of(config)

    print(f"leyendo patrones   {patterns_path}")
    print(f"leyendo evidencia  {comments_path}")
    print(f"umbrales           alta>={thresholds['alta']} PRs, media>={thresholds['media']}, "
          f"nucleo>={min_prs} PRs por repo")

    comments = load_comments(comments_path)
    patterns = load_patterns(patterns_path)

    shape_errors = check_shape(patterns)
    if shape_errors:
        print("ERRORES de forma en patterns.json, no se escribio nada:", file=sys.stderr)
        for message in shape_errors:
            print(f"  - {message}", file=sys.stderr)
        return 1

    resolved, errors, warnings = resolve(patterns, comments, thresholds, min_prs)

    for message in warnings:
        print(f"AVISO: {message}")
    sys.stdout.flush()

    if errors:
        print(f"\n{len(errors)} ERROR(ES), no se escribio nada:", file=sys.stderr)
        for message in errors:
            print(f"  - {message}", file=sys.stderr)
        return 1

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(
        json.dumps(
            {
                "patterns": resolved,
                "thresholds": thresholds,
                "min_prs_per_repo": min_prs,
                "warnings": warnings,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    print(f"\nleido   {patterns_path}  ({len(patterns)} patrones)")
    print(f"evidencia {comments_path}  ({len(comments)} comentarios)")
    print(f"escrito {out_path}\n")
    print(summary_table(resolved))
    print()
    print(citation_stats(resolved))
    print(f"avisos: {len(warnings)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
