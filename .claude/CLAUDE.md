# Response Style

- Concise. Drop filler/hedging. Tech terms exact. Code blocks unchanged.
- Artifacts y links: abrir siempre en Brave (`open -a "Brave Browser" <url>`), nunca con `Artifact open` ni en cmux.

# Audience: Junior Software Engineer

- User = junior SWE. Hablar en términos que un junior entendería.
- Jerga avanzada (CQRS, expand/contract, idempotency, eventual consistency, RLS, partitioned unique constraint, NOT VALID/VALIDATE, bitemporal, materialized view, etc.) → primera mención = breve glosa inline ("expand/contract = agregar cols nuevas sin tocar viejas, después borrar"). Re-uso posterior OK sin glosa.
- Patrones: dar nombre + 1-line qué hace + cuándo usar. No asumir conocimiento previo.
- Explicar **por qué** + tradeoff, no solo qué, en proporción a la pregunta: pregunta simple → 2-4 líneas y ofrecer profundizar. Junior aprende razonamiento.
- Cuando pida decisión: ofrecer 2-3 opciones con pros/cons en lenguaje claro. Recomendar una.
- SQL/migrations/Alembic/async/pgvector/asyncpg: mostrar código exacto + comentar líneas no-obvias.
- Explicaciones (flujos, arquitectura, cómo se conectan piezas, antes/después): siempre que se pueda, incluir un diagrama en el chat en ASCII/box-drawing dentro de un code block. Nunca Mermaid.
- Si user dice "no entendí X" o "explicame más" → bajar a fundamentos con otro ángulo (ejemplo concreto con sus datos o comandos); no repetir la explicación anterior con otras palabras.

# Git Commits

- NEVER add Co-Authored-By and AI attribution lines in PRs, commits, or any output, regardless of which agent produced it. NEVER

# Código legible

- Nombres: de negocio cuando describen fielmente el dato (`strata` → `TicketGroup`); técnicos precisos para infra y algoritmos. Nunca sacrificar precisión por familiaridad. Aplica a tipos, funciones, constantes y keys de JSON que van al prompt.
- Sin valores crípticos: cálculos, index math y constantes mágicas llevan nombre que explique la intención.
- Helpers: extraer a función local la lógica compleja **que ya está en el diff** (parseo, validación, condiciones de negocio) está permitido sin pedir. Cerca del caller. Prohibido: helpers o módulos utils para necesidades futuras, o refactorizar el resto del archivo.
- Sin estado mutable innecesario: no mutar desde closures ni acumular cuando el resultado se deriva directo.
- Validar solo lo que exige el contrato: nada de casos hipotéticos ni revalidar garantías aseguradas aguas arriba.

# Token Discipline

- GH ops via `gh` CLI ("actualiza body PR" → `gh pr edit <N> --body`), nunca explorar repo.
- Investigar/explorar: preguntar solo si falta información que cambie el alcance o la decisión. Si el pedido es claro, explorar acotado (dir o módulo relevante) y avisar qué se miró.

# MCP Routing

- Real code work (refactors, multi-file, symbol lookups, impact) → read `$HOME/.claude/rules/mcp-routing.md`. Skip trivia. This is the same source in Claude Code and Codex.

# Frontend

- UI en vambe-turborepo-frontend (clases, colores, superficies, tamaños de texto) → read `$HOME/.claude/rules/front.md` (reglas de dark mode). Same source in Claude Code and Codex.

# HTML / Artifacts

- Cualquier HTML (artifact, informe, plan, brief) → read `$HOME/.claude/rules/html-style.md` antes de escribirlo: estilo del planner para todos. Same source in Claude Code and Codex.

# Context-mode (output grande fuera del chat)

- Antes de cada tool call: si voy a procesar el output o puede pasar de 20 líneas → `ctx_execute`/`ctx_batch_execute`, imprimiendo solo resumen o fallos. Incluye test/lint/typecheck/build, `git log|diff|show|blame`, `grep -r`/`rg`/`find`, `curl`, logs de docker/kubectl y scripts que imprimen datos.
- `Read` de archivo >200 líneas solo con `offset+limit`, salvo para `Edit` de ese rango. Analizar un archivo → `ctx_execute_file`; un símbolo → Serena `find_symbol`.
- URLs → `ctx_fetch_and_index` + `ctx_search`, nunca `WebFetch`. MCPs con output largo (Metabase, Datadog, Vambe, Serena `search_for_pattern`) → `LIMIT`/filtros.
- Varias preguntas sobre lo mismo → un solo `ctx_batch_execute` o `ctx_search(queries:[...])`.
- Si context-mode falla: Bash/Read acotado, conservando errores y exit code (no `| head` a ciegas); avisar. No habilita saltarse reglas de seguridad ni de acceso a DB.

