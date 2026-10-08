---
name: generate-github-coder-profile
description: Construye o actualiza el corpus y el perfil técnico de un reviewer real a partir de sus comentarios en PRs de GitHub. Usar cuando se pida "crear el agente reviewer de X", "armar el perfil de X", "actualizar el corpus de X", "agregar el frontend al perfil de X", o "/generate-github-coder-profile <dir> <Nombre> <login>".
---

# Reviewer Profile

Pipeline para convertir los comentarios reales de un reviewer en un agente que revisa PRs con sus criterios, citando siempre evidencia literal.

## Principio no negociable

**`patterns.json` es la fuente de verdad; el markdown se renderiza desde ahí y nunca se parsea de vuelta.**

- El LLM **nunca escribe el texto de una cita** — devuelve `comment_ids`. Python inyecta el texto literal. Inventar una cita se vuelve imposible por construcción.
- El LLM **nunca declara confianza ni capa** — Python las calcula.
- El LLM **nunca cuenta** — Python cuenta.

Esto no es purismo. La primera versión se hizo al revés y costó 20 agentes / 3.6M tokens, con 226 hallazgos de los cuales **132 (58%) eran mecánicos**: 74 de confianza mal calculada, 28 de citas inventadas, 22 de duplicación. Además, tres intentos de verificar el markdown parseándolo dieron falsos positivos, porque la prosa tiene formas que ningún regex modela.

Regla práctica: **si un chequeo se puede escribir como código, no lo hace un agente.**

## Las tres capas del perfil

| Archivo | Qué contiene | Regla de entrada |
|---|---|---|
| `PROFILE.md` | Cómo piensa al revisar | ≥2 PRs propias en **cada** repo |
| `PROFILE.backend.md` | Patrones NestJS/TypeORM/colas/queries | Todo lo demás con evidencia BE dominante |
| `PROFILE.frontend.md` | Patrones React/Next/monorepo/UI | Todo lo demás con evidencia FE dominante |

La regla de doble evidencia es lo que evita las generalidades. Un rasgo que apareció en dos contextos técnicos distintos es forma de pensar; uno que solo aparece en un stack es conocimiento de ese stack.

**El mínimo por repo no es opcional.** Estos reviewers son 24:1 backend/frontend (rafael: 661 comentarios citables BE contra 27 FE). Con "≥1 cita de cada repo", un patrón con 8 citas BE y un comentario FE suelto se declaraba núcleo — y salía de `PROFILE.backend.md`, o sea que la especialidad perdía el patrón cuya evidencia era 8/9 suya. Las citas del repo flaco que no llegan al mínimo se publican igual, como **evidencia secundaria** dentro de la capa dominante.

Con reviewers muy especializados el núcleo queda chico (6-8 rasgos). Eso es correcto, no un defecto. Si queda **vacío**, `render.py` lo dice y `PROFILE.md` remite a la especialidad dominante como lectura obligatoria, en vez de dejar en blanco el archivo que el agente lee siempre.

## Layout del corpus

Las carpetas separan **quién usa cada cosa** y **si se puede regenerar**:

```
<corpus_dir>/
├── agent/          el agente lee esto en CADA review
│   ├── PROFILE.md · PROFILE.backend.md · PROFILE.frontend.md   qué buscar
│   └── VOICE.md · EVIDENCE_POLICY.md · MODES.md · OUTPUT_SCHEMA.md · EXAMPLES.md
├── evidence/       lo abre solo para citar
│   ├── INDEX.md · SKIPPED.md · FRONT-INDEX.md · FRONT-SKIPPED.md
│   ├── backend/pr-<n>.md
│   └── frontend/front-pr-<n>.md
├── brain/          IRREEMPLAZABLE: patterns.json · lexicon.json · profile_config.json
└── .pipeline/      borrable entero: SOURCE_ACTIVITY*.json · comments.json · digests · derivados
```

**La regla:** `.pipeline/` y `evidence/` se regeneran (segundos, u horas si además borras la descarga).
`agent/` y `brain/` son lo que hay que cuidar: juntos pesan ~290 KB.

