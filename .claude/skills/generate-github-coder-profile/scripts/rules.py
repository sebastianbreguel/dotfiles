#!/usr/bin/env python3
"""Reglas compartidas del pipeline de perfiles de reviewer.

Todo lo que mas de un script necesita decidir vive aca, para que no existan dos
implementaciones de la misma regla que puedan divergir:

  - donde viven los artefactos              -> pipeline_dir / pipeline_file
  - de donde salen los umbrales             -> load_config / thresholds_of
  - como se calcula la confianza            -> expected_confidence
  - como se calcula la capa                 -> expected_layer
  - que identifica una PR distinta          -> comment_key (el par repo+numero)
  - que comentario es utilizable / citable  -> usable_comments / citable_comments

Este modulo no se ejecuta solo; lo importan make_index.py, compute.py,
render.py y validate.py. `python3 rules.py` imprime la configuracion efectiva
de un corpus, util para depurar de donde salio un umbral.

Uso:
    python3 rules.py <corpus_dir>
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

AGENT_DIRNAME = "agent"
EVIDENCE_DIRNAME = "evidence"
BRAIN_DIRNAME = "brain"
PIPELINE_DIRNAME = ".pipeline"

CONFIG_FILE = "profile_config.json"
COMMENTS_FILE = "comments.json"
PATTERNS_FILE = "patterns.json"
RESOLVED_FILE = "patterns.resolved.json"
LEXICON_FILE = "lexicon.json"
RENDERED_STATS_FILE = "rendered_stats.json"

BRAIN_ARTIFACTS = (PATTERNS_FILE, LEXICON_FILE, CONFIG_FILE)

PIPELINE_ARTIFACTS = (
    COMMENTS_FILE,
    RESOLVED_FILE,
    RENDERED_STATS_FILE,
)

SOURCE_FILE = {"BE": "SOURCE_ACTIVITY.json", "FE": "SOURCE_ACTIVITY.front.json"}
FICHA_PREFIX = {"BE": "pr-", "FE": "front-pr-"}
PROFILE_FILE = {
    "core": "PROFILE.md",
    "backend": "PROFILE.backend.md",
    "frontend": "PROFILE.frontend.md",
}
VOICE_FILE = "VOICE.md"

REPOS = ("BE", "FE")
REPO_NAMES = {"BE": "vambeai-backend", "FE": "vambe-turborepo-frontend"}
LAYER_BY_REPO = {"BE": "backend", "FE": "frontend"}
LAYER_ORDER = ("core", "backend", "frontend")
CONFIDENCE_ORDER = ("alta", "media", "baja")

DEFAULT_THRESHOLDS = {"alta": 3, "media": 2}
DEFAULT_MIN_PRS_PER_REPO = 2

LLM_FIELDS = ("key", "title", "statement", "trigger", "what_to_comment")
KEY_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def die(message: str, code: int = 2) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(code)


def _clean_dir(corpus: Path, dirname: str, artifacts) -> Path:
    """<corpus>/<dirname>, sin fallback: una copia suelta en la raiz aborta.

    El fallback silencioso a la raiz hacia que un artefacto viejo se mezclara con
    los nuevos y el diagnostico saliera mintiendo sobre que archivo leyo.
    """
    strays = [name for name in artifacts if (corpus / name).is_file()]
    if strays:
        die(
            f"estado ambiguo: {', '.join(strays)} estan sueltos en {corpus}. "
            f"Viven en {corpus / dirname}; borra los viejos de la raiz antes de seguir"
        )
    return corpus / dirname


def pipeline_dir(corpus: Path) -> Path:
    return _clean_dir(corpus, PIPELINE_DIRNAME, PIPELINE_ARTIFACTS)


def pipeline_file(corpus: Path, name: str) -> Path:
    return pipeline_dir(corpus) / name


def brain_dir(corpus: Path) -> Path:
    """Lo unico irreemplazable: la sintesis del LLM. Fuera de .pipeline a proposito."""
    return _clean_dir(corpus, BRAIN_DIRNAME, BRAIN_ARTIFACTS)


def brain_file(corpus: Path, name: str) -> Path:
    return brain_dir(corpus) / name


def agent_dir(corpus: Path) -> Path:
    """Lo que el agente lee en cada review: perfiles y reglas de comportamiento."""
    return corpus / AGENT_DIRNAME


def profile_path(corpus: Path, layer: str) -> Path:
    return agent_dir(corpus) / PROFILE_FILE[layer]


def voice_path(corpus: Path) -> Path:
    return agent_dir(corpus) / VOICE_FILE


def evidence_dir(corpus: Path, repo: str | None = None) -> Path:
    """Fichas por PR, separadas por repo. Solo se abren para citar."""
    base = corpus / EVIDENCE_DIRNAME
    return base if repo is None else base / LAYER_BY_REPO[repo]


def ficha_path(corpus: Path, repo: str, pr: int) -> Path:
    return evidence_dir(corpus, repo) / f"{FICHA_PREFIX[repo]}{pr}.md"


def source_path(corpus: Path, repo: str) -> Path:
    """La descarga cruda de GitHub: insumo del pipeline, nadie la lee directo."""
    return pipeline_dir(corpus) / SOURCE_FILE[repo]


def read_json(path: Path, required: bool = True):
    if not path.is_file():
        if required:
            die(f"no existe {path}")
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        die(f"{path} no es JSON valido: {exc}")


def load_config(corpus: Path) -> dict:
    config = read_json(brain_file(corpus, CONFIG_FILE), required=False) or {}
    if not isinstance(config, dict):
        die(f"{brain_file(corpus, CONFIG_FILE)} debe ser un objeto JSON")
    return config


def thresholds_of(config: dict) -> dict:
    return {**DEFAULT_THRESHOLDS, **(config.get("confidence_thresholds") or {})}


def min_prs_per_repo_of(config: dict) -> int:
    return int(config.get("min_prs_per_repo", DEFAULT_MIN_PRS_PER_REPO))


def expected_confidence(pr_count: int, thresholds: dict) -> str:
    if pr_count >= thresholds["alta"]:
        return "alta"
    if pr_count >= thresholds["media"]:
        return "media"
    return "baja"


def expected_layer(prs_per_repo: dict, min_prs_per_repo: int) -> str:
    """core solo si CADA repo llega al minimo de PRs distintas con evidencia propia.

    Una sola cita prestada del otro repo no convierte un patron en nucleo: eso
    declaraba 'forma de pensar' con evidencia 8/9 de un solo stack.
    """
    strong = {repo for repo in REPOS if prs_per_repo.get(repo, 0) >= min_prs_per_repo}
    if set(REPOS) <= strong:
        return "core"
    present = {repo: prs_per_repo.get(repo, 0) for repo in REPOS}
    dominant = max(REPOS, key=lambda repo: (present[repo], repo == "BE"))
    if present[dominant] == 0:
        return "desconocida"
    return LAYER_BY_REPO[dominant]


def comment_key(comment: dict) -> tuple:
    """Una PR distinta es el par (repo, numero): la #42 de BE no es la #42 de FE."""
    return (comment.get("repo"), comment.get("pr"))