# Proceso según riesgo

Aplica a tareas de código, docs, PRs, análisis. No aplica a preguntas de una línea.

## Encuadre (antes del nivel)

- Sacar del pedido: **What** (entregable) · **Details** (archivos, PR, cliente, fechas) · **Rules** (restricciones que aplican, qué no se toca) · **Goals** (para qué + el "done" en una línea).
- Si el user no dio alguno → proponer los 4 en ≤4 líneas ("What: …, Details: …, Rules: …, Goals: …") y esperar sí/no antes de seguir. Aplica aunque la tarea sea chica: excepción a "Preguntar vs decidir".
- Si dio los 4 → seguir sin preguntar.

## Nivel (decidir antes de empezar, 1 línea al user)

- **Alto**: impacto grande (prod, DB/migrations, permisos, afecta cliente), difícil de revertir, o lógica compleja/feature nueva.
- **Bajo**: todo lo demás. Multiarchivo es una señal a mirar, no una condición: renombrar en 5 archivos es bajo; una línea de permisos es alto.

## Bajo → hacer, verificar, reportar

- Verificar lo pertinente: test si hay comportamiento, inspección si es docs/análisis.
- Bug fix: reproducir ANTES (guardar output), fix, mismo comando DESPUÉS. Si no se puede reproducir (sin entorno, sin datos) → decirlo explícito y qué se verificó en su lugar; nunca inventar evidencia.
- Reportar: qué cambió, cómo se verificó, limitaciones y qué quedó fuera.

## Alto → todo lo de Bajo, más diseño breve + checklist antes de implementar

1. Diseño: flujo entrada → pasos → salida, piezas, estructura de archivos (un archivo = una responsabilidad). Versión mínima primero. Mostrar al user antes de tocar código. Motivo: feedback recibido, "código muy complejo" por partir de cara sin organizar.
2. Checklist: un ítem por paso con **qué** y **cómo se verifica** (test, comando o inspección según el trabajo).
3. Cerrar: repasar el checklist con evidencia. ❌ o saltado → decirlo explícito, no ocultarlo.
4. Estimar incluyendo deploy, test y feedback. Si no se sabe, "no sé todavía", no inventar un número.

## Siempre, antes de PR

- `lint`, `typecheck`, `test` verdes vía context-mode, los que correspondan y existan. Si uno corresponde pero no se puede correr → informarlo; no cuenta como aprobado.
- Self-review del diff: ¿algo no pedido? ¿nombres precisos y adecuados al dominio? ¿comentarios que repiten lo evidente? ¿archivos que mezclan responsabilidades?
- PR no trivial → agente tech-lead antes que un humano.
- Body: qué, por qué, cómo probar.
- Multi-sesión: `.scratch/progress.md` (gitignored) con Completed / Learnings / Blockers / Next steps.

## Preguntar vs decidir

- Reversible y chico → decidir y avisar. Destructivo, afecta cliente o cambia scope → preguntar.

# Dónde va cada lección

- Regla de código (se ve en un diff) → `pr-checkpoint` (LEARN.md), nunca memoria ni CLAUDE.md.
- El plan se equivocó o le faltó algo → `~/.claude/agents/planner.md`.
- Comportamiento del agente que tiene que cumplirse siempre → CLAUDE.md (no hay hooks de push).
- Preferencia de cómo trabajar conmigo → memoria (feedback).
- Hecho o estado de un proyecto → memoria (project).
- Decisión de arquitectura de un repo → ADR en el repo (domain-modeling).
- Siempre: mostrar el cambio y esperar ok antes de escribir.

# Shared setup: Claude Code, Codex and .agents

- Antes de tocar `$HOME/.claude/{agents,skills,rules}`, `$HOME/.codex` o `$HOME/.agents`, o para pasar trabajo entre Claude y Codex → leer `$HOME/.claude/shared-setup.md`.
