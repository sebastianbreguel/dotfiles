#!/usr/bin/env python3
"""Distingue lo que el reviewer TIPEO de lo que posteo una herramienta de review AI.

Los reviewers corren una herramienta de review y postean su salida bajo su propia
cuenta, despues de leerla. Eso significa dos cosas a la vez:

  - el CRITERIO esta avalado: eligieron postearlo, sirve como evidencia de patron
  - la VOZ no es suya: no puede alimentar el lexicon ni citarse como "asi habla"

Por eso la clasificacion no es "descartar si/no" sino un tercer estado: `authored`.
Antes esto lo decidia el agente de la fase 2 leyendo prosa, y el resultado era
salvaje: un agente descarto 110 comentarios y otro 1, sobre corpus comparables.

Uso:
    python3 authorship.py <corpus_dir>     imprime el conteo y ejemplos
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

# Un header de categoria en negrita abriendo el comentario. La herramienta abre
# asi practicamente siempre; el reviewer real nunca escribe negritas.
OPENING_BOLD = re.compile(r"^\s*(?:#{1,4}\s*)?\*\*[^*\n]{3,90}\*\*", re.M)

CATEGORY_WORD = re.compile(
    r"\b(bug|type safety|behavioral|behaviour|critical|important|major|minor|"
    r"severity|impact|correctness|reliability|security|performance|concern|"
    r"risk|blocker|bloqueante|issue|finding|observation)\b", re.I)

SUGGESTION_BLOCK = re.compile(r"```\s*suggestion", re.I)

REPORT_HEADING = re.compile(
    r"^\s{0,3}#{1,4}\s*\W{0,3}\s*(review|code review|summary|findings|analysis|"
    r"resumen|hallazgos)\b", re.I | re.M)

TOOLING_PHRASE = re.compile(
    r"(\bconsider\s+(?:using|adding|extracting|moving|renaming|making)\b|"
    r"\bper\s+(?:CLAUDE\.md|the project)\b|\brecommendation:|\bsuggested fix\b|"
    r"\bthis (?:is|would be) (?:more )?(?:fragile|robust|safer|brittle)\b|"
    r"\bwhy this matters\b|\bproposed change\b)", re.I)

# El idioma se decide por proporcion de palabras funcionales, no por presencia de
# una sola: "Me surge la duda de si funciona tener el find one dentro de la
# transaction" tiene mitad de terminos tecnicos en ingles y es espanol.
ES_STOPWORDS = {
    "que", "qué", "de", "la", "el", "en", "y", "no", "es", "un", "una", "los",
    "las", "se", "lo", "al", "del", "por", "con", "sin", "para", "como", "cómo",
    "pero", "porque", "esto", "esta", "está", "este", "ese", "eso", "aca", "acá",
    "aqui", "aquí", "hay", "creo", "mejor", "seria", "sería", "deberia",
    "debería", "falta", "sacar", "poner", "usar", "ojo", "igual", "nomas",
    "nomás", "cuando", "donde", "dónde", "todo", "nada", "algo", "hacer",
    "tiene", "puede", "vamos", "mas", "más", "muy", "ya", "si", "sí", "le",
    "me", "te", "nos", "su", "sus", "mi", "yo", "duda", "queda", "quedar",
}
EN_STOPWORDS = {
    "the", "is", "are", "this", "that", "it", "of", "to", "and", "in", "for",
    "with", "but", "not", "you", "we", "be", "will", "would", "should", "can",
    "when", "which", "there", "their", "they", "from", "on", "at", "as", "if",
    "so", "does", "do", "has", "have", "was", "were", "been", "here", "then",
}

CODE_FENCE = re.compile(r"```.*?```", re.S)
INLINE_CODE = re.compile(r"`[^`]*`")
URL = re.compile(r"https?://\S+")
CODEY = re.compile(r"[{}()\[\];=<>|&]")
WORD = re.compile(r"[a-záéíóúñü]+", re.I)


def prose_of(body: str) -> str:
    """El texto sin codigo ni urls: el idioma se juzga sobre la prosa, no sobre identificadores."""
    stripped = URL.sub(" ", INLINE_CODE.sub(" ", CODE_FENCE.sub(" ", body)))
    lines = [
        line for line in stripped.splitlines()
        if len(CODEY.findall(line)) < 3  # una linea llena de simbolos es codigo pegado
    ]
    return re.sub(r"\s+", " ", " ".join(lines)).strip()


def looks_english(prose: str) -> bool:
    """Ingles si sus palabras funcionales superan a las espanolas por margen claro."""
    words = [w.lower() for w in WORD.findall(prose)]
    if len(words) < 25:
        return False
    es = sum(1 for w in words if w in ES_STOPWORDS)
    en = sum(1 for w in words if w in EN_STOPWORDS)
    return en >= 4 and en > es * 2


def looks_english_short(prose: str) -> bool:
    """Ingles breve: sirve como senal secundaria, nunca sola.

    Los hilos de la herramienta encadenan seguimientos cortos en ingles ("Same
    parameter collision here"), demasiado breves para el conteo de arriba.
    """
    words = [w.lower() for w in WORD.findall(prose)]
    if not 8 <= len(words) < 25:
        return False
    es = sum(1 for w in words if w in ES_STOPWORDS)
    en = sum(1 for w in words if w in EN_STOPWORDS)
    return es == 0 and en >= 2


def signals(body: str) -> list[str]:
    prose = prose_of(body)
    words = len(prose.split())
    found = []

    if SUGGESTION_BLOCK.search(body):
        found.append("bloque-suggestion")
    if REPORT_HEADING.search(body):
        found.append("encabezado-reporte")

    opening = OPENING_BOLD.search(body)
    if opening:
        found.append("abre-en-negrita")
        # El formato de reporte es "**Titulo: cosa**" o un titulo en negrita
        # seguido de la explicacion. Estos reviewers escriben "borrar log", no
        # parrafos titulados; la herramienta tambien lo hace en espanol.
        if CATEGORY_WORD.search(opening.group(0)) or ":" in opening.group(0) or words >= 25:
            found.append("header-de-categoria")
    if TOOLING_PHRASE.search(prose):
        found.append("formula-de-tooling")
    if looks_english(prose):
        found.append("ingles-corrido")
    elif looks_english_short(prose):
        found.append("ingles-corto")
    if words >= 90:
        found.append("informe-largo")

    return found


# Una sola de estas basta: ningun reviewer de este equipo escribe asi a mano.
# `bloque-suggestion` NO esta aca: GitHub tiene un boton de sugerencia que los
# humanos usan, y por si solo marcaba comentarios de una linea en espanol.
DECISIVE = {"encabezado-reporte", "header-de-categoria", "ingles-corrido"}


def is_tool_output(body: str) -> tuple[bool, list[str]]:
    """(es salida de herramienta, senales). El criterio sigue avalado; la voz no es suya."""
    found = signals(body)
    hit = bool(DECISIVE & set(found)) or len(found) >= 2
    return hit, found


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("corpus_dir", type=Path)
    parser.add_argument("--show", type=int, default=6, help="cuantos ejemplos de cada lado imprimir")
    args = parser.parse_args()

    path = args.corpus_dir.expanduser().resolve() / ".pipeline" / "comments.json"
    if not path.is_file():
        print(f"ERROR: no existe {path}", file=sys.stderr)
        return 2

    comments = json.loads(path.read_text(encoding="utf-8"))
    citable = {k: v for k, v in comments.items() if v.get("citable")}
    tool, own = [], []
    for cid, comment in citable.items():
        hit, found = is_tool_output(comment.get("body") or "")
        (tool if hit else own).append((cid, comment, found))

    total = len(citable)
    print(f"citables {total} | herramienta {len(tool)} ({100*len(tool)/max(1,total):.1f}%) | propios {len(own)}")
    print("\n--- clasificados como HERRAMIENTA (criterio avalado, voz ajena)")
    for cid, comment, found in tool[: args.show]:
        print(f"  [{','.join(found)}] {prose_of(comment['body'])[:100]}")
    print("\n--- clasificados como PROPIOS")
    for cid, comment, found in own[: args.show]:
        print(f"  {prose_of(comment['body'])[:100]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
