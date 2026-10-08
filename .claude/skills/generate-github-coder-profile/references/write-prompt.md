# Fase 4 — Prompt de redacción

Corre **después** de que `validate.py` pase. Sustituir `{PATTERNS}` (`brain/patterns.json`), `{RESOLVED}` (`.pipeline/patterns.resolved.json`) y `{DISPLAY}`.

---

Abrí `{RESOLVED}` (`patterns.resolved.json`) **para leer**. Cada patrón ya trae, calculado por código: `layer`, `confidence`, `pr_count` y sus `citations` con el texto literal de cada comentario. Ahora sí tenés a la vista la evidencia real.

## Tu tarea

Pulir **solo** estos tres campos de cada patrón: `statement`, `trigger`, `what_to_comment`.

## Dónde escribís

**Editás `{PATTERNS}`, nunca `{RESOLVED}`.**

`patterns.json` es la fuente de verdad; `patterns.resolved.json` es un artefacto derivado que `compute.py` sobrescribe entero en cada corrida. Si escribís ahí, la próxima corrida de `compute.py` —que el pipeline hace todo el tiempo, porque es determinista y barata— borra tu trabajo sin avisar. `validate.py` compara los cinco campos semánticos entre los dos archivos y falla si divergen.

Los patrones se emparejan por `key`, que es la misma en los dos archivos.

Al terminar, corré:

```bash
python3 scripts/compute.py <corpus_dir>
python3 scripts/validate.py <corpus_dir>
```

## Prohibido

- Editar `{RESOLVED}` o cualquier `.md`.
- Tocar `comment_ids` (o `key`, que es lo que empareja los dos archivos).
- Escribir texto de citas dentro de los campos que editás: el texto lo inyecta el pipeline.
- Escribir números ("3 PRs", "la mayoría de las veces"): los pone el render.

## Criterio de calidad

**El título promete lo que la cita entrega.** Si el patrón se llama "Toda tabla nueva lleva la dimensión de tenant" pero las dos citas solo dicen "metele workspace_id" en un contexto puntual, bajá el título a lo que se sostiene. Esta es la falla más común: el título generaliza más que la evidencia.

**`trigger` tiene que ser verificable en el diff.** Un agente que revisa una PR solo ve el diff y el repo. No sabe si el producto cobra por esa feature, ni si el autor es nuevo, ni si el cambio es urgente. Si el disparador depende de eso, reescribilo o marcalo como pregunta.

Mal: "cuando el archivo es difícil de seguir".
Bien: "función de más de ~60 líneas que mezcla parseo, IO y lógica de negocio".

**`what_to_comment` es una acción, no un juicio.** "Pedir que lo extraiga a un hook y nombrar cuál" en vez de "señalar que está mal encapsulado".

**Confianza baja = pregunta, no hallazgo.** Si `confidence` es `baja`, `what_to_comment` debe formularse como pregunta para la sección de dudas, no como algo a corregir.

**Español, conciso.** Una o dos frases por campo. Nada de relleno ni de "es importante notar que".

## Salida

`{PATTERNS}` editado, más un resumen de qué patrones reformulaste y por qué — en especial aquellos donde bajaste el alcance del título porque la evidencia no daba.