`brain/` esta fuera de `.pipeline/` a proposito. `patterns.json` es la unica cosa que no se puede
volver a generar sin rehacer todo el analisis del LLM; dentro de una carpeta que se lee como
"temporal" invitaba a borrarlo.

Migrar un corpus del layout plano viejo: `uv run python scripts/migrate_layout.py <corpus_dir> [--dry-run]`.

## Fases

Ejecutar en orden. Las de Python son deterministas y se pueden repetir sin costo.

### Fase 0 — Bajar el corpus (Python)

```bash
uv run python scripts/build_corpus.py <corpus_dir> "<Nombre>" <login>
uv run python scripts/build_corpus.py <corpus_dir> "<Nombre>" <login> \
  --repo vambeai/vambe-turborepo-frontend --prefix front-
```

Baja de GitHub las PRs donde el reviewer participó y escribe fichas, índices y `SOURCE_ACTIVITY{,.front}.json`. Reanuda desde el JSON si se corta y espera solo si pega rate limit. Marca las PRs escritas por el propio reviewer.

Las fichas son **transcripción literal**: metadata + body + `diff_hunk`, sin tema ni práctica ni confianza. La confianza sale de `compute.py` (número de PRs distintas) y de ningún otro lado; una segunda confianza estimada por keywords en la ficha le daba al agente dos respuestas contradictorias para la misma pregunta.

**Actualizar un corpus** = correr el mismo comando: se rebajan solo las PRs cuyo `updated_at` cambió, así entran los comentarios nuevos en PRs ya conocidas. `--refetch` fuerza el rebuild completo.

Lento (~10 PRs/min, son cientos): lanzarlo en background y avisar al usuario del tiempo estimado.

### Fase 1 — Índice y digests (Python)

```bash
uv run python scripts/make_index.py <corpus_dir> <login>
```

Produce `.pipeline/comments.json` (fuente única, indexada por `<REPO>:<comment_id>`) y `digest_BE.md` / `digest_FE.md`, que son lo único que leen los agentes de la fase 2. Excluye las PRs propias del reviewer.

### Fase 2 — Extraer patrones (agentes)

Un agente por repo, en paralelo. Prompt en `references/extract-prompt.md`, schema en `references/schema.md`.

Escriben `.pipeline/patterns.BE.json` y `.pipeline/patterns.FE.json` con `{key, title, statement, trigger, what_to_comment, comment_ids[]}` — **sin texto de citas, sin confianza, sin capa**.

Un tercer agente en paralelo produce `lexicon.json` (frases, significado, ids de ejemplo — sin conteos).

### Fase 2b — Fusionar los dos repos (agente + Python)

```bash
uv run python scripts/merge_patterns.py <corpus_dir>
```

Un agente lee **solo el texto** de los dos archivos (nunca los `comment_ids`) y escribe `merge_plan.json` diciendo qué patrón de BE y cuál de FE son el mismo criterio. El script une los ids bajo la key fusionada y produce el `patterns.json` único.

**Sin este paso el núcleo es inalcanzable**: `core` exige ids de los dos repos en el mismo patrón, y ningún agente de la fase 2 ve los dos digests. Concatenar a mano tampoco sirve — los dos agentes producen keys idénticas y `compute.py` aborta.

### Fase 3 — Resolver (Python)

```bash
uv run python scripts/compute.py <corpus_dir>
uv run python scripts/validate.py <corpus_dir>
```

Calcula capa, confianza y dueño único de cada cita; descarta ids de PRs propias; falla ruidosamente si un id no existe o si el digest nunca se lo mostró al LLM. Ante cualquier error no escribe nada.

### Fase 4 — Redactar (agente)

Solo si `validate.py` pasa. El agente lee las citas literales en `patterns.resolved.json` y pule `statement` / `trigger` / `what_to_comment` **editando `patterns.json`**, nunca el resuelto: ese es derivado y la próxima corrida de `compute.py` lo sobrescribe entero. `validate.py` compara los campos semánticos entre los dos archivos. Prompt en `references/write-prompt.md`.

