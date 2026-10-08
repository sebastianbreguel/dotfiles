#!/usr/bin/env python3
"""Renderiza los markdown del perfil de un reviewer desde patterns.resolved.json.

Es la unica pieza que escribe prosa estructural, y NO inventa nada: el texto de cada
cita sale literal de comments.json (via patterns.resolved.json), la confianza y la
capa las calculo compute.py, y los conteos del corpus y del lexico los cuenta este
script. El LLM nunca escribe citas, ni confianza, ni numeros.

Renderiza; no valida. Las reglas de coherencia son de compute.py (que las aplica) y
de validate.py (que las re-verifica): una tercera copia aca ya habia divergido y
producia mensajes de error falsos. El orden correcto es:

    compute.py  ->  validate.py  ->  render.py

Entradas (en <corpus_dir>/.pipeline/):
  comments.json            indice literal de comentarios (lo produce make_index.py)
  patterns.resolved.json   patrones con campos derivados (lo produce compute.py)
  lexicon.json             opcional: frases y significado, sin conteos

Salidas (se SOBRESCRIBEN completas, son artefactos derivados):
  <corpus_dir>/PROFILE.md            patrones layer=core
  <corpus_dir>/PROFILE.backend.md    patrones layer=backend
  <corpus_dir>/PROFILE.frontend.md   patrones layer=frontend
  <corpus_dir>/agent/VOICE.md        solo la seccion "## Lexico", si hay lexicon.json
  .pipeline/rendered_stats.json      conteos y hash de lo escrito, para validate.py

El sidecar existe para que validate.py verifique los numeros y detecte ediciones a
mano SIN volver a parsear el markdown: como las citas se inyectan literales, un
comentario del corpus puede contener cualquier cosa que un regex confunda con una
cabecera generada.

Ante cualquier error no escribe nada: un perfil invalido en disco es indistinguible
de uno bueno para quien lo lee despues.

Uso:
  python3 render.py <corpus_dir> --display "Lucas" --login ljrodriguez1
  python3 render.py <corpus_dir> --display "Lucas" --login ljrodriguez1 --lexicon otro.json
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path

from rules import (
    brain_file,
    DEFAULT_MIN_PRS_PER_REPO,
    DEFAULT_THRESHOLDS,
    LAYER_ORDER,
    REPO_NAMES,
    REPOS,
    comment_key,
    die,
    flatten,
    pipeline_file,
    read_json,
    usable_comments,
)

LAYER_FILES = {
    "core": "agent/PROFILE.md",
    "backend": "agent/PROFILE.backend.md",
    "frontend": "agent/PROFILE.frontend.md",
}

LAYER_TITLES = {"core": "NUCLEO", "backend": "BACKEND", "frontend": "FRONTEND"}

VOICE_RELATIVE = Path("agent") / "VOICE.md"

GENERATED_BANNER = (
    "<!-- ARCHIVO GENERADO por scripts/render.py desde patterns.resolved.json. "
    "NO editar a mano: se sobrescribe completo en cada corrida. "
    "Para cambiar algo, edita patterns.json y volve a correr compute.py + render.py. -->"
)

LEXICON_BEGIN = "<!-- BEGIN:lexicon (generado por scripts/render.py — no editar a mano) -->"
LEXICON_END = "<!-- END:lexicon -->"

CITATION_NOTATION = (
    "Notacion de citas: `\"texto literal\" — PR #N (repo), archivo`. "
    "`BE` = `vambeai-backend` · `FE` = `vambe-turborepo-frontend`. "
    "Citas literales, typos incluidos, con dos ajustes de formato que no cambian lo "
    "que se lee: los saltos de linea se aplanan a espacios y el `<` que abriria una "
    "etiqueta HTML se escapa para que el markdown no se coma el texto."
)

ENTITY_START_RE = re.compile(r"&(?=[a-zA-Z#][a-zA-Z0-9]*;)")
TAG_OPEN_RE = re.compile(r"<(?=[a-zA-Z/!?])")
LONG_FENCE_RE = re.compile(r"`{3,}")


def layer_scope(layer: str, min_prs_per_repo: int) -> str:
    if layer == "core":
        return (
            f"Rasgos con evidencia propia en **los dos repos** (`{REPO_NAMES['BE']}` y "
            f"`{REPO_NAMES['FE']}`), al menos {min_prs_per_repo} PRs distintas en cada "
            "uno. Se lee **siempre**, sea cual sea el diff."
        )
    other = "FE" if layer == "backend" else "BE"
    stack = (
        "NestJS / TypeORM / BullMQ / migraciones"
        if layer == "backend"
        else "React / Next / monorepo / design system / i18n"
    )
    repo = "BE" if layer == "backend" else "FE"
    return (
        f"Rasgos cuya evidencia esta **sobre todo en `{REPO_NAMES[repo]}`** ({stack}). "
        f"Se lee cuando el diff toca ese repo. Un patron puede traer alguna cita de "
        f"`{REPO_NAMES[other]}` como evidencia secundaria sin llegar al minimo que "
        "exige el nucleo."
    )


def confidence_rule(thresholds: dict) -> str:
    return (
        "La confianza se declara **una sola vez por seccion** y sale del numero de PRs "
        f"**distintas** que sostienen el patron: alta = {thresholds['alta']} o mas, "
        f"media = {thresholds['media']}, baja = menos. Las citas no llevan sufijo de "
        "confianza."
    )


def strip_accents(text: str) -> str:
    return "".join(
        char
        for char in unicodedata.normalize("NFD", text or "")
        if unicodedata.category(char) != "Mn"
    )


def normalize(text: str) -> str:
    return strip_accents(text).lower()


def neutralize_markdown(body: str) -> str:
    """Deja el texto visible identico pero inerte para el parser de markdown.

    Los bodies traen JSX (`<Link />`), pixeles de tracking (`<img ...>`) y fences de
    tres backticks que al aplanarse quedan desbalanceados; sin esto la cita publicada
    pierde caracteres o dispara una request remota desde el perfil.
    """
    text = LONG_FENCE_RE.sub("`", flatten(body))
    text = TAG_OPEN_RE.sub("&lt;", ENTITY_START_RE.sub("&amp;", text))
    return text + "`" if text.count("`") % 2 else text


def corpus_counts(comments: dict) -> dict:
    usable = usable_comments(comments)
    own = {cid: c for cid, c in comments.items() if c.get("own")}
    return {
        "per_repo": {
            repo: {
                "comments": sum(1 for c in usable.values() if c.get("repo") == repo),
                "prs": len(
                    {comment_key(c) for c in usable.values() if c.get("repo") == repo}
                ),
            }
            for repo in REPOS
        },
        "comentarios_totales": len(comments),
        "comentarios_utilizables": len(usable),
        "comentarios_propios": len(own),
        "prs_propias": len({comment_key(c) for c in own.values()}),
    }


def owned_of(pattern: dict) -> list:
    return [c for c in pattern.get("citations", []) if c.get("owner", True)]


def borrowed_of(pattern: dict) -> list:
    return [c for c in pattern.get("citations", []) if not c.get("owner", True)]


def location_label(citation: dict) -> str:
    if citation.get("path"):
        return f'`{citation["path"]}`'
    labels = {"reviews": "review", "issue_comments": "comentario de PR"}
    return labels.get(citation.get("kind"), "sin archivo")


def citation_line(citation: dict) -> str:
    return (
        f'- "{neutralize_markdown(citation.get("body", ""))}" — '
        f'PR #{citation.get("pr")} ({citation.get("repo", "?")}), {location_label(citation)}'
    )


def plural(count: int, singular: str, many: str) -> str:
    return f"{count} {singular if count == 1 else many}"


def confidence_line(pattern: dict, citations: list) -> str:
    grouped = defaultdict(set)
    for citation in citations:
        grouped[citation.get("repo", "?")].add(citation.get("pr"))
    chunks = [
        f"{', '.join(f'#{pr}' for pr in sorted(grouped[repo], key=str))} ({repo})"
        for repo in sorted(grouped)
        if grouped[repo]
    ]
    prs = plural(pattern.get("pr_count", 0), "PR distinta", "PRs distintas")
    confidence = pattern.get("confidence", "?")
    if not chunks:
        return f"**Confianza: {confidence} — {prs} (evidencia citada en otro archivo).**"
    return f"**Confianza: {confidence} — {prs}: {' · '.join(chunks)}.**"


def build_owner_index(patterns_by_layer: dict) -> dict:
    return {
        str(citation.get("comment_id")): (LAYER_FILES[layer], number)
        for layer, patterns in patterns_by_layer.items()
        for number, pattern in enumerate(patterns, start=1)
        for citation in owned_of(pattern)
    }


def secondary_evidence_note(pattern: dict, min_prs_per_repo: int) -> list[str]:
    by_repo = pattern.get("prs_per_repo") or {}
    weak = [
        repo
        for repo in REPOS
        if pattern.get("layer") != "core" and 0 < by_repo.get(repo, 0) < min_prs_per_repo
    ]
    if not weak:
        return []
    detail = " y ".join(
        f"{plural(by_repo[repo], 'PR', 'PRs')} de `{REPO_NAMES[repo]}`" for repo in weak
    )
    return [
        f"**Evidencia secundaria:** {detail} — no llega a las {min_prs_per_repo} PRs "
        "por repo que exige el nucleo, asi que el patron se queda en esta capa.",
        "",
    ]


def render_pattern(pattern: dict, number: int, owner_index: dict, min_prs_per_repo: int,
                   errors: list) -> str:
    mine = owned_of(pattern)
    lines = [
        f"## {number}. {pattern.get('title', pattern.get('key', 'sin titulo'))}",
        "",
        confidence_line(pattern, mine),
        "",
        pattern.get("statement", "").strip(),
        "",
        f"**Disparador en el diff:** {pattern.get('trigger', '').strip()}",
        "",
        f"**Que comentar:** {pattern.get('what_to_comment', '').strip()}",
        "",
    ]
    lines += secondary_evidence_note(pattern, min_prs_per_repo)
    lines += [citation_line(citation) for citation in mine]
    for citation in borrowed_of(pattern):
        owner = owner_index.get(str(citation.get("comment_id")))
        if owner is None:
            errors.append(
                f"[{pattern.get('key')}] referencia cruzada al comentario "
                f"{citation.get('comment_id')} que ningun patron tiene como dueno"
            )
            continue
        filename, owner_number = owner
        lines.append(
            f"- Referencia cruzada (no suma al conteo): ver `{filename}` §{owner_number}."
        )
    lines.append("")
    return "\n".join(lines)


def render_counts_block(counts: dict) -> list[str]:
    per_repo = counts["per_repo"]
    return [
        f"- **{repo}** (`{REPO_NAMES[repo]}`): "
        f"{plural(per_repo[repo]['comments'], 'comentario utilizable', 'comentarios utilizables')} "
        f"sobre {plural(per_repo[repo]['prs'], 'PR distinta', 'PRs distintas')}."
        for repo in REPOS
    ] + [
        f"- Excluidos {plural(counts['comentarios_propios'], 'comentario', 'comentarios')} de "
        f"{plural(counts['prs_propias'], 'PR escrita', 'PRs escritas')} por el propio reviewer: "
        "en su propia PR responde, no revisa, asi que no son evidencia de criterio de review."
    ]


def render_usage_section(dominant: str | None) -> str:
    lines = [
        "## Como usar este perfil",
        "",
        "1. Lee **siempre** este archivo (`PROFILE.md`).",
        "2. Suma **la especialidad del repo del diff**:",
        f"   - diff en `{REPO_NAMES['BE']}` → `{LAYER_FILES['backend']}`.",
        f"   - diff en `{REPO_NAMES['FE']}` → `{LAYER_FILES['frontend']}`.",
        "   - diff cross-repo → los dos.",
        "3. Un patron solo se emite si su **disparador esta presente en el diff**. "
        "Si el mismo criterio aparece en el nucleo y en la especialidad, el hallazgo "
        "se emite **desde la especialidad** y no se duplica.",
        "",
    ]
    if dominant:
        lines[2:3] = [
            "1. Este nucleo esta **vacio**: ningun patron reunio evidencia propia "
            "suficiente en los dos repos, asi que el criterio de este reviewer vive "
            f"entero en `{LAYER_FILES[dominant]}`. Leelo **siempre**, tambien cuando "
            "el diff sea del otro repo, y trata sus patrones como especificos de su "
            "stack antes de trasladarlos.",
        ]
    return "\n".join(lines)


def render_profile(layer: str, patterns: list, display: str, login: str, counts: dict,
                   owner_index: dict, thresholds: dict, min_prs_per_repo: int,
                   dominant: str | None, errors: list) -> str:
    header = [
        GENERATED_BANNER,
        "",
        f"# Perfil de review de `{login}` ({display}) — {LAYER_TITLES[layer]}",
        "",
        f"**Alcance.** {layer_scope(layer, min_prs_per_repo)}",
        "",
        "**Corpus del que sale todo lo de abajo** (contado sobre `comments.json`):",
        "",
        *render_counts_block(counts),
        "",
        confidence_rule(thresholds),
        "",
        CITATION_NOTATION,
        "",
        "---",
        "",
    ]
    if layer == "core":
        header += [render_usage_section(dominant), "---", ""]

    if not patterns:
        header += ["_Sin patrones en esta capa._", ""]
        return "\n".join(header)

    body = [
        render_pattern(pattern, number, owner_index, min_prs_per_repo, errors)
        for number, pattern in enumerate(patterns, start=1)
    ]
    return "\n".join(header) + "\n".join(body)


def phrase_matchers(entry: dict) -> list:
    phrases = [entry.get("phrase", "")] + list(entry.get("variants") or [])
    return [
        re.compile(rf"(?<!\w){re.escape(normalize(phrase))}(?!\w)")
        for phrase in phrases
        if phrase
    ]


def phrase_hits(entry: dict, comments: dict) -> dict:
    matchers = phrase_matchers(entry)
    matched = [
        comment
        for comment in comments.values()
        if any(matcher.search(normalize(comment.get("body", ""))) for matcher in matchers)
    ]
    return {
        repo: {
            "comments": sum(1 for c in matched if c.get("repo") == repo),
            "prs": len({comment_key(c) for c in matched if c.get("repo") == repo}),
        }
        for repo in REPOS
    }


def render_lexicon_entry(entry: dict, comments: dict, hits: dict, errors: list) -> str:
    counts = " · ".join(
        f"{repo} {hits[repo]['comments']}c/{hits[repo]['prs']}PR" for repo in REPOS
    )
    lines = [
        f"### `{entry.get('phrase', '')}`",
        "",
        f"**{counts}.** {entry.get('meaning', '').strip()}",
        "",
    ]
    variants = entry.get("variants") or []
    if variants:
        lines += [
            f"**Variantes contadas:** {', '.join(f'`{v}`' for v in variants)}.",
            "",
        ]
    lines += [f"**Cuando:** {entry.get('when', '').strip()}", ""]
    for comment_id in (entry.get("example_ids") or [])[:2]:
        comment = comments.get(str(comment_id))
        if comment is None:
            errors.append(
                f"[lexico: {entry.get('phrase')}] example_id {comment_id} no existe "
                "entre los comentarios utilizables"
            )
            continue
        lines.append(citation_line(comment))
    lines.append("")
    return "\n".join(lines)


def render_lexicon_section(entries: list, comments: dict, errors: list) -> tuple[str, list]:
    hits_by_entry = [phrase_hits(entry, comments) for entry in entries]
    header = [
        LEXICON_BEGIN,
        "",
        "## Lexico",
        "",
        "Seccion **generada**: los conteos los cuenta `scripts/render.py` sobre "
        "`comments.json`, no los declara nadie a mano. Criterio de conteo: la frase o "
        "cualquiera de sus variantes aparece como **palabra completa** en el body, "
        "normalizado a minusculas y sin tildes, **solo sobre comentarios utilizables** "
        "(se excluyen las PRs escritas por el propio reviewer). "
        "`Nc/NPR` = comentarios / PRs distintas.",
        "",
        "**Regla de uso:** una frase se usa solo cuando el hallazgo calza con su "
        "significado. Si ninguna calza, se escribe normal: forzar el lexico produce "
        "parodia, no voz.",
        "",
    ]
    body = [
        render_lexicon_entry(entry, comments, hits, errors)
        for entry, hits in zip(entries, hits_by_entry)
    ]
    section = "\n".join(header + body) + "\n" + LEXICON_END + "\n"
    summary = [
        {"phrase": entry.get("phrase"), "hits": hits}
        for entry, hits in zip(entries, hits_by_entry)
    ]
    return section, summary


def replace_lexicon_section(existing: str, section: str) -> str:
    if LEXICON_BEGIN in existing and LEXICON_END in existing:
        head, rest = existing.split(LEXICON_BEGIN, 1)
        _, tail = rest.split(LEXICON_END, 1)
        rest_of_file = tail.lstrip("\n")
        return head + section + ("\n" + rest_of_file if rest_of_file else "")
    heading = re.search(r"^## +L[eé]xico.*$", existing, flags=re.MULTILINE)
    if heading:
        after = existing[heading.end():]
        next_heading = re.search(r"^## ", after, flags=re.MULTILINE)
        cut = heading.end() + (next_heading.start() if next_heading else len(after))
        return existing[: heading.start()] + section + "\n" + existing[cut:]
    if not existing.strip():
        return section
    return existing.rstrip("\n") + "\n\n" + section


def digest_of(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def dominant_layer(patterns_by_layer: dict) -> str | None:
    """Cuando el nucleo queda vacio, que especialidad hay que leer siempre igual."""
    if patterns_by_layer["core"]:
        return None
    ranked = sorted(
        ("backend", "frontend"),
        key=lambda layer: (len(patterns_by_layer[layer]), layer == "backend"),
        reverse=True,
    )
    return ranked[0] if patterns_by_layer[ranked[0]] else None


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Renderiza PROFILE.md / PROFILE.backend.md / PROFILE.frontend.md (y la "
            "seccion Lexico de agent/VOICE.md si hay lexicon.json) desde "
            "patterns.resolved.json. Los archivos generados se sobrescriben completos."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Corre DESPUES de compute.py y validate.py: este script renderiza, no valida.\n"
            "\nejemplo:\n"
            "  python3 render.py ~/vambe/all_vambe/lucas_pr --display Lucas --login ljrodriguez1\n"
        ),
    )
    parser.add_argument("corpus_dir", type=Path, help="directorio del corpus del reviewer")
    parser.add_argument("--display", required=True, help="nombre visible del reviewer")
    parser.add_argument("--login", required=True, help="login de GitHub del reviewer")
    parser.add_argument(
        "--lexicon",
        type=Path,
        help="ruta alternativa de lexicon.json (default: <corpus_dir>/.pipeline/lexicon.json). "
        "La seccion Lexico se regenera siempre que el archivo exista",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    corpus_dir = args.corpus_dir.expanduser().resolve()
    if not corpus_dir.is_dir():
        die(f"{corpus_dir} no es un directorio")

    comments_path = pipeline_file(corpus_dir, "comments.json")
    resolved_path = pipeline_file(corpus_dir, "patterns.resolved.json")
    lexicon_path = (
        args.lexicon.expanduser().resolve()
        if args.lexicon
        else brain_file(corpus_dir, "lexicon.json")
    )
    print(f"leyendo  {resolved_path}")
    print(f"leyendo  {comments_path}")

    comments = {str(cid): c for cid, c in read_json(comments_path).items()}
    resolved = read_json(resolved_path)
    patterns = resolved.get("patterns", resolved if isinstance(resolved, list) else [])
    thresholds = {**DEFAULT_THRESHOLDS, **(resolved.get("thresholds") or {})}
    min_prs_per_repo = resolved.get("min_prs_per_repo", DEFAULT_MIN_PRS_PER_REPO)

    errors: list[str] = []
    counts = corpus_counts(comments)
    patterns_by_layer = {
        layer: [p for p in patterns if p.get("layer") == layer] for layer in LAYER_ORDER
    }
    orphan_layers = {
        str(p.get("layer")) for p in patterns if p.get("layer") not in LAYER_FILES
    }
    errors += [
        f"hay patrones con layer='{layer}', que no tiene archivo: correr compute.py"
        for layer in sorted(orphan_layers)
    ]
    owner_index = build_owner_index(patterns_by_layer)
    dominant = dominant_layer(patterns_by_layer)

    rendered = {
        corpus_dir / filename: render_profile(
            layer,
            patterns_by_layer[layer],
            args.display,
            args.login,
            counts,
            owner_index,
            thresholds,
            min_prs_per_repo,
            dominant,
            errors,
        )
        for layer, filename in LAYER_FILES.items()
    }
    stats = {
        "corpus": {key: value for key, value in counts.items() if key != "per_repo"},
        "per_repo": counts["per_repo"],
        "files": {
            LAYER_FILES[layer]: {
                "patrones": len(patterns_by_layer[layer]),
                "sha256": digest_of(rendered[corpus_dir / LAYER_FILES[layer]]),
            }
            for layer in LAYER_FILES
        },
    }

    voice_content = None
    if lexicon_path.is_file():
        entries = (read_json(lexicon_path) or {}).get("entries", [])
        section, lexicon_summary = render_lexicon_section(
            entries, usable_comments(comments), errors
        )
        voice_path = corpus_dir / VOICE_RELATIVE
        existing = (
            voice_path.read_text(encoding="utf-8").lstrip("\n")
            if voice_path.exists()
            else ""
        )
        voice_content = replace_lexicon_section(existing, section)
        stats["files"][VOICE_RELATIVE.as_posix()] = {
            "entradas_lexico": len(entries),
            "sha256": digest_of(section),
        }
        stats["lexicon"] = lexicon_summary
    else:
        voice_path = corpus_dir / VOICE_RELATIVE
        has_generated_section = (
            voice_path.exists()
            and LEXICON_BEGIN in voice_path.read_text(encoding="utf-8")
        )
        if has_generated_section:
            errors.append(
                f"{voice_path} tiene una seccion de lexico generada pero falta "
                f"{lexicon_path}: sus conteos quedarian congelados sobre una fuente que "
                "ya no existe. Restaura el lexicon.json o borra la seccion a mano"
            )

    if errors:
        print(f"\n{len(errors)} ERROR(ES), no se escribio nada:", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    for path, content in rendered.items():
        path.write_text(content, encoding="utf-8")
        print(f"escrito  {path}")
    if voice_content is not None:
        voice_path.parent.mkdir(parents=True, exist_ok=True)
        voice_path.write_text(voice_content, encoding="utf-8")
        print(f"escrito  {voice_path}  (seccion Lexico)")

    stats_path = pipeline_file(corpus_dir, "rendered_stats.json")
    stats_path.parent.mkdir(parents=True, exist_ok=True)
    stats_path.write_text(
        json.dumps(stats, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"escrito  {stats_path}")

    print()
    for layer, filename in LAYER_FILES.items():
        print(f"{filename:<22} {len(patterns_by_layer[layer])} patrones")
    if dominant:
        print(
            f"AVISO: el nucleo quedo vacio; PROFILE.md remite a {LAYER_FILES[dominant]}, "
            "que pasa a ser lectura obligatoria"
        )
    per_repo = counts["per_repo"]
    print(
        "corpus: "
        + " · ".join(
            f"{repo} {per_repo[repo]['comments']}c/{per_repo[repo]['prs']}PR" for repo in REPOS
        )
        + f" · {counts['comentarios_propios']} comentarios excluidos por autoria propia"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