def is_owned(citation: dict) -> bool:
    return bool(citation.get("owner", True))


def owned_citations(pattern: dict) -> list:
    return [c for c in pattern.get("citations", []) if is_owned(c)]


def borrowed_citations(pattern: dict) -> list:
    return [c for c in pattern.get("citations", []) if not is_owned(c)]


def usable_comments(comments: dict) -> dict:
    return {cid: c for cid, c in comments.items() if not c.get("own")}


def citable_comments(comments: dict) -> dict:
    """Los que make_index.py mostro en el digest: son los unicos que el LLM vio."""
    return {cid: c for cid, c in usable_comments(comments).items() if c.get("citable")}


def flatten(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "").replace("\r", " ")).strip()


def prs_per_repo(citations: list) -> dict:
    return {
        repo: len(
            {
                comment_key(citation)
                for citation in citations
                if citation.get("repo") == repo
            }
        )
        for repo in REPOS
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Imprime la configuracion efectiva del pipeline para un corpus: "
            "directorio de artefactos, umbrales de confianza y minimo de PRs por "
            "repo para que un patron sea nucleo."
        ),
        epilog="ejemplo: python3 rules.py ~/vambe/all_vambe/lucas_pr",
    )
    parser.add_argument("corpus_dir", type=Path, help="directorio del corpus del reviewer")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    corpus = args.corpus_dir.expanduser().resolve()
    if not corpus.is_dir():
        die(f"{corpus} no es un directorio")
    config = load_config(corpus)
    thresholds = thresholds_of(config)
    print(f"corpus            {corpus}")
    print(f"artefactos        {pipeline_dir(corpus)}")
    print(f"config            {brain_file(corpus, CONFIG_FILE)}"
          f"{'' if config else '  (no existe, se usan los defaults)'}")
    print(f"confianza alta    >= {thresholds['alta']} PRs distintas propias")
    print(f"confianza media   >= {thresholds['media']} PRs distintas propias")
    print(f"nucleo (core)     >= {min_prs_per_repo_of(config)} PRs distintas propias en CADA repo")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
