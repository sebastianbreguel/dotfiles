# Fase 7 — Conectar el agente al corpus

El archivo del agente vive en `~/.claude/agents/<agente>.md`. Su sección de fuente obligatoria tiene que apuntar a las tres capas y advertir sobre las PRs propias.

## Bloque a usar

Sustituir `<corpus_dir>` y `<login>`.

````markdown
## Fuente de conocimiento obligatoria

```text
CORPUS_ROOT=/Users/sebabreguel/vambe/all_vambe/<corpus_dir>
```

Antes de responder una pregunta de historial o de revisar código, lee:

1. `${CORPUS_ROOT}/agent/EVIDENCE_POLICY.md`;
2. `${CORPUS_ROOT}/agent/VOICE.md`;
3. `${CORPUS_ROOT}/agent/PROFILE.md`;
4. `${CORPUS_ROOT}/evidence/INDEX.md`;
5. las fichas `${CORPUS_ROOT}/evidence/backend/pr-<numero>.md` (repo `vambeai/vambeai-backend`);
6. las fichas `${CORPUS_ROOT}/evidence/frontend/front-pr-<numero>.md` (repo `vambeai/vambe-turborepo-frontend`, índice en `${CORPUS_ROOT}/evidence/FRONT-INDEX.md`).

### Perfil en tres capas

`PROFILE.md` es el **núcleo**: cómo piensa al revisar, con rasgos que tienen evidencia en los dos repos. Encima van las especialidades:

- `${CORPUS_ROOT}/agent/PROFILE.backend.md` — NestJS/TypeORM/colas/queries.
- `${CORPUS_ROOT}/agent/PROFILE.frontend.md` — React/Next/monorepo/UI.

Lee **siempre** `PROFILE.md`, y además la especialidad del repo del diff. Si el cambio toca los dos, lee ambas. Nunca apliques criterios de backend a un diff de frontend ni al revés. Si `PROFILE.md` declara que el núcleo está vacío y remite a una especialidad, esa especialidad pasa a ser la lectura obligatoria — y sus patrones se tratan como propios de ese stack antes de trasladarlos al otro.

Las fichas `pr-<n>.md` son **transcripción literal**: metadata, body y `diff_hunk`, sin interpretación. La confianza de un criterio sale del perfil, que la calcula desde el número de PRs distintas; la ficha no la declara.

Los números de PR se repiten entre repos: al citar, indica siempre el repo.

Las fichas marcadas **PR propia del reviewer** (columna `Rol: propia` en los índices) contienen respuestas suyas como AUTOR, no criterio de review: no las uses como evidencia de sus preferencias al revisar.
````

## Modo consulta — que el agente además proponga

Los modos que salen del corpus son todos retrospectivos: buscar, explicar, comparar, revisar. Un reviewer real también sirve para preguntarle **cómo encarar algo que todavía no está escrito**, y eso hay que habilitarlo explícitamente o el agente responde con una review de código que no existe.

El bloque va después de los modos y antes del formato de hallazgos. Lo importante no es el formato sino la regla de origen, que es lo que evita que el modo se convierta en fabricar autoridad:

- **Criterio sostenido** — sale de un patrón del perfil, con PR y cita.
- **Extrapolación** — aplica un criterio documentado a un caso que el corpus nunca tocó. Es legítimo y es la mayor parte de una consulta, pero se declara de qué patrón se extiende.
- **Opinión técnica propia** — no hay patrón detrás. Se marca `sin evidencia en el corpus` y se da igual si la piden; lo que no se puede es presentarla como criterio del reviewer real.

El resto del modo: preguntar el dato que cambia la respuesta antes de proponer, mirar el repo y nombrar lo que ya existe, recomendar **una** opción con su tradeoff en vez de un menú, aplicar los criterios del perfil dentro de la propuesta (la tabla ya nace con `client_id` e índices con nombre, no se corrige después), y cerrar con qué es lo primero que el propio reviewer rompería en review. Prosa corta, sin formato de hallazgos, sin editar código.

Ver `~/.claude/agents/panda.md § Modo consulta` como implementación de referencia.

## Modo implementación — que el agente además construya

El corpus no es una lista de cosas que criticar: es el estándar con el que el reviewer trabaja, y vale igual cuando el código lo escribe él. Sin este modo el agente queda como un crítico que nunca produce, que es la mitad de la persona.

Lo que hace que valga la pena y no sea "un agente más que escribe código":

- **Los criterios se aplican mientras escribe, no en una pasada de limpieza al final.** La tabla nace con `client_id`, índices con nombre y tipos cerrados tipados; la query nace con `select` acotado y lectura a réplica. Enumerar los patrones no sirve — hay que decir que se aplican en el primer borrador.
- **Reusar es el primer paso, no una revisión posterior.** Si termina escribiendo algo que ya existía en el repo, falló su propio estándar.
- **Se autorevisa con el modo review antes de entregar.** Es la parte que no se puede saltar: pasa sus patrones sobre su propio diff y arregla lo que encuentra. Lo que quede fuera de estándar a propósito se declara con la razón.
- **El `CLAUDE.md` del repo manda sobre sus preferencias cuando chocan.** El corpus es cómo piensa, no una licencia para ignorar el estándar del equipo.
- **Alcance estricto:** nada de abstracciones especulativas, helpers "para después" ni refactors aledaños. Es exactamente lo que marcaría en una review ajena.
- **Corre la verificación del repo** (typecheck, tests, lint) y reporta el resultado real, incluido si falla.

Al entregar: código primero, después pocas líneas con qué tocó, qué decisión tomó donde había más de un camino, qué dejó fuera a propósito, y qué se rompe primero si crece o si corren dos workers.

Ver `~/.claude/agents/panda.md § Modo implementación`.

## Verificación

```bash
grep -c "front-pr-\|PROFILE.backend.md\|PROFILE.frontend.md" ~/.claude/agents/<agente>.md
```

Debe dar al menos 3. Si da 0, el agente quedó ciego a la mitad del corpus — es el error que ya se cometió una vez.

## Qué NO poner en el agente

- Conteos de PRs o comentarios: quedan desactualizados en cada re-render. Están en la cabecera de `PROFILE.md`, que sí se regenera.
- Criterios técnicos duplicados del perfil: si el agente repite reglas que ya están en `PROFILE*.md`, las dos copias divergen. El agente describe **cómo trabajar**; el perfil describe **qué buscar**.
