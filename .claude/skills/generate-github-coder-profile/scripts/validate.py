#!/usr/bin/env python3
"""Validacion mecanica del pipeline de perfiles de reviewer.

Comprueba el estado del corpus SIN parsear prosa en ningun momento. Tres intentos de
verificar el markdown con regex dieron falsos positivos: como las citas se inyectan
literales, un comentario del corpus puede contener cualquier cosa que un patron
confunda con una cabecera generada. Lo que se verifica son JSON y hashes.

Chequeos:

  1. patterns.resolved.json es EXACTAMENTE lo que produce compute.py desde
     patterns.json + comments.json. Un solo chequeo, estrictamente mas fuerte que
     revisar campo por campo: cubre citas inventadas, bodies editados a mano, dueno
     duplicado, confidence/layer/pr_count mal calculados y textos semanticos
     escritos en el archivo derivado en vez de en patterns.json.
  2. Ningun patron trae la clave 'owner' a nivel raiz: el dueno vive por cita, y dos
     ubicaciones para el mismo dato hacen que render y validate lean cosas distintas.
  3. lexicon.json (si existe): sus example_ids existen, son utilizables y citables.
  4. rendered_stats.json (lo escribe render.py): sus conteos coinciden con
     comments.json y el hash de cada archivo generado coincide con el disco, o sea
     que nadie edito a mano un PROFILE*.md.
  5. Cobertura: % de comentarios CITABLES citados por algun patron y las PRs con mas
     comentarios sin citar (senial de criterios que faltan capturar).

Uso:
    python3 validate.py <corpus_dir>
    python3 validate.py <corpus_dir> --strict        # los AVISO cuentan como FALLA
    python3 validate.py <corpus_dir> --top-prs 25
    python3 validate.py <corpus_dir> --json informe.json

Exit codes: 0 todo OK, 1 al menos un chequeo en FALLA, 2 faltan archivos de entrada.

Los umbrales salen de <corpus_dir>/.pipeline/profile_config.json a traves de rules.py,
el mismo modulo que usa compute.py, para que no existan dos reglas de confianza.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from collections import Counter
from pathlib import Path

from compute import check_shape, load_comments, load_patterns, resolve
from render import LEXICON_BEGIN, LEXICON_END, VOICE_RELATIVE
from rules import (
    brain_file,
    COMMENTS_FILE,
    LEXICON_FILE,
    PATTERNS_FILE,
    RENDERED_STATS_FILE,
    RESOLVED_FILE,
    citable_comments,
    comment_key,
    die,
    load_config,
    min_prs_per_repo_of,
    pipeline_file,
    read_json,
    thresholds_of,
    usable_comments,
)

STATUS_OK = "  OK  "
STATUS_WARN = " AVISO"
STATUS_FAIL = " FALLA"

RECOMPUTE_CHECK = f"{RESOLVED_FILE} coincide con regenerarlo desde {PATTERNS_FILE}"


class Report:
    """Acumula el resultado de cada chequeo y decide el exit code."""

    def __init__(self, strict: bool) -> None:
        self.strict = strict
        self.rows: list[dict] = []

    def add(self, name: str, errors=None, warnings=None, notes=None) -> None:
        self.rows.append(
            {
                "name": name,
                "errors": list(errors or []),
                "warnings": list(warnings or []),
                "notes": list(notes or []),
            }
        )

    def status_of(self, row: dict) -> str:
        if row["errors"]:
            return STATUS_FAIL
        if row["warnings"]:
            return STATUS_FAIL if self.strict else STATUS_WARN
        return STATUS_OK

    @property
    def failed(self) -> bool:
        return any(self.status_of(row) == STATUS_FAIL for row in self.rows)

    def render(self, detail_limit: int) -> str:
        lines: list[str] = []
        for row in self.rows:
            lines.append(f"[{self.status_of(row)}] {row['name']}")
            problems = row["errors"] + row["warnings"]
            for message in problems[:detail_limit]:
                lines.append(f"         - {message}")
            hidden = len(problems) - detail_limit
            if hidden > 0:
                lines.append(f"         - ... y {hidden} mas")
            for note in row["notes"]:
                lines.append(f"         · {note}")
        return "\n".join(lines)

    def as_dict(self) -> dict:
        return {
            "failed": self.failed,
            "strict": self.strict,
            "checks": [{**row, "status": self.status_of(row).strip()} for row in self.rows],
        }


def field_diff(expected: dict, actual: dict) -> list[str]:
    fields = sorted(set(expected) | set(actual))
    return [
        f"{field}: esperado {expected.get(field)!r}, hay {actual.get(field)!r}"
        for field in fields
        if expected.get(field) != actual.get(field)
    ]


def summarize_field(field: str, expected, actual) -> str:
    if field == "citations":
        expected_ids = [str(c.get("comment_id")) for c in expected or []]
        actual_ids = [str(c.get("comment_id")) for c in actual or []]
        if expected_ids != actual_ids:
            return (
                f"citations: los comment_id no coinciden "
                f"(esperados {expected_ids}, hay {actual_ids})"
            )
        differing = [
            f"{expected_ids[position]} ({', '.join(field_diff(one, other))})"
            for position, (one, other) in enumerate(zip(expected, actual))
            if one != other
        ]
        return f"citations: {'; '.join(differing)}"
    return f"{field}: esperado {expected!r}, hay {actual!r}"


def compare_patterns(expected: list[dict], actual: list[dict]) -> list[str]:
    by_key_expected = {p["key"]: p for p in expected}
    by_key_actual = {str(p.get("key")): p for p in actual}
    errors = [
        f"'{key}' sale de {PATTERNS_FILE} pero no esta en {RESOLVED_FILE}"
        for key in sorted(set(by_key_expected) - set(by_key_actual))
    ] + [
        f"'{key}' esta en {RESOLVED_FILE} pero no sale de {PATTERNS_FILE}"
        for key in sorted(set(by_key_actual) - set(by_key_expected))
    ]
    for key in sorted(set(by_key_expected) & set(by_key_actual)):
        one, other = by_key_expected[key], by_key_actual[key]
        errors += [
            f"{key}: {summarize_field(field, one.get(field), other.get(field))}"
            for field in sorted(set(one) | set(other))
            if one.get(field) != other.get(field)
        ]
    return errors


def check_recompute(corpus: Path, comments: dict, resolved_doc: dict, report: Report) -> None:
    patterns_path = brain_file(corpus, PATTERNS_FILE)
    if not patterns_path.is_file():
        report.add(
            RECOMPUTE_CHECK,
            errors=[
                f"falta {patterns_path}: sin la fuente de verdad no hay forma de verificar "
                f"{RESOLVED_FILE}, que es un artefacto derivado"
            ],
        )
        return

    config = load_config(corpus)
    thresholds = thresholds_of(config)
    min_prs = min_prs_per_repo_of(config)

    llm_patterns = load_patterns(patterns_path)
    shape_errors = check_shape(llm_patterns)
    if shape_errors:
        report.add(RECOMPUTE_CHECK, errors=shape_errors)
        return

    expected, compute_errors, _ = resolve(llm_patterns, comments, thresholds, min_prs)
    if compute_errors:
        report.add(
            RECOMPUTE_CHECK,
            errors=[f"compute.py no puede resolver {PATTERNS_FILE}: {msg}" for msg in compute_errors],
        )
        return

    errors = compare_patterns(expected, resolved_doc.get("patterns", []))
    stale_config = [
        f"{name}: el resuelto se calculo con {resolved_doc.get(name)!r} pero la config "
        f"actual dice {value!r}; volve a correr compute.py"
        for name, value in (("thresholds", thresholds), ("min_prs_per_repo", min_prs))
        if name in resolved_doc and resolved_doc[name] != value
    ]
    report.add(
        RECOMPUTE_CHECK,
        errors=errors + stale_config,
        notes=[
            "los campos semanticos se editan en patterns.json; una diferencia aca "
            f"significa que se edito {RESOLVED_FILE} a mano o que falta correr compute.py"
        ]
        if errors
        else [],
    )


def check_owner_location(patterns: list, report: Report) -> None:
    errors = [
        f"{pattern.get('key')}: tiene 'owner' a nivel patron; el dueno vive por cita "
        "(citations[].owner) y dos ubicaciones se leen distinto en cada script"
        for pattern in patterns
        if "owner" in pattern
    ]
    report.add("El dueno de una cita vive en un solo lugar (citations[].owner)", errors)


def check_lexicon(lexicon, comments: dict, report: Report) -> None:
    if lexicon is None:
        report.add(
            "Lexicon: los ejemplos existen y son citables",
            warnings=[f"{LEXICON_FILE} no existe"],
        )
        return

    citable = citable_comments(comments)
    errors: list[str] = []
    for entry in lexicon.get("entries", []):
        phrase = entry.get("phrase", "<sin-phrase>")
        if not str(entry.get("meaning", "")).strip():
            errors.append(f"'{phrase}': meaning vacio")
        ids = [str(cid) for cid in entry.get("example_ids") or []]
        if not ids:
            errors.append(f"'{phrase}': sin example_ids")
        errors += [
            f"'{phrase}': example_id {cid} no existe en {COMMENTS_FILE}"
            if cid not in comments
            else f"'{phrase}': example_id {cid} es de una PR propia del reviewer"
            if comments[cid].get("own")
            else f"'{phrase}': example_id {cid} no es citable (emoji, imagen o muy corto)"
            for cid in ids
            if cid not in citable
        ]
        # El lexicon describe COMO HABLA. Un comentario redactado por su
        # herramienta de review sirve como criterio, nunca como voz.
        errors += [
            f"'{phrase}': example_id {cid} lo redacto la herramienta de review, no es su voz"
            for cid in ids
            if cid in comments and not comments[cid].get("authored", True)
        ]
    report.add("Lexicon: los ejemplos existen, son citables y los escribio el reviewer", errors)


DEFAULT_MIN_COVERAGE = 70.0


def check_coverage(summary: dict, minimum: float, report: Report) -> None:
    """Cobertura baja = el agente agrupo de menos y quedo criterio real sin recoger.

    Antes esto solo se imprimia. Un perfil con 35% de cobertura pasaba en verde,
    que es exactamente como se perdio un tercio de la evidencia sin que nadie lo
    notara.
    """
    pct = summary.get("coverage_pct", 0.0)
    label = f"Cobertura >= {minimum:g}% de los comentarios citables"
    if pct < minimum:
        report.add(label, errors=[
            f"cobertura {pct:.1f}%: {summary.get('uncited', '?')} comentarios citables "
            f"sin ningun patron. Rehace la fase 2 agrupando esos, no bajes el umbral"
        ])
        return
    report.add(label, [])


def expected_corpus_stats(comments: dict) -> dict:
    usable = usable_comments(comments)
    own = {cid: c for cid, c in comments.items() if c.get("own")}
    return {
        "comentarios_totales": len(comments),
        "comentarios_utilizables": len(usable),
        "comentarios_propios": len(own),
        "prs_propias": len({comment_key(c) for c in own.values()}),
    }


def generated_section(text: str) -> str | None:
    if LEXICON_BEGIN not in text or LEXICON_END not in text:
        return None
    return text.split(LEXICON_BEGIN, 1)[1].split(LEXICON_END, 1)[0]


def file_digest(corpus: Path, name: str) -> str | None:
    path = corpus / name
    if not path.is_file():
        return None
    text = path.read_text(encoding="utf-8")
    if name == VOICE_RELATIVE.as_posix():
        section = generated_section(text)
        if section is None:
            return None
        text = LEXICON_BEGIN + section + LEXICON_END + "\n"
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def check_rendered_stats(corpus: Path, comments: dict, patterns: list, report: Report) -> None:
    stats = read_json(pipeline_file(corpus, RENDERED_STATS_FILE), required=False)
    if stats is None:
        report.add(
            "Markdown generado: conteos y hash coinciden con la fuente",
            warnings=[
                f"falta {RENDERED_STATS_FILE}: render.py todavia no corrio, no hay "
                "markdown que verificar"
            ],
        )
        return

    errors = [
        f"corpus.{key}={stats.get('corpus', {}).get(key)} pero el real es {value}"
        for key, value in expected_corpus_stats(comments).items()
        if stats.get("corpus", {}).get(key) != value
    ]
    by_layer = Counter(p.get("layer") for p in patterns)
    files = stats.get("files", {})
    errors += [
        f"{name}: declara {info.get('patrones')} patrones pero {RESOLVED_FILE} tiene "
        f"{by_layer[layer]} de esa capa"
        for layer, name in (
            ("core", "agent/PROFILE.md"),
            ("backend", "agent/PROFILE.backend.md"),
            ("frontend", "agent/PROFILE.frontend.md"),
        )
        if (info := files.get(name)) and info.get("patrones") != by_layer[layer]
    ]
    for name, info in sorted(files.items()):
        actual = file_digest(corpus, name)
        if actual is None:
            errors.append(f"{name}: render.py lo genero pero no esta en disco (o perdio su seccion generada)")
        elif actual != info.get("sha256"):
            errors.append(
                f"{name}: el contenido en disco no coincide con lo que escribio render.py "
                "(se edito a mano; los cambios se hacen en patterns.json y se re-renderiza)"
            )
    report.add(
        "Markdown generado: conteos y hash coinciden con la fuente",
        errors,
        notes=[f"{len(files)} archivo(s) generado(s) verificado(s)"],
    )


def coverage_report(comments: dict, patterns: list, top_prs: int) -> tuple[dict, list[str]]:
    usable = usable_comments(comments)
    citable = citable_comments(comments)
    cited = {
        str(c.get("comment_id")) for pattern in patterns for c in pattern.get("citations", [])
    }
    uncited = {cid: c for cid, c in citable.items() if cid not in cited}
    per_pr = Counter(comment_key(c) for c in uncited.values())
    total_per_pr = Counter(comment_key(c) for c in citable.values())

    pct = 100.0 * (len(citable) - len(uncited)) / len(citable) if citable else 0.0
    by_repo = {
        repo: (
            sum(1 for c in citable.values() if c.get("repo") == repo),
            sum(1 for c in uncited.values() if c.get("repo") == repo),
        )
        for repo in sorted({c.get("repo") for c in citable.values()})
    }

    lines = [
        f"Comentarios citables    : {len(citable)}   (denominador: es lo unico que vio el LLM)",
        f"Citados por algun patron: {len(citable) - len(uncited)} ({pct:.1f}%)",
        f"Sin citar               : {len(uncited)}",
        f"Fuera del denominador   : {len(usable) - len(citable)} utilizables no citables "
        "(emoji, imagen o menos de 8 caracteres)",
    ]
    lines += [
        f"  {repo}: {total - miss}/{total} citados ({100.0 * (total - miss) / total:.1f}%)"
        for repo, (total, miss) in by_repo.items()
        if total
    ]
    lines.append(f"PRs con mas comentarios citables sin citar (top {top_prs}):")
    lines += [
        f"  {repo} #{pr}: {count} sin citar de {total_per_pr[(repo, pr)]}"
        for (repo, pr), count in per_pr.most_common(top_prs)
    ]
    summary = {
        "citable": len(citable),
        "cited": len(citable) - len(uncited),
        "uncited": len(uncited),
        "usable_not_citable": len(usable) - len(citable),
        "coverage_pct": round(pct, 2),
        "top_uncited_prs": [
            {"repo": repo, "pr": pr, "uncited": count, "total": total_per_pr[(repo, pr)]}
            for (repo, pr), count in per_pr.most_common(top_prs)
        ],
    }
    return summary, lines


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Valida mecanicamente el corpus de un reviewer: regenera "
            f"{RESOLVED_FILE} desde {PATTERNS_FILE} y lo compara, revisa el lexicon, "
            "verifica por hash que nadie edito a mano el markdown generado e informa "
            "la cobertura sobre los comentarios citables."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Exit 0 = todo OK, 1 = algun chequeo en FALLA, 2 = faltan archivos de entrada.\n"
            "\nejemplo:\n"
            "  python3 validate.py ~/vambe/all_vambe/lucas_pr --strict\n"
        ),
    )
    parser.add_argument("corpus_dir", type=Path, help="directorio del corpus del reviewer")
    parser.add_argument(
        "--min-coverage",
        type=float,
        default=DEFAULT_MIN_COVERAGE,
        help=f"cobertura minima de comentarios citables (default {DEFAULT_MIN_COVERAGE:g}%%)",
    )
    parser.add_argument("--strict", action="store_true", help="tratar los AVISO como FALLA")
    parser.add_argument(
        "--top-prs", type=int, default=15, help="cuantas PRs sin citar listar (default: %(default)s)"
    )
    parser.add_argument(
        "--detail-limit",
        type=int,
        default=20,
        help="maximo de mensajes por chequeo (default: %(default)s)",
    )
    parser.add_argument("--json", type=Path, help="ademas del informe, escribirlo en este archivo")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    corpus = args.corpus_dir.expanduser().resolve()
    if not corpus.is_dir():
        die(f"{corpus} no es un directorio")

    comments_path = pipeline_file(corpus, COMMENTS_FILE)
    resolved_path = pipeline_file(corpus, RESOLVED_FILE)
    comments = load_comments(comments_path)
    resolved_doc = read_json(resolved_path)
    if isinstance(resolved_doc, list):
        resolved_doc = {"patterns": resolved_doc}
    patterns = resolved_doc.get("patterns", [])
    if not patterns:
        die(f"{resolved_path} no contiene patrones")

    config = load_config(corpus)
    thresholds = thresholds_of(config)

    report = Report(strict=args.strict)
    check_recompute(corpus, comments, resolved_doc, report)
    check_owner_location(patterns, report)
    check_lexicon(read_json(brain_file(corpus, LEXICON_FILE), required=False), comments, report)
    check_rendered_stats(corpus, comments, patterns, report)

    summary, coverage_lines = coverage_report(comments, patterns, args.top_prs)
    check_coverage(summary, args.min_coverage, report)

    print(f"Corpus:    {corpus}")
    print(f"Evidencia: {comments_path}")
    print(f"Resuelto:  {resolved_path}")
    print(
        f"Patrones: {len(patterns)}   Comentarios: {len(comments)}   "
        f"Umbrales confianza: alta>={thresholds['alta']} PRs, media>={thresholds['media']}, "
        f"nucleo>={min_prs_per_repo_of(config)} PRs por repo"
    )
    print()
    print(report.render(args.detail_limit))
    print()
    print("Cobertura")
    print("\n".join(f"  {line}" for line in coverage_lines))
    print()
    print("RESULTADO: FALLA" if report.failed else "RESULTADO: OK")

    if args.json:
        args.json.write_text(
            json.dumps({**report.as_dict(), "coverage": summary}, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print(f"Informe JSON: {args.json}")

    return 1 if report.failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
