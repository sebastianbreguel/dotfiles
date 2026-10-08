# Contrato de datos

Los artefactos del pipeline y quién escribe cada campo. **Los derivados viven en `<corpus_dir>/.pipeline/`; `patterns.json` y `lexicon.json` en `<corpus_dir>/brain/`**, sin excepción y sin fallback: si un artefacto aparece suelto en la raíz del corpus, los scripts abortan con "estado ambiguo" en vez de adivinar cuál leer.

Los umbrales y las reglas derivadas viven en un solo módulo, `scripts/rules.py`, que importan `compute.py`, `render.py` y `validate.py`. `python3 scripts/rules.py <corpus_dir>` imprime la configuración efectiva.

## `comments.json` — la fuente única

Lo produce `make_index.py` desde `SOURCE_ACTIVITY{,.front}.json`. **Nadie más lo escribe.**

```json
{
  "BE:2507015676": {
    "pr": 4078,
    "repo": "BE",
    "kind": "review_comments",
    "own": false,
    "citable": true,
    "has_hunk": true,
    "path": "src/ai-contact/services/ai-contact-create-contact.service.ts",
    "line": 142,
    "body": "creo que el as no es necesario",
    "url": "https://github.com/vambeai/vambeai-backend/pull/4078#discussion_r2507015676",
    "created_at": "2026-03-11T14:22:03Z"
  }
}
```

**La clave lleva el repo adelante.** Los ids de GitHub se solapan entre repos y entre tipos de evento (`reviews`, `review_comments` e `issue_comments` son secuencias distintas). Sin prefijo, un comentario de FE pisa a uno de BE y el pipeline publica texto de otra PR sin un solo error en el camino.

| Campo | Significado |
|---|---|
| `own` | La PR la escribió el propio reviewer. Ahí responde como autor, no revisa: no es evidencia. |
| `citable` | `own=false` **y** cuerpo útil (no vacío, no solo imagen, no solo emoji, ≥8 caracteres). Es exactamente lo que el digest le mostró al LLM, y lo único que `compute.py` acepta como cita. |
| `has_hunk` | El comentario tiene `diff_hunk` en la ficha, para poder escribir un `trigger` mirando el código. |

Una PR distinta es el par **`(repo, pr)`**. La #42 de BE no es la #42 de FE, y los rangos se solapan de verdad.

## `patterns.BE.json` / `patterns.FE.json` — lo semántico, por repo

Los escribe el **LLM** en la fase 2, un agente por repo. Solo estos seis campos:

```json
{"patterns": [{
  "key": "reutilizar-antes-de-crear",
  "title": "Buscar antes de crear",
  "statement": "Antes de aceptar una abstracción nueva exige buscar la que ya existe.",
  "trigger": "Un helper o componente nuevo cuyo nombre o forma se parece a uno existente.",
  "what_to_comment": "Nombrar el candidato existente y pedir que lo reuse o justifique por qué no.",
  "comment_ids": ["BE:2507015676", "BE:2380303500"]
}]}
```

`key` en kebab-case, no vacía y única dentro del archivo.

## `merge_plan.json` — qué patrones son el mismo

Lo escribe el LLM en la fase 2b, leyendo **solo** los campos de texto de los dos archivos anteriores. Nunca ve ni menciona `comment_ids`.

```json
{"merges": [{
  "key": "reutilizar-antes-de-crear",
  "title": "Buscar antes de crear",
  "statement": "...", "trigger": "...", "what_to_comment": "...",
  "from": ["BE:reutilizar-antes-de-crear", "FE:no-duplicar-componentes"]
}]}
```

## `patterns.json` — la fuente de verdad

Lo produce `merge_patterns.py` uniendo los `comment_ids` de las keys fusionadas. Las keys que ningún merge menciona pasan tal cual; si la misma key existe en los dos repos sin estar fusionada, se renombra con prefijo (`be-`, `fe-`).

Misma forma que `patterns.{BE,FE}.json`. **Es el único archivo que se edita a mano** — la fase 4 corrige acá y vuelve a correr `compute.py`.

## `patterns.resolved.json` — lo derivado

Lo produce `compute.py`. Agrega campos, nunca modifica los del LLM:

