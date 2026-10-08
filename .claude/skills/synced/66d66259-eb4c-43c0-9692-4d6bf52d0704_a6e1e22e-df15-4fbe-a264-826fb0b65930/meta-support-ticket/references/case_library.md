# Biblioteca de Casos Reales — Vambe BSP / Meta Support
## Período: Marzo — Mayo 2026

Esta biblioteca documenta los 19 casos reales gestionados por Vambe con Meta Support. Úsala para:
1. Identificar el patrón del problema actual
2. Seleccionar el argumento correcto
3. Estimar la probabilidad de resolución
4. Evitar errores que otros casos ya cometieron

---

## 🔴 PATRÓN 1: WABA Desactivada al Crearla (False Positive)

**Diagnóstico:** El sistema automatizado de Meta bloquea la WABA en el momento de creación, antes de cualquier actividad. Causa: actualización de verification details, trigger automático por industria sensible, o flag heredado del BM padre.

**Argumento central:** "It is technically impossible to have violated WhatsApp's policies without having initiated any operation."

**Éxito de resolución:** ~80% con ticket URGENT + argumento de imposibilidad técnica.

### Casos de referencia:

| Cliente | BM ID | WABA IDs | Resultado | Agente |
|---------|-------|----------|-----------|--------|
| Construye tu Casa | 923426984028524 | 2300922887066108, 1559982411772963, 931900512769518 | ✅ WABAs desbloqueadas. BM pendiente | Reece |
| Clínica Flow | 260226476319005 | 1231182432554276, 165284763326596 | ⚠️ Portafolio permanentemente deshabilitado | Joy |
| Valposs SPA | 809811471079647 | 1647390523165021 | ✅ Resuelto. "Found it is compliant with WhatsApp's policies" | Navs |
| Universidad de los Andes | 445406739156054 | Múltiples | ✅ Resuelto tras identificar usuario admin restringido | — |
| Clínica A:C2 / Dr. Andrades | 227651957834497 | 1785379779107509 | ⚠️ En revisión, upgrade a URGENT solicitado | — |
| Ilusión Fitness | 391236598923712 | 1681892839181370 | ⚠️ Ghost partner bug, pendiente | Eduardo / Barry |

**Paso diagnóstico CRÍTICO:** Antes de apelar WABAs individuales, verificar el estado del BM padre. Si varias WABAs se desactivan al crearse, el problema casi siempre está en el BM raíz (ver Caso Universidad — BM estaba deshabilitado).

**Si el Business Support Home está caído:** Documentarlo explícitamente en el ticket como bug de plataforma sistémico. No seguir intentando el flujo — argumentar impacto en múltiples portafolios para acelerar escalación.

---

## 🟡 PATRÓN 2: BM Restringido / "Not Eligible for Advertising"

**Diagnóstico:** El Business Manager tiene restricciones invisibles que no aparecen en la UI pero bloquean operaciones (agregar usuarios, crear ads, agregar assets). Generalmente resuelto por Trust & Safety.

**Argumento central:** Documentar restricciones específicas (no genéricas) antes de escalar. La diferencia entre resolver rápido o tarde es que el agente documente correctamente las dos restricciones antes de escalar a T&S.

### Casos de referencia:

| Cliente | BM ID | Restricción | Estado | Agente clave |
|---------|-------|------------|--------|--------------|
| Construye tu Casa | 923426984028524 | "Not eligible for advertising" + no puede agregar usuarios | ⚠️ Pendiente Trust & Safety | Kei (el único que documentó correctamente después de 5 semanas y 6 agentes) |
| Universidad de los Andes | 445406739156054 | BM deshabilitado (causa raíz de WABAs caídas) | ✅ T&S desbloqueó BM y WABAs | — |

**Lección clave (Construye tu Casa):** Kei fue el agente 7 después de Valerie, Jill, Leo, Ladylyn, Geneveive y Theodore. La diferencia no fue acceso sino documentación. Siempre pedir el nombre del agente y hacer seguimiento con el mismo si hay avance real.

---

## 🟠 PATRÓN 3: Ghost Partner Bug (Contador Backend Desincronizado)

**Diagnóstico:** La UI muestra 0 socios pero el sistema backend no sincronizó la eliminación. Error: "Maximum partners reached" con 0 socios visibles.

**Argumento central:** Usar la terminología exacta "partner counter reset" para que el agente de Support Engineering sepa exactamente qué herramienta usar.

