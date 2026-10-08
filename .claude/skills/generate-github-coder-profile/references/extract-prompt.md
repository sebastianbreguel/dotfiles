# Fase 2 — Prompt de extracción

Un agente por repo, en paralelo. Sustituir `{DIGEST}`, `{REPO}`, `{LOGIN}`, `{OUT}`.

`{OUT}` es `.pipeline/patterns.BE.json` o `.pipeline/patterns.FE.json` según el repo — **nunca `patterns.json`**, que es lo que produce la fase 2b fusionando los dos.

---

Lee `{DIGEST}` completo. Son todos los comentarios que `{LOGIN}` dejó **como reviewer** en PRs de `{REPO}`. Cada línea tiene la forma:

```
[id=BE:2507015676 C src/ai-contact/services/ai-contact-create.service.ts] creo que el as no es necesario
[id=FE:2380303500 C hunk=1 TRUNCADO apps/mercur/src/components/kanban/board.tsx] ...
```

`id` es la clave del comentario e **incluye el repo**: copialo entero (`BE:2507015676`), no solo el número. Los ids de GitHub se repiten entre repos; sin el prefijo el pipeline resolvería la cita contra otra PR real y distinta.

Banderas de la línea:

- `R` = review general, `C` = comentario inline, `F` = seguimiento, `I` = issue comment.
- `hunk=1`: el comentario tiene `diff_hunk`.
- `TRUNCADO`: el body se cortó a 600 caracteres.

## Tu tarea

Agrupar esos comentarios en **patrones técnicos de review**: criterios que el reviewer aplica de forma repetida.

Devolvé JSON con este schema exacto:

```json
{"patterns": [{
  "key": "reutilizar-antes-de-crear",
  "title": "Buscar antes de crear",
  "statement": "Antes de aceptar una abstracción nueva exige buscar la que ya existe en el repo.",
  "trigger": "Un helper, servicio o componente nuevo cuyo nombre o forma se parece a uno existente.",
  "what_to_comment": "Nombrar el candidato existente y pedir que lo reuse o justifique por qué no sirve.",
  "comment_ids": ["BE:2507015676", "BE:2380303500"]
}]}
```

`key` en kebab-case y estable entre corridas: es lo que permite re-generar sin perder el trabajo de redacción.

## Reglas duras

**No escribas el texto de ningún comentario.** Solo ids. El texto lo inyecta el pipeline desde la fuente. Si copiás texto, lo estás re-tipeando y vas a introducir errores; además se descarta.

**No declares confianza, ni capa, ni cuentes PRs.** Eso lo calcula el código a partir de los ids.

**No inventes ids.** El código valida cada id contra `comments.json` y falla si no existe o si el digest no te lo mostró.

**Abrí la ficha antes de usar un `TRUNCADO`.** No conviertas en patrón un comentario truncado sin leer su body completo en `pr-<n>.md` / `front-pr-<n>.md` (el número de PR está en el encabezado de sección del digest). Lo que citás después se publica entero, incluida la parte que no viste.

**Para escribir un `trigger`, leé el hunk.** Si la línea trae `hunk=1`, el `diff_hunk` está en la ficha de esa PR. Un disparador inventado sin ver el código es el campo del que depende que el hallazgo se emita o no.

**Un patrón necesita al menos 2 comentarios**, salvo que uno solo traiga una razón técnica desarrollada (varias frases explicando el porqué). Los patrones de un solo comentario breve no entran.

**Descartá lo social.** `LGTM`, emojis, `same`, `clean af`, apelativos, respuestas de coordinación. No son criterio técnico.

**Los comentarios marcados `HERRAMIENTA` SÍ se usan.** Los redactó su herramienta de review, pero él los leyó y eligió postearlos bajo su cuenta: **el criterio está avalado**. Citalos como cualquier otro. Lo único que no podés hacer es tratarlos como su forma de hablar — de eso se ocupa el agente del léxico, que los tiene prohibidos.

No los clasifiques vos: la marca viene calculada en el digest. Si un comentario no la trae, tratalo como suyo aunque te parezca sospechoso.

Un patrón sostenido **solo** por comentarios `HERRAMIENTA` es más débil que uno con evidencia propia, pero entra igual: el código lo marca al calcular la confianza. No lo descartes por eso.

Distinto es cuando él mismo rotula que está pegando salida de un modelo ("opinion de GPT Corta: ...", "COPY TO CLAUDE: ..."): ahí el texto es material de consulta que trajo a la discusión, no un criterio que él esté sosteniendo. Ese no cuenta.

