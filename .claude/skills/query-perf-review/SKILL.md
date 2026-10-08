---
name: query-perf-review
description: Revisa cambios de performance de queries ClickHouse y Postgres (vambe-datascience, CRM, réplicas) contra los errores y aprendizajes de la ronda #865–#882. Cubre medición, equivalencia de resultados, timeouts, cachés, orden/collation y trucos para el planner. Usar al revisar un PR `perf(...)` o cualquier diff que agrupe llamadas a la base, agregue un caché, reescriba SQL, cambie collation, DISTINCT o GROUP BY, toque índices o cite tiempos de EXPLAIN ANALYZE. Usar también antes de optimizar o medir una query lenta, aunque nadie diga "performance".
---

# Query perf review

Revisa un cambio de performance de queries buscando lo que los benchmarks no ven.

En la ronda de septiembre 2026 (17 PRs, #865–#882) los tres bugs que llegaron a dev pasaron todos los benchmarks:
- una llamada quedó fuera de su timeout;
- un caché usaba el contacto como llave cuando hacía falta el ticket;
- un orden implícito cambió qué tipo ve el cliente.

Los encontró una revisión que razonó el flujo, no los tiempos. Esta skill es esa revisión.

Fuente completa (250 queries, mediciones y descartes): https://claude.ai/artifact/P5xJSsnXocAe1AicvnoatR

## Entrada

- PR: `gh pr view <N> --json title,body` y `gh pr diff <N>`.
- Rama local: `git diff origin/dev...HEAD`.
- Query suelta o archivo: leer la función y sus llamadores.

Leer el body del PR entero: ahí están las mediciones que hay que auditar.

## Pasos

1. **Clasificar el cambio.** Para cada archivo del diff, anotar el motor (ClickHouse, CRM Postgres o datascience Postgres) y qué tipo de cambio hace:
   - agrupa llamadas ("una vez por ventana / día / corrida");
   - agrega o cambia un caché;
   - reescribe SQL para el planner (barreras, `EXISTS`, `INTERSECT`, CTE);
   - cambia el orden (collation, `DISTINCT` → `GROUP BY`, quita un `ORDER BY` o un sort);
   - toca índices o escrituras;
   - cita números en un docstring o en el body.

   Si el diff es grande, revisar primero los cambios de orden y de caché: ahí estuvieron los bugs que llegaron a dev.

2. **Leer la referencia del motor.** Si toca ClickHouse, leer `references/clickhouse.md`; si toca Postgres, `references/postgres.md`. Cada una trae las palancas que funcionaron, las que no, y los errores reales con su PR.

3. **Revisar la correctness según el tipo de cambio.** Es la parte que el benchmark no cubre:
   - **Agrupa llamadas.** ¿La llamada nueva sigue dentro del mismo `asyncio.timeout` y del mismo fallback que la vieja? `ch_query` devuelve `None` ante excepciones, pero no corta un `await` colgado. ¿Hay un test de cuelgue para el camino nuevo? ¿Se sigue respetando el corte temprano por cupo (`fetch_limit`)?
   - **Caché.** ¿La llave tiene la granularidad que necesita el consumidor (ticket, no contacto)? ¿Qué pasa si aparece una fila nueva entre la lectura cacheada y su uso? La réplica cambia entre páginas. Al re-leer, ¿reemplaza lo cacheado o lo anexa?
   - **Orden.** Buscar todos los consumidores del resultado (`find_referencing_symbols`) y preguntar si alguno dependía del orden. Sin `ORDER BY` no hay orden garantizado, y un desempate tiene que ser explícito y determinista.
   - **Reescritura de SQL.** ¿Se mantienen los filtros (borrados, tests, estados raros como `''`), el desempate y el orden de salida? ¿Qué pasa con los NULL? Por ejemplo, `INTERSECT` equivale a `IN` solo si el lado izquierdo ya es `DISTINCT` y no tiene NULL.

4. **Auditar la evidencia de medición** del body contra el método de abajo. Marcar lo que falta. No inventar números ni correr queries pesadas para completarlos.

5. **Reportar** con el formato de abajo.

## Método de medición esperado

- **Tres clientes por query**: el peor (más volumen), el de más historia y el mediano. Se reporta el p50 (mediana) del peor. Un cambio que mejora al chico y empeora al grande no entra.
- **Corridas intercaladas** entre original y variante (A B B A). Sin intercalar, un −13% resultó ser falso.
- **Mismo resultado = hash del output completo normalizado, medido donde lo consume el cliente**, no en la función tocada ni contando filas. Así se escapó el bug de #878.
- **Flujo real, no solo SQL**: correr el método real con settings de prod y contar las llamadas a la base. En un fetch, probar vacío, varios lotes, corte por cap y fallo de ClickHouse.
- **En frío, comparado contra el timeout de prod.** Un número con caché caliente no sirve para decir "hay margen".
- **Un timeout no es una medición**: "> 120 s" es un resultado incompleto, no un p50. Con N=1 no hay percentiles.
- **Contexto de prod replicado**: `statement_timeout`, `work_mem`, `enable_nestloop`. Metabase deja correr 120 s; prod corta a 30 s.
- **Estimaciones calculadas con los caps reales** y etiquetadas "estimado" hasta medirlas.
- **Test que falla en `origin/dev`**, y un PR por cambio.
- **Métrica en prod para confirmar** después del deploy. Si el camino no la tiene, instrumentar primero, como en #882.

## Acceso a datos

Validar contra una base solo si el hallazgo no se puede confirmar leyendo el código. Hacerlo por Metabase (`mcp__metabase__execute_query`), con `LIMIT` y `statement_timeout` corto, y antes revisar que cada filtro y cada join usan índice. Si la query no es trivial (join, agregación sobre tabla grande, sin rango indexado), mostrarla al usuario antes de correrla.

La DB de datascience no está en Metabase: pedirle al usuario la vía antes de medir. Las escrituras se revisan solo con `EXPLAIN` plano, nunca ejecutadas.

## No hacer

- Recortar historia de mensajes para ganar velocidad.
- Optimizar queries submilisegundo o agregados de decenas de ms que corren una vez por semana.
- Borrar un índice por ser prefijo de otro sin mirar su tamaño y su uso.
- Culpar a una query por `seq_scan` acumulados sin atribuirlos: el contador cuenta scans iniciados, no lecturas completas.
- Copiar propuestas de otra revisión sin revisar la semántica.

## Formato de salida

**Veredicto**: listo / listo con cambios / no listo, en una línea con el motivo principal.

**Hallazgos**, del más grave al menos grave: resultado incorrecto silencioso > cuelgue o timeout > evidencia insuficiente > estilo. Cada hallazgo lleva:
- `archivo:línea` y qué pasa, con un escenario concreto (esta entrada produce este resultado incorrecto);
- por qué importa, citando el aprendizaje o el PR previo que lo respalda;
- cómo verificarlo, con un test o una medición concreta.

**Evidencia de medición**: una tabla corta con cada punto del método marcado ✅, ❌ o "no aplica", citando el body.

**Fuera de alcance**: si el PR hace algo de la lista "No hacer".

Si no hay hallazgos, decirlo en una línea y listar qué se revisó.