### Fase 5 — Renderizar (Python)

```bash
uv run python scripts/compute.py <corpus_dir>
uv run python scripts/validate.py <corpus_dir>
uv run python scripts/render.py <corpus_dir> --display "<Nombre>" --login <login>
uv run python scripts/validate.py <corpus_dir> --strict
```

El orden es **compute → validate → render**: `render.py` renderiza y no valida. Toma `lexicon.json` de `brain/` sin flag y regenera siempre la sección de léxico de `agent/VOICE.md`, para que sus conteos no sobrevivan a su fuente.

Escribe los tres `PROFILE*.md` y `rendered_stats.json` (conteos + hash de lo escrito). **Son artefactos derivados: no editarlos a mano**, se pierden en el próximo render y `validate.py` lo detecta por hash. Para cambiar algo, cambiar `patterns.json` y re-renderizar.

### Fase 6 — Juicio (agentes, una ronda)

Solo dos lentes, porque el resto ya lo cubre el código:

- **evidence-policy**: ¿la cita sostiene lo que la sección afirma, o el título promete más de lo que la cita dice?
- **tech-lead**: ¿el rasgo es accionable en un diff real, o es un estado subjetivo del lector?

Sus hallazgos se aplican **editando `patterns.json`** y re-renderizando, nunca tocando el markdown.

### Fase 7 — Conectar el agente

La fuente del rol se mantiene en `~/.claude/agents/<agente>/<agente>.md` (o en el archivo existente de ese rol), también cuando se trabaja desde Codex. Después de actualizarla, refrescar su TOML con el skill oficial `~/.codex/skills/migrate-to-codex/SKILL.md`: preparar una fuente temporal que incluya ese rol aunque esté en una subcarpeta, convertir en un destino temporal sin enlaces, revisar y promover solo su TOML. Nunca ejecutar la migración directamente sobre HOME. No editar solo el TOML de Codex; no hay sincronización automática de roles.

La sección de fuente obligatoria debe listar: `EVIDENCE_POLICY.md`, `VOICE.md`, `PROFILE.md`, el índice, las fichas `pr-*.md` y `front-pr-*.md`, y **la especialidad según el repo del diff**. Ver `references/agent-wiring.md`.

## Cosas que ya pasaron y hay que prever

**Comentarios que no escribió el reviewer.** Aparecen fichas con salida de una herramienta de review AI posteada bajo su cuenta: headers `**Bug**:`, bloques ` ```suggestion `, inglés gramaticalmente correcto con "Consider ...". Incompatibles con su forma real. Descartar la ficha completa y anotarla en `SKIPPED.md`. Regla en `agent/EVIDENCE_POLICY.md § Descarte por autoría`.

**PRs propias del reviewer.** En mario y coloro son ~27% de las fichas. Sus comentarios ahí son respuestas como autor ("de acuerdo, lo dejo para otra PR"), no criterio de review. `make_index.py` las excluye; verificar que el conteo utilizable baje.

**Los números de PR se repiten entre repos, y los comment_id también.** Una cita de frontend enlazada al repo de backend apunta a otra PR real y distinta. Por eso la clave del índice es `<REPO>:<comment_id>` y una PR distinta es el par `(repo, pr)` en todo el pipeline. Toda cita lleva sufijo `(BE)` o `(FE)`.

**Los bodies traen HTML y fences.** Hay citas con `<Link />`, con pixeles de tracking `<img src=...>` y con bloques ```` ``` ````. `render.py` los neutraliza antes de publicarlos: el texto visible queda idéntico pero el markdown no se lo come ni dispara una request remota desde el perfil.

**Nunca verificar el markdown parseándolo.** Se intentó tres veces y las tres dieron falsos positivos. Como las citas se inyectan literales, un comentario del corpus puede contener lo que sea que el regex busque — incluido un bloque de stats falso. La verificación va contra `rendered_stats.json` y hashes, nunca contra la prosa.

**El corpus vive fuera de git.** Ya se perdió una vez. Si se pierde, se regenera con la fase 0; lo único irrecuperable es la prosa escrita a mano.
