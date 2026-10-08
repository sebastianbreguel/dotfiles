# Checklist de recolección de contexto

Úsalo en el Paso 1 del flujo. Pide todos los campos obligatorios en un solo bloque para no fragmentar la conversación.

## Bloque de preguntas al usuario (en español)

Pega este bloque al usuario cuando arranques una sesión nueva. Si ya dio algunos datos en su mensaje inicial, omite las que ya tienes y solo pregunta lo faltante.

```
Para armar un ticket fuerte, necesito estos datos del caso:

📌 OBLIGATORIOS
1. Nombre del cliente (razón social o nombre comercial):
2. Business Portfolio ID / BM ID (numérico):
3. Estado de Business Verification:
   □ Verified (¿desde cuándo?)
   □ Pending review
   □ Not started
   □ Rejected (¿motivo?)
4. WABA IDs afectadas (una por línea):
5. Phone Number IDs afectados (si aplica):
6. ¿Qué está pasando? (síntoma, error, mensaje de UI, desde cuándo):
7. ¿Qué ya intentaron? (pasos ejecutados sin éxito):
8. Cambio reciente relevante (actualización de datos, cambio de dueño,
   nueva verification, migración, etc.):
9. Uso previsto de la API (notificaciones, soporte, marketing, academic, etc.):
10. Texto LITERAL del rechazo/error de Meta (copiar/pegar exacto, no resumir):
11. Evidencia visual (adjuntar ambas):
    □ Screenshot del mensaje de rechazo de Meta
    □ Screenshot o copia del documento/dato que se subió y fue rechazado
12. Línea de tiempo del caso (si hubo más de un intento — completar la tabla abajo):
13. Facebook ID (User ID) de la persona que está intentando conectar el número
    (perfil personal que ejecuta el Embedded Signup — ver guía abajo si no lo saben):

📎 OPCIONALES (suman si los tienes)
- Industria / vertical del cliente:
- País de operación:
- Documentación de respaldo disponible (acreditaciones, registros oficiales):
- Volumen estimado de mensajes/día:
```

⚠️ Aclara siempre al usuario, al pedir estos datos: el ticket final va a mencionar explícitamente que se adjunta evidencia visual (screenshot del rechazo + del documento subido) — pídele que tenga ambas capturas listas para adjuntar al enviar el ticket a Meta, aunque el cuerpo del ticket sea texto.

## Plantilla — línea de tiempo del caso (campo 12)

Úsala cuando el caso tuvo más de un intento o rebote con Meta. Pide al usuario que la complete en orden cronológico:

```
| # | Fecha       | Qué se hizo / se envió                  | Qué respondió Meta (cita exacta o resumen fiel) |
|---|-------------|------------------------------------------|--------------------------------------------------|
| 1 | 2026-XX-XX  | [acción]                                  | [respuesta de Meta]                               |
| 2 | 2026-XX-XX  | [acción]                                  | [respuesta de Meta]                               |
| 3 | 2026-XX-XX  | [acción]                                  | [respuesta de Meta]                               |
```

Si el caso solo tiene un intento, omite esta sección del ticket — no la fuerces si no aplica.

## Dato faltante vs dato presente mal leído

Antes de redactar, compara el screenshot del documento/dato subido (campo 11) contra el texto literal del rechazo (campo 10):

- Si el dato que Meta dice que falta **no aparece** en la captura → es **dato faltante**. El ticket debe reconocer el gap y mostrar la corrección ya aplicada.
- Si el dato **sí aparece**, visible y correcto, en la captura → es **dato presente mal leído**. El ticket debe enmarcarse como error de lectura/misclassification del sistema automatizado, citando el dato exacto tal como aparece y adjuntando la captura como prueba.

Estos dos casos se ven iguales desde el resumen del usuario ("me rechazaron el documento") pero requieren argumentos opuestos — de ahí la importancia de pedir siempre la evidencia visual antes de clasificar.

## Cómo encontrar el Facebook ID (perfil personal) — campo obligatorio #13

Es el User ID del perfil personal de Facebook de quien está intentando conectar el número (quien ejecuta el Embedded Signup). Pídelo siempre, no solo cuando se sospeche de una cuenta restringida — Meta lo solicita con frecuencia incluso en casos donde el portafolio está limpio, y tenerlo desde el inicio evita un ciclo extra de ida y vuelta con el agente de soporte.

Pásale esta guía al usuario si no sabe cómo obtenerlo:

```
1. Entra a facebook.com/me estando con tu sesión iniciada (en cualquier navegador).
2. Facebook te redirige automáticamente a tu perfil, y la URL cambia a algo como
   facebook.com/profile.php?id=XXXXXXXXXXXX
3. Ese número después de "id=" es tu Facebook ID.

Alternativa (si tu perfil tiene un username personalizado en vez de mostrar
profile.php): entra a tu perfil, haz clic en los tres puntos (···) debajo de tu
foto de portada, elige "Copiar enlace al perfil" — en algunos casos el ID
numérico aparece si generas el enlace desde "Acerca de" > "Más información" > "ID".

También se puede ver en el código fuente de la página de perfil buscando el
patrón "userID":"...", pero el método de facebook.com/me es el más simple y no
requiere nada técnico.
```

## Validaciones antes de redactar

Antes de pasar al Paso 4 (redacción), verifica que:

- [ ] **BM ID está presente**. Sin esto el ticket no se puede procesar — detén y pide.
- [ ] **Al menos una WABA ID o Phone Number ID** está presente. Si el ticket es a nivel BM sin assets específicos, confirma con el usuario que eso es intencional.
- [ ] **Estado de verification es conocido**. Si no está verificado, la categoría y el framing cambian (usa `WABiz: Onboarding` en lugar de `Account & WABA`).
- [ ] **Historial de la cuenta** está claro. Si hubo violaciones previas, NO uses "clean history" en el ticket.
- [ ] **Si Vambe NO gestiona al cliente como BSP**, no uses `WABiz:`. Pausa y avisa al usuario.
- [ ] **Facebook ID (User ID) de quien intenta conectar el número está presente** (campo 13). Si el usuario no lo tiene, pásale la guía de "Cómo encontrar el Facebook ID" antes de redactar.
- [ ] **Texto literal del rechazo y evidencia visual (campos 10 y 11) están presentes.** Sin ambos no se puede clasificar "dato faltante" vs "dato presente mal leído", y el ticket pierde su argumento más fuerte.

## Campo "Issue Observed By" — cuándo aparece y qué poner

Este campo aparece en formularios de Tech Provider (Onboarding, Account & WABA) y define cómo Meta clasifica el origen del problema internamente:

| Valor | Cuándo usarlo |
|-------|--------------|
| `Issue observed by the end-client issue` | El cliente final reportó el error al intentar usar el servicio |
| `Issue observed by the partner issue` | Vambe/Tech Provider detectó el error en sus sistemas o logs antes de que el cliente lo reportara |

**Regla rápida:** ¿Quién lo detectó primero — el usuario final o el equipo técnico? Esa respuesta define el campo.

---

## Señales de que hay que pausar y repreguntar

- El usuario dice "creo que es el BM ID `xxx`" con duda → pide que lo confirme en Business Manager
- Usa WABA ID y Phone Number ID de forma intercambiable → son dos cosas distintas, aclara cuál tiene
- Describe el problema como "no funciona" sin especificar → pide error exacto o screenshot
- Menciona múltiples problemas inconexos → un ticket por problema, no mezclar