**Pasos validados:**
1. Verificar si hay una Line of Credit activa aún vinculada (bloquea el reset)
2. Hacer offboard de coexistencia + nuevo Embedded Signup (instrucción de Eduardo)
3. Si persiste → escalar a Support Engineering con logs en tiempo real
4. Proveer video del flujo "Cambiar número" en la app

### Caso de referencia:

| Cliente | BM ID | WABA ID | Estado | Agente |
|---------|-------|---------|--------|--------|
| Ilusión Fitness | 391236598923712 | 1681892839181370 | ⚠️ Barry (Support Engineering) monitoreando logs. Line of Credit removida | Eduardo → Barry |

---

## 🟣 PATRÓN 4: Commerce Policy — Sistema Confunde Categorías

**Diagnóstico:** El sistema automatizado de Meta clasifica incorrectamente al negocio. Casos documentados:
- Clínica estética de agendamiento → clasificada como e-commerce de productos médicos
- Concesionaria licenciada → clasificada como marketplace P2P de particulares

**Argumento central:** Establecer EXPLÍCITAMENTE la distinción entre categorías:
- SERVICE PROVIDER ≠ PRODUCT SELLER
- LICENSED DEALER ≠ P2P MARKETPLACE

**Contacto directo con Account Manager:** El canal más efectivo para detener una desactivación antes de que se ejecute. Siempre intentar contactar al AM de Meta asignado en paralelo al ticket.

### Casos de referencia:

| Cliente | BM ID | Problema | Estado |
|---------|-------|----------|--------|
| Clínica A:C2 / Dr. Andrades | 227651957834497 | WABA desactivada por "productos médicos" cuando vende citas | ⚠️ Revisión en curso |
| Americar / Clicar | 165878127532670 | Display Name bloqueado por "Commerce Policy vehículos usados" | ⚠️ Appeal enviado + mail a AM Coni Wasserlauf |
| Segmail | 1777784845592131 | Display Name visible en perfil pero no en chat (origen SMB) | ⚠️ Pendiente Meta Verification |

**Sobre Display Name y origen SMB:** Si el número fue creado en WhatsApp Business App (SMB) y luego migrado a API mediante coexistencia, requiere que Meta Verification esté completada ANTES de que el Display Name pueda ser aprobado. Esta distinción no está documentada en la plataforma.

---

## 🔵 PATRÓN 5: Verificación Atascada

**Diagnóstico:** El portafolio queda en "En revisión" por más de 7 días sin resolución.

**Causas más frecuentes:**
- Nombre legal no aparece en el sitio web en formato indexable (texto, no imagen)
- El sitio web no puede ser rastreado por el crawler de Meta
- La empresa tiene menos de 1 año de antigüedad en registros públicos

**Bug de proceso crítico:** No se puede corregir y resubmitir sin el rechazo formal previo. La solución es pedir explícitamente al agente que rechace manualmente la solicitud activa.

**Texto exacto para pedir el rechazo manual:**
"Please manually reject the current pending verification submission for BM [ID] so that our client can immediately resubmit with the corrected information."

### Casos de referencia:

| Cliente | BM ID | Causa identificada | Estado |
|---------|-------|-------------------|--------|
| Ilusión Fitness | 391236598923712 | Verification atascada (problema paralelo a WABA) | ⚠️ En proceso (fecha estimada 8 abril) |
| Circuito de Buenos Aires SA | 1230569271493036 | Nombre legal no aparecía en el sitio | ⚠️ Ladylyn procesando rechazo manual para resubmisión |

---

## ⚫ PATRÓN 6: Caso Inapelable — Spam Confirmado

**Diagnóstico:** Meta rechaza definitivamente con evidencia de historial de reportes de usuarios. La decisión está marcada como inapelable.

**Señales de que es definitivo:**
- Respuesta menciona "spam" y "negative user feedback" explícitamente
- La decisión está marcada sin pathway de apelación
- Meta confirma el historial de reportes

**Acción correcta:** Informar al cliente con transparencia. Recomendar: BM nuevo + número limpio + entidad diferente si aplica. No gastar más semanas de gestión en un caso sin salida.

### Casos de referencia:

| Cliente | BM ID | Resultado | Estado |
|---------|-------|----------|--------|
| Metcorp Panel SIP | 133002454679527 | Apelación rechazada definitivamente por spam | ✅ CERRADO — BM nuevo recomendado |
| Clínica Flow | 260226476319005 | Portafolio permanentemente deshabilitado | ✅ CERRADO — Portafolio nuevo recomendado |

