# ClickHouse

Réplica de serving, consultada vía Metabase. Sin DDL: solo cuentan los cambios en nuestro SQL o en el flujo.

## Aprendizajes

- **Mirar primero por qué columna poda la tabla.** Las tablas de serving solo podan por `client_id`: cada llamada lee todo el historial del cliente, pida 500 o 10.000 ids. Por eso el costo por llamada es casi fijo (~4,65 s en `message_plan` con el peor cliente), y lo que baja el tiempo es **hacer menos llamadas**:
  - #869 `count_chats_by_day`, una lectura por ventana: 12,97 → 1,97 s.
  - #870 nombres y timeline de cerrados, de 35–51 llamadas a 1: 51,4 → 21,3 s y 64,8 → 25,8 s.
  - #868 message plan + stage timeline una vez por día: 22,9–25,2 s → ~17 s por día.
- **Sin DDL, reescribir el SQL quedó dentro del ruido** (`closed_window_plan`, `count_chats_by_week_grouped`, `agents`). Hubo dos excepciones chicas:
  - resolver una dimensión chica una vez y pasarla como lista de ids (#865, stages: 122 → 61 ms por página);
  - hacer `UNION ALL` de las fuentes antes de un solo join (#866, −10%).
- **Una palanca no se generaliza**: "stages una vez" mejoró las páginas de cerrados y empeoró el conteo semanal.
- **La réplica de serving cambia entre lecturas**: un ticket puede aparecer entre la página 1 y la 2. Todo lo que se lee una vez y se reusa tiene que tolerarlo.

## Atajos

- **Tiempo neto** = `running_time` de Metabase − `SELECT 1`, para restar la red y el overhead.
- **Cota de RAM sin `query_log`**: repetir con `SETTINGS max_memory_usage = X` bajando X. El primer valor con el que no falla es la cota; no es un percentil.
- **`SETTINGS max_threads = 1`** da la latencia con un hilo, útil para comparar variantes. No mide CPU.
- **Listas grandes de ids** van como parámetro en el body, no en la URL.
- **CPU, RAM exacta y percentiles de prod** requieren `GRANT SELECT ON system.query_log TO metabase_readonly`, que hoy no está.

## Errores

- **Estimar sin los topes del flujo.** El plan decía "~20 lotes → 1", pero eran ≤ ceil(3·limit/500) ≈ 3 por el `fetch_limit` y el corte temprano por cupo.
  **Regla**: estimar con las llamadas efectivas bajo el cap real, y marcarlo "estimado" hasta medirlo.
- **Sacar la llamada agrupada de su deadline (#869 → #873).** `ch_query` convierte las excepciones en `None`, pero no corta un `await` que nunca termina, como la adquisición del cliente o una respuesta perdida. El conteo por ventana quedó fuera de `asyncio.timeout(_COUNT_WALL_TIMEOUT_S)`, y un cuelgue impedía llegar al fallback diario.
  **Regla**: la llamada nueva va dentro del mismo timeout y fallback que la vieja, con un test de cuelgue para el camino nuevo.
- **Cachear por contacto cuando el consumidor necesita el ticket (#870 → #873).** Se asumió que "el contacto vino en la lectura" significaba "sus tickets están cubiertos". Un ticket que cerraba entre páginas volvía con `stage=None`, sin ningún error.
  **Regla**: la llave del caché tiene la granularidad del consumidor. Si aparece un dato nuevo, re-leer y **reemplazar** lo cacheado, no anexarlo.
- **Corridas no intercaladas.** Dieron un −13% falso en `count_chats_by_week_grouped`, que desapareció al intercalarlas.