## Qué hace bueno a un patrón

`statement` dice **qué exige**, no qué le gusta: "exige que el `WHERE` declare qué filas deja afuera", no "le importa la calidad de las queries".

`trigger` es **observable en un diff**, sin conocer al autor ni el contexto del producto: "un `useEffect` cuyo cuerpo solo copia una prop a un estado" sirve; "cuando el código es confuso" no sirve, porque depende de quién lee.

`what_to_comment` es **la acción mínima** que el reviewer pediría, no un ensayo.

## Cobertura

**Objetivo: al menos el 70 % de los comentarios citables del digest tiene que quedar dentro de algún patrón.** `validate.py` falla por debajo de ese umbral, así que un trabajo con cobertura baja hay que rehacerlo entero.

Antes de dar por terminado, contá tus ids y comparalos con el total del encabezado del digest. Si te quedaste corto, el problema casi siempre es que agrupaste de menos: volvé sobre los comentarios sin usar y buscá el criterio que comparten, en vez de descartarlos de a uno.

Lo que legítimamente queda fuera es lo social (`LGTM`, elogios, emojis, coordinación) y el nit único sin criterio generalizable. Si eso te da más del 30 % del digest, revisá: probablemente estés tirando criterio real.

Al terminar, decí qué temas viste que **no** convertiste en patrón y por qué (poca evidencia, demasiado específicos de una PR, ambiguos), y reportá tu cobertura como fracción.

Escribí el resultado en `{OUT}`.

---

# Fase 2b — Prompt de fusión

Corre **una sola vez**, después de que terminen los dos agentes de la fase 2. Sustituir `{BE}`, `{FE}`, `{PLAN}` (`.pipeline/merge_plan.json`).

---

Abrí `{BE}` y `{FE}`. Son los patrones que dos agentes extrajeron por separado, uno por repo. Ninguno vio el digest del otro.

## Por qué existe este paso

La capa `core` del perfil — el archivo que el agente reviewer lee **siempre** — exige que un mismo patrón tenga evidencia propia en los dos repos. Como ningún agente de la fase 2 ve los dos digests, sin esta fusión `PROFILE.md` sale vacío por construcción. Y concatenar los archivos a mano tampoco sirve: los dos agentes producen keys idénticas de forma natural (`reutilizar-antes-de-crear`) y `compute.py` aborta con "key duplicada".

## Tu tarea

Decidir qué patrón de BE y qué patrón de FE son **el mismo criterio expresado en dos stacks**, y escribir el texto unificado.

Leé **solo** `key`, `title`, `statement`, `trigger` y `what_to_comment`. Ignorá `comment_ids`: no los copies, no los cuentes, no los menciones. El script los une solo.

Devolvé JSON en `{PLAN}`:

```json
{"merges": [{
  "key": "reutilizar-antes-de-crear",
  "title": "Buscar antes de crear",
  "statement": "Antes de aceptar una abstracción nueva exige buscar la que ya existe.",
  "trigger": "Un helper, servicio o componente nuevo cuyo nombre o forma se parece a uno existente.",
  "what_to_comment": "Nombrar el candidato existente y pedir que lo reuse o justifique por qué no.",
  "from": ["BE:reutilizar-antes-de-crear", "FE:no-duplicar-componentes"]
}]}
```

`from` lleva las keys de origen calificadas con el repo. Los patrones que ningún merge menciona pasan al `patterns.json` final tal cual.

## Criterio de fusión

**Fusioná el criterio, no el tema.** "Pide tests" en BE y "pide tests" en FE es el mismo criterio: fusionar. "Cuida las queries" en BE y "cuida los re-renders" en FE son dos aplicaciones de "le importa el costo", pero el disparador y la acción son distintos en cada repo: **no fusionar**, dejarlos separados en su especialidad.

La pregunta es: ¿el `trigger` y el `what_to_comment` unificados siguen siendo accionables en los dos repos sin volverse vagos? Si al unirlos te queda "cuidar el rendimiento", fusionaste de más.

**El texto unificado no puede ser más amplio que la unión de los dos originales.** Si para que entren los dos tenés que subir el nivel de abstracción, no eran el mismo patrón.

Fusionar de más es peor que fusionar de menos: un patrón `core` inflado se lee **siempre**, en todos los diffs, y produce hallazgos genéricos en los dos repos.

Al terminar, ejecutá `python3 scripts/merge_patterns.py <corpus_dir>` y resumí qué fusionaste, qué dejaste separado y por qué.
