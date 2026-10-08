# Postgres

- **CRM**: réplica, consultada vía Metabase. Sin DDL (no podemos crear índices): solo se reescribe nuestro SQL.
- **datascience**: es nuestra, así que los índices entran por migración. No está en Metabase.

## Aprendizajes

- **Casi todo lo lento en CRM era una mala estimación del planner, no un índice faltante.** Con estadísticas viejas estima 1 fila (había 5.014), elige un nested loop y re-ejecuta la subquery por cada fila. Estas palancas funcionaron:
  - **Barrera `OFFSET 0`** (una subquery que el planner no puede aplanar) para filtrar primero por `client_id` + fecha: #867, 6.350 → 142 ms. Es una barrera, no garantiza que use el índice, así que se acepta según el plan observado.
  - **`EXISTS`** en vez de agregar o contar cuando solo importa si algo existe: #872, 6.963 → 168 ms.
  - **`INTERSECT`** (HashSetOp: lee el otro set una sola vez) en vez de un `IN (subquery)` mal estimado: #874, de timeout a 25,5 s en frío. Equivale al `IN` solo si el lado izquierdo ya es `DISTINCT` y no tiene NULL.
  - **Ordenar dentro de la barrera y poner el `LIMIT` afuera**, para cortar temprano. Un CTE `MATERIALIZED` corre el lateral para todas las filas antes de cortar. Con el cambio, #875 lo corre para 1.895 de 9.418 contactos: 73,2 → 21,3 s.
  - **Barrera antes del join a stage**: #876, 260,7 → 24,8 ms.
- **`enable_nestloop` depende del cliente y de `work_mem`.** Con `on`, los clientes chicos pasan de 31,6 s a 0,1 s, pero el más grande (con los 256 MB de `work_mem` de prod) pasa de 10,4 s a más de 120 s. Se queda en `off`.
- **La collation `en_US` compara con reglas de idioma (`strcoll`)**, lo que es caro en sorts grandes. Con `COLLATE "C"` en el `GROUP BY` o `ORDER BY` de texto: #878, 318 → 171 ms; #880, 59,5 → 28,6 ms. Los grupos son los mismos (la igualdad es byte a byte en ambas), pero **el orden cambia**.
- **`lower()` y `translate()` por fila cuestan, y reescribir no lo arregla.** Las sugerencias de `/search` solo bajan guardando una columna normalizada. `load_groups` agrupado en SQL fue más lento que en Python (45 → 146–176 ms) y cambió el grupo de 172 de 452 términos ambiguos.
- **Evaluar un predicado caro una sola vez y reusar los ids**: #879, `/search` 765 → 338 ms.
- **Escrituras**: solo el 5,1% de los updates de `analysis_tickets` son HOT (no tocan índices), así que casi cada update escribe los 9 índices (1,8 GB). Cada índice de más se paga en cada escritura.

## Atajos

- **En `EXPLAIN (ANALYZE, BUFFERS)`, mirar tres cosas**:
  - `rows` estimado vs real (1 vs 5.014 era el problema);
  - un `loops=` alto en el lado interno de un nested loop, que indica re-ejecución;
  - `Sort Method: external merge Disk`, que indica spill a disco.
- **Comparar la versión vieja y la nueva en un solo statement**, con conteo + md5 del resultado ordenado: mismo snapshot y un solo viaje (#874, #875).
- **Usar `EXPLAIN` plano** para confirmar la forma del plan sin re-ejecutar una query de 73 s en la réplica (#875).
- **Sesión segura de medición**: `default_transaction_read_only=on`, `statement_timeout` corto y `ROLLBACK`. Las escrituras solo con `EXPLAIN` plano, nunca ejecutadas.
- **HOT ratio**: `n_tup_hot_upd / n_tup_upd` en `pg_stat_user_tables`.
- **Índices sin uso**: `idx_scan` en `pg_stat_user_indexes`, junto con `pg_relation_size`.
- **`seq_scan`**: sacar una foto ahora y otra 12 h o más después, y comparar.

## Errores

- **Tratar el orden implícito del plan como contrato (#878 → #881).** El `DISTINCT` ordenaba las filas de paso. Con `GROUP BY ... COLLATE "C"` y sin `ORDER BY`, el tipo mostrado pasó a depender del orden del hash: 4.615 claves cambiaban de tipo, y 2.319 nombres en 183 pipelines muestran un badge distinto al de antes de #878. El chequeo "mismo dict" pasó porque miró el repo, no `annotate_entity_types`, que pliega mayúsculas.
  **Regla**: sin `ORDER BY` no hay orden. Al cambiar la collation, pasar de `DISTINCT` a `GROUP BY` o quitar un sort, buscar todos los consumidores y comparar el output final.
- **Citar el número en caliente (#874 → #877).** El docstring decía 0,6 s, medido con caché caliente. En frío eran 25,5 s contra un timeout de 60 s: un margen de ~2×, no de ~100×.
  **Regla**: en docstrings y en el body, poner el número en frío y el margen contra el timeout real.
- **Medir en otro contexto que prod.** Metabase dejó correr 73,19 s (N=1) una query que en prod muere a los 30 s; el límite de Metabase es 120 s.
  **Regla**: comparar contra el `statement_timeout` de prod y replicar `work_mem` y `enable_nestloop`.
- **Leer contadores como volumen.** Los 722 `seq_scan` de `analysis_tickets` son scans iniciados, no 722 lecturas de 12 GB, y hay que compararlos con 26 M lecturas por índice.
  **Regla**: atribuir antes de culpar.
- **Dar un índice por "redundante" por ser prefijo de otro.** `ix_analysis_tickets_pipeline_day` es prefijo de otros 3; eso lo hace candidato a estudiar, no prueba de que sobra.
  **Regla**: mirar tamaño y uso (`idx_scan`) antes de borrar.
- **Acceder a datascience por fuera de Metabase.** En esta ronda se usó una conexión directa read-only al primario, autorizada solo esa vez.
  **Regla**: decidir la vía antes de empezar. La regla general es que toda DB va por Metabase.