```json
{
  "patterns": [{
    "key": "reutilizar-antes-de-crear",
    "title": "...", "statement": "...", "trigger": "...", "what_to_comment": "...",
    "layer": "core",
    "confidence": "alta",
    "pr_count": 3,
    "prs": [{"repo": "BE", "pr": 4078}, {"repo": "BE", "pr": 933}, {"repo": "FE", "pr": 6473}],
    "prs_per_repo": {"BE": 2, "FE": 1},
    "comment_ids": ["BE:2507015676"],
    "citations": [
      {"comment_id": "BE:2507015676", "pr": 4078, "repo": "BE", "kind": "review_comments",
       "path": "...", "body": "texto literal", "url": "...", "owner": true}
    ]
  }],
  "thresholds": {"alta": 3, "media": 2},
  "min_prs_per_repo": 2,
  "warnings": ["patron 'x': comment_id BE:24114 descartado, es de una PR del propio reviewer"]
}
```

Reglas, todas deterministas y **todas calculadas sobre las citas PROPIAS**:

| Campo | Regla |
|---|---|
| `confidence` | `alta` si ≥3 PRs distintas propias, `media` si ≥2, `baja` si menos |
| `layer` | `core` si las citas propias llegan a ≥2 PRs distintas en **cada** repo; si no, la capa del repo dominante |
| `owner` | `false` cuando la cita ya pertenece a otro patrón: entonces no suma a `confidence` ni a `layer` |

Desempate de dueño: gana el patrón con más PRs distintas; si empatan, la `key` alfabéticamente menor. No puede mirar la capa, porque la capa se calcula **después**, a partir de las citas que este reparto decide.

**`owner` vive en la cita y en ningún otro lado.** Un `owner` a nivel patrón es un error que `validate.py` reporta: dos ubicaciones para el mismo dato se leen distinto en cada script, y el mismo archivo pasa un chequeo y falla el otro.

Por qué el layer mira solo las citas propias: contar las prestadas dejaba patrones declarados "núcleo" cuya única evidencia del segundo repo la misma sección desmentía como referencia cruzada. Y por qué exige ≥2 PRs por repo: con reviewers 24:1 backend/frontend, una sola cita suelta del otro repo convertía en "forma de pensar" un patrón con evidencia 8/9 de un solo stack, y encima lo sacaba de la especialidad donde sí servía.

Los umbrales se pueden sobreescribir con `.pipeline/profile_config.json`:

```json
{"confidence_thresholds": {"alta": 4, "media": 2}, "min_prs_per_repo": 3}
```

`compute.py` estampa los umbrales que usó dentro de `patterns.resolved.json`, y `validate.py` falla si la config cambió después.

## `lexicon.json` — las frases

Lo escribe el LLM (frases, significado, ejemplos). **Los conteos los pone `render.py`**, contando la frase y sus variantes como **palabra completa** sobre `comments.json`.

```json
{"entries": [{
  "phrase": "esta raro",
  "variants": ["muy raroooo", "raro esto", "esta raro este"],
  "meaning": "algo no cierra o está mal explicado; NO significa 'está mal'",
  "when": "código que funciona pero cuya intención no se entiende",
  "example_ids": ["BE:2411496987", "FE:2683501531"]
}]}
```

El significado importa tanto como la frase. `esta raro` interpretado como "hay un bug" hace que el agente reporte hallazgos que el reviewer nunca reportó.

## `rendered_stats.json` — el recibo del render

Lo escribe `render.py`: los conteos que publicó y el `sha256` de cada archivo generado. `validate.py` lo usa para verificar los números y detectar ediciones a mano **sin volver a parsear el markdown**.

Esto no es un detalle de implementación. Como las citas se inyectan literales, el body de un comentario puede contener cualquier cosa que un regex confunda con una cabecera generada; verificar el `.md` parseándolo dio falsos positivos irreparables tres veces, porque la "declaración" falsa es evidencia citada y ninguna re-corrida la arregla.

## Qué se puede editar a mano

| Archivo | ¿Editable? |
|---|---|
| `patterns.json` | **Sí** — es el lugar donde se corrige cualquier cosa |
| `lexicon.json` | **Sí** |
| `profile_config.json` | **Sí** (y después re-correr `compute.py`) |
| `comments.json`, `patterns.resolved.json`, `rendered_stats.json` | No: derivados, se regeneran |
| `patterns.{BE,FE}.json`, `merge_plan.json` | Entradas de una fase ya pasada: editables, pero hay que re-correr `merge_patterns.py` |
| `PROFILE*.md`, sección de léxico de `VOICE.md` | **No**: se pierden en el próximo render, y `validate.py` lo detecta por hash |
| `agent/EVIDENCE_POLICY.md`, `MODES.md`, `OUTPUT_SCHEMA.md`, `EXAMPLES.md` | **Sí** — prosa a mano, fuera del pipeline |
