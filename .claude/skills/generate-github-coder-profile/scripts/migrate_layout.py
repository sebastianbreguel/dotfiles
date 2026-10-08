#!/usr/bin/env python3
"""Migra un corpus del layout plano al layout por carpetas.

Antes (todo suelto en la raiz):
    PROFILE*.md  pr-*.md  front-pr-*.md  INDEX.md  SKIPPED.md
    SOURCE_ACTIVITY*.json  agent/*.md  .pipeline/*

Despues:
    agent/      lo que el agente lee siempre (perfiles + reglas)
    evidence/   fichas por repo, se abren solo para citar
    brain/      patterns.json y lexicon.json: lo irreemplazable
    .pipeline/  derivados y descarga cruda: borrable entero

Uso: python3 migrate_layout.py <corpus_dir> [--dry-run] [--force]
"""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

import rules

ROOT_KEEP = {"README.md"}


def plan_moves(corpus: Path):
    """[(origen, destino)] sin tocar disco. Solo lo que existe y esta fuera de sitio."""
    moves = []

    for layer, name in rules.PROFILE_FILE.items():
        src = corpus / name
        if src.is_file():
            moves.append((src, rules.profile_path(corpus, layer)))

    for repo, prefix in rules.FICHA_PREFIX.items():
        other = rules.FICHA_PREFIX["BE"] if repo == "FE" else rules.FICHA_PREFIX["FE"]
        for src in sorted(corpus.glob(f"{prefix}*.md")):
            if repo == "BE" and src.name.startswith(other):
                continue
            moves.append((src, rules.evidence_dir(corpus, repo) / src.name))

    for name in ("INDEX.md", "SKIPPED.md", "FRONT-INDEX.md", "FRONT-SKIPPED.md"):
        src = corpus / name
        if src.is_file():
            moves.append((src, rules.evidence_dir(corpus) / name))

    for repo, name in rules.SOURCE_FILE.items():
        src = corpus / name
        if src.is_file():
            moves.append((src, corpus / rules.PIPELINE_DIRNAME / name))

    for name in rules.BRAIN_ARTIFACTS:
        for src in (corpus / rules.PIPELINE_DIRNAME / name, corpus / name):
            if src.is_file():
                moves.append((src, corpus / rules.BRAIN_DIRNAME / name))
                break

    return [(s, d) for s, d in moves if s.resolve() != d.resolve()]


def leftovers(corpus: Path):
    """Archivos sueltos en la raiz que el plan no cubre: hay que mirarlos a mano."""
    known = {rules.AGENT_DIRNAME, rules.EVIDENCE_DIRNAME, rules.BRAIN_DIRNAME, rules.PIPELINE_DIRNAME}
    return sorted(
        p.name
        for p in corpus.iterdir()
        if p.name not in known and p.name not in ROOT_KEEP and not p.name.startswith(".")
    )


def apply_moves(moves, dry_run: bool, force: bool) -> int:
    collisions = [d for _, d in moves if d.exists()]
    if collisions and not force:
        print(f"ERROR: {len(collisions)} destinos ya existen, p.ej. {collisions[0]}", file=sys.stderr)
        print("       usa --force para sobrescribir", file=sys.stderr)
        return 1

    for src, dst in moves:
        if dry_run:
            print(f"  {src.name} -> {dst.parent.name}/{dst.name}")
            continue
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dst))
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("corpus_dir")
    ap.add_argument("--dry-run", action="store_true", help="mostrar el plan sin mover nada")
    ap.add_argument("--force", action="store_true", help="sobrescribir destinos existentes")
    args = ap.parse_args()

    corpus = Path(args.corpus_dir).resolve()
    if not corpus.is_dir():
        print(f"ERROR: {corpus} no es un directorio", file=sys.stderr)
        return 2

    moves = plan_moves(corpus)
    if not moves:
        print(f"{corpus.name}: ya esta en el layout nuevo, nada que mover")
        return 0

    by_dest = {}
    for _, dst in moves:
        by_dest[dst.parent.name] = by_dest.get(dst.parent.name, 0) + 1
    print(f"{corpus.name}: {len(moves)} archivos a mover")
    for dest, n in sorted(by_dest.items()):
        print(f"  -> {dest}/  {n}")

    if args.dry_run:
        print("\nDetalle (primeros 15):")
        apply_moves(moves[:15], True, args.force)
        if len(moves) > 15:
            print(f"  ... y {len(moves) - 15} mas")
        return 0

    code = apply_moves(moves, False, args.force)
    if code:
        return code

    rest = leftovers(corpus)
    if rest:
        print(f"\nQuedan sueltos en la raiz (revisar a mano): {', '.join(rest)}")
    print(f"\nListo. Layout: agent/ evidence/ brain/ .pipeline/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