**Afirmación de Meta sobre Clínica Flow:**
- No hay reactivación posible
- WABA nueva bajo mismo portafolio también se desactivaría
- Portafolio nuevo bajo misma entidad es posible pero con riesgo
- Nueva entidad solo para evadir restricción puede ser violación de políticas
- **Recomendación:** Portafolio nuevo con admin diferente, dominio diferente y categoría no médica

---

## 🟢 PATRÓN 7: Problema Técnico Post-Migración (Coexistencia Dual)

**Diagnóstico:** Funcionalidades que no están disponibles en la UI del Manager después de migrar a coexistencia dual. Requieren intervención vía API directa o soporte especializado.

### Casos documentados:

| Problema | Solución | Cliente |
|---------|----------|---------|
| Foto de perfil desaparecida post-migración | WhatsApp Business Profile API con parámetro `profile_picture_handle` | Ceón Santiago |
| Display Name "sin conexión" (visible en perfil, no en chat) | Número de origen SMB requiere Meta Verification antes del review | Segmail |
| Coexistencia bloqueada a nivel de portafolio | Usuario admin con restricción en cuenta de Facebook personal (2023) → agregar nuevo admin | U. Andes |
| WABA SMB atrapada entre equipos que no se hablan | Documentar contradicción explícita: "SMB dice limpio, sistema API lo bloquea" | U. Andes |

**Regla crítica sobre equipos SMB vs API:** Son completamente independientes y no se coordinan entre sí. Cuando ambos sistemas contradicen sus propios datos, documentar la contradicción explícitamente es el único argumento que puede forzar una revisión técnica conjunta.

**Regla crítica sobre coexistencia:** Identificar qué usuario ejecuta el Embedded Signup es un paso diagnóstico que rara vez se considera primero. Una cuenta de Facebook personal restringida bloquea operaciones de API aunque el portafolio esté limpio.

---

## 📊 Resumen de Estados Actuales (Mayo 2026)

| Cliente | Estado | Próximo paso |
|---------|--------|-------------|
| Construye tu Casa | ⚠️ BM restringido pendiente T&S | Esperar respuesta de Kei / T&S |
| U. Andes Chile | ✅ Operativo (coexistencia) | Resolver pregunta sobre usuario original restringido |
| Ilusión Fitness | ⚠️ Ghost bug pendiente | Responder a Barry con video del flujo |
| Clínica Flow | ⚫ Cerrado definitivamente | Portafolio nuevo recomendado |
| Metcorp Panel SIP | ⚫ Cerrado definitivamente | BM nuevo + número limpio |
| Americar / Clicar | ⚠️ Appeal pendiente | Seguimiento con AM Coni Wasserlauf |
| Ceón Santiago | ✅ Resuelto vía API | — |
| Valposs SPA | ✅ Resuelto | Conectar número y continuar onboarding |
| Henkel México | ✅ Informado | Acción en manos del cliente |
| Segmail | ⚠️ Pendiente Meta Verification | Responder a Jared |
| Clínica A:C2 | ⚠️ En revisión | Upgrade a URGENT solicitado |
| Circuito de Buenos Aires | ⚠️ Esperando rechazo manual | Resubmitir cuando llegue el rechazo |

---

## 🔑 Afirmaciones clave de Meta (documentadas por escrito)

| Afirmación | Caso | Relevancia |
|-----------|------|-----------|
| "Accounts comply with WhatsApp's policies" | Construye tu Casa (Reece) | Confirma false positive — usar en apelaciones de BM |
| "Found it is compliant with WhatsApp's policies. We have reversed the issue." | Valposs SPA (Navs) | Prueba que los false positives se resuelven con el argumento correcto |
| Usuario restringido por +180 días no es reversible por política | U. Andes | Usar admin alternativo en lugar de intentar desbloquear el original |
| "Display name review process depends on the creation source of the phone number" | Segmail | Verificar origen del número ANTES del onboarding |
| Portafolio permanentemente deshabilitado no tiene override manual | Clínica Flow (Joy) | Reconocer el límite a tiempo — no gastar semanas |
| "Operating under separate support structures" (SMB vs API) | U. Andes (WABA SMB) | Los dos equipos no se coordinan — documentar la contradicción para forzar revisión cruzada |
| Crear entidad nueva solo para evadir restricción puede ser violación | Clínica Flow | Documentado por escrito por Meta |
