# Las 26 categorías de Meta Support — Guía de decisión

## Regla de oro para Vambe

```
¿Eres desarrollador directo sin intermediario?  → Dev:
¿Gestionas clientes como BSP (Vambe)?            → WABiz:   ← SIEMPRE ESTO
¿Eres Tech Provider registrado en Meta?          → WhatsApp Tech Provider:
```

**Vambe es BSP. Por lo tanto, todos los tickets de clientes usan `WABiz:`.**

La diferencia no es cosmética: van a queues distintos con agentes distintos. Si usas `Dev:` para un cliente de Vambe, el agente puede rechazar el ticket por falta de relación directa con la cuenta.

---

## Grupo 1 — Generales (sin prefijo)

| Categoría | Cuándo usarla |
|-----------|---------------|
| `API & Product Integration Questions` | Dudas técnicas consultivas de integración API. No para bans ni bloqueos. |

## Grupo 2 — `Dev:` (desarrolladores directos de la API sin BSP)

Vambe **no** usa estas. Listadas por completitud.

| Categoría | Cuándo usarla |
|-----------|---------------|
| `Dev: Account & WABA` | Seguridad, acceso no autorizado, restricciones a nivel WABA — dev directo |
| `Dev: Billing, Credit & Pricing` | Facturación, créditos, pricing desde julio 2025 |
| `Dev: Cloud API` | Issues técnicos Cloud API (webhook, timeouts, llamadas fallidas) |
| `Dev: Message Templates` | Apelar rechazo de template |
| `Dev: Onboarding` | Verification stuck, acceso WhatsApp Business API — dev directo |
| `Dev: Phone Number & Registration` | Display Name, registro, migración sin BSP |
| `Dev: Request or Update an Official Business Account` | Check verde (OBA) o actualizar OBA |

## Grupo 3 — `WABiz:` (clientes gestionados por BSP) ← **USA ESTAS**

| Categoría | Cuándo usarla |
|-----------|---------------|
| `WABiz: Account & WABA` | **MÁS USADA.** Restricciones, bans, false positives en WABAs de clientes. Deactivations post-creation. **Ver subcategorías abajo.** |
| `WABiz: Billing, Credit & Pricing` | Facturación del cliente final |
| `WABiz: Business Payments API` | Issues con API de pagos de WhatsApp |
| `WABiz: Cloud API` | Errores técnicos Cloud API en cuentas de clientes (webhooks, rate limits, 5xx) |
| `WABiz: Feature Request` | Feedback de producto / solicitar features a Meta |
| `WABiz: Groups API` | API de grupos de WhatsApp |
| `WABiz: Marketing Messages` | Problemas con marketing messages (Open Beta) |
| `WABiz: Message Templates` | **Muy usada.** Apelar templates rechazados de clientes |
| `WABiz: OTP Delivery Issues` | OTPs que no llegan, delivery fallido de verificación |
| `WABiz: Onboarding` | Business verification pendiente o atascada de clientes. **Ver subcategorías abajo.** |
| `WABiz: Phone Number & Registration` | Display Name, registro, migración de números de clientes |
| `WABiz: Request Outbound Load Testing` | Pruebas de carga para números de alto volumen |
| `WABiz: Request or Update an Official Business Account` | Check verde para cliente |
| `WABiz: Usernames API Integration` | Integración de usernames y BSUID de WhatsApp. **Ver subcategorías.** |

## Grupo 4 — `WhatsApp Tech Provider:`

Vambe **no** usa estas salvo registro formal como Tech Provider. Listadas por completitud.

| Categoría | Cuándo usarla |
|-----------|---------------|
| `WhatsApp Tech Provider: Account & WABA` | Igual que WABiz pero para Tech Providers registrados formalmente. **Formulario híbrido: Título + Description + Dropdown de 4 tipos.** Ver sección dedicada. |
| `WhatsApp Tech Provider: Onboarding` | Verification y onboarding gestionado por Tech Provider. **Formulario híbrido con campos dinámicos** — al seleccionar Embedded Signup aparecen campos extra de debugging (Partner App ID, Session ID, OAuth URL). Ver sección dedicada. |
| `WhatsApp Tech Provider: Phone Number & Registration` | Números bajo gestión Tech Provider. **3 tipos de solicitud** (subset de WABiz — sin Phone Migration, Lost 2FA ni Certificate). Ver sección dedicada. |
| `WhatsApp Tech Provider: Usernames API Integration` | Usernames y BSUID bajo Tech Provider. **Formulario híbrido** (Título + Description + Dropdown). Mismos 5 tipos que WABiz. Ver sección dedicada. |

---

## ⚠️ Subcategorías de `WABiz: Account & WABA` — Campo obligatorio "Tipo de solicitud"

Cuando el ticket usa la categoría `WABiz: Account & WABA`, Meta muestra un segundo campo obligatorio: **Tipo de solicitud**. Siempre incluirlo en la entrega del ticket.

### Opciones disponibles y cuándo usar cada una:

| Tipo de solicitud | Cuándo usarla |
|-------------------|---------------|
| `Appeal Business Ban Decision` | **MÁS USADA en esta categoría.** WABA o BM desactivado/baneado y se quiere apelar. Aplica a false positives, bans por supuesta política y restricciones post-creación. |
| `Catalog` | Problemas con el catálogo de productos vinculado a la cuenta de WhatsApp Business |
| `On-Behalf-Of Resets` | Vambe necesita ejecutar un reset de cuenta en nombre del cliente (cambio de BSP, migración de partner) |
| `Report Abuse` | El cliente está siendo víctima de abuso en su cuenta (suplantación, acceso no autorizado, spam hacia la cuenta) |
| `Report a Security Breach` | Compromiso de seguridad activo — tokens filtrados, acceso no autorizado a la cuenta de forma maliciosa |
| `Unexpected System Token or Messaging Permission Loss` | El System User Token expiró inesperadamente, fue revocado, o la cuenta perdió permisos de mensajería sin razón aparente |
| `Messaging Limits` | El cliente alcanzó el límite de conversaciones del tier actual y necesita un upgrade de tier (de 1K a 10K, de 10K a 100K, etc.) |

### Árbol de decisión rápido para `WABiz: Account & WABA`:

```
¿La WABA o el BM está baneado/restringido/desactivado?
├── ¿False positive (desactivado al crear, sin actividad)?  → Appeal Business Ban Decision
├── ¿Baneado por supuesta violación de política?            → Appeal Business Ban Decision
├── ¿BM con error "not eligible for advertising"?           → Appeal Business Ban Decision
└── ¿Desactivado por Commerce Policy confundida?            → Appeal Business Ban Decision

¿El problema es técnico / de permisos?
├── ¿Token de System User revocado o expirado?              → Unexpected System Token or Messaging Permission Loss
├── ¿Permisos de mensajería desaparecieron sin razón?       → Unexpected System Token or Messaging Permission Loss
└── ¿Reset de cuenta en nombre del cliente (cambio BSP)?    → On-Behalf-Of Resets

¿El problema es de límites operativos?
└── ¿Límite de conversaciones alcanzado / upgrade de tier?  → Messaging Limits

¿El problema es de seguridad activa?
├── ¿Cuenta comprometida, tokens filtrados?                 → Report a Security Breach
└── ¿Abuso entrante hacia la cuenta del cliente?            → Report Abuse

¿Problema con el catálogo de productos?                     → Catalog
```

### Mapeo directo de casos reales de Vambe:

| Caso real | Tipo de solicitud correcto |
|-----------|---------------------------|
| Construye tu Casa — WABAs bloqueadas al crear | `Appeal Business Ban Decision` |
| Clínica Flow — WABAs desactivadas, portafolio restringido | `Appeal Business Ban Decision` |
| Valposs SPA — WABA desactivada al crear | `Appeal Business Ban Decision` |
| Clínica A:C2 — WABA desactivada por Commerce Policy | `Appeal Business Ban Decision` |
| Americar/Clicar — Display Name + amenaza de ban | `Appeal Business Ban Decision` |
| Metcorp Panel SIP — ban por spam | `Appeal Business Ban Decision` |
| Construye tu Casa — BM "not eligible for advertising" | `Appeal Business Ban Decision` |
| Ilusión Fitness — ghost partner, System User sin acceso | `Unexpected System Token or Messaging Permission Loss` |

---

## ⚠️ Subcategorías de `WABiz: Cloud API` — Campo obligatorio "Tipo de solicitud"

Cuando el ticket usa la categoría `WABiz: Cloud API`, Meta muestra un segundo campo obligatorio: **Tipo de solicitud**. Siempre incluirlo en la entrega del ticket.

### Opciones disponibles y cuándo usar cada una:

| Tipo de solicitud | Cuándo usarla |
|-------------------|---------------|
| `Bug or Implementation Issue` | **Más general.** Error técnico en la integración Cloud API: webhooks que no llegan, mensajes que no se envían, respuestas inesperadas de la API, errores 4xx/5xx no explicados por documentación |
| `Cloud API Local Storage` | El cliente necesita activar o tiene problemas con la opción de Local Storage para Cloud API (almacenamiento de medios en infraestructura propia) |
| `Direct Catalog Connection API` | Problemas con la integración directa del catálogo de productos vía API (sincronización de inventario, errores de catalog feed) |
| `Issues with WhatsApp Flows` | El flujo interactivo de WhatsApp Flows no funciona: no se renderiza, falla el submit, error en el JSON del flow, webhook de completion no llega |
| `On-Premises API -> Cloud API Migration Issues` | El cliente está migrando desde la API On-Premises (cliente local) a Cloud API y tiene errores durante la transición |
| `Payment to Merchant (Payments API)` | Problemas con la API de pagos a comercios dentro de WhatsApp (Payments API, disponible en mercados seleccionados) |
| `Coexistence Data Synchronization APIs and Webhooks` | Problemas de sincronización de datos entre el número SMB y el número API durante la coexistencia dual (mensajes duplicados, webhooks desfasados, estados contradictorios) |
| `Request to use Cloud API No Storage Solution` | Solicitud para activar la modalidad sin almacenamiento (No Storage) en Cloud API — Meta debe habilitarlo manualmente |

### Árbol de decisión rápido para `WABiz: Cloud API`:

```
¿El problema es un error técnico de la API?
├── ¿Webhook no llega / mensajes no se envían / 5xx?        → Bug or Implementation Issue
├── ¿Error durante migración On-Premises → Cloud?           → On-Premises API -> Cloud API Migration Issues
└── ¿Necesita activar No Storage Solution?                  → Request to use Cloud API No Storage Solution

¿El problema es con WhatsApp Flows?
└── ¿Flow no renderiza / falla submit / webhook de flow?    → Issues with WhatsApp Flows

¿El problema es con almacenamiento o medios?
└── ¿Local Storage para medios en infra propia?             → Cloud API Local Storage

¿El problema es con catálogo de productos?
└── ¿Sincronización de catálogo vía API?                    → Direct Catalog Connection API

¿El problema es con coexistencia dual?
└── ¿Sincronización SMB ↔ API / webhooks desfasados?       → Coexistence Data Synchronization APIs and Webhooks

¿El problema es con pagos dentro de WhatsApp?
└── ¿API de pagos a comercios?                              → Payment to Merchant (Payments API)
```

---

## ⚠️ Subcategorías de `WABiz: Onboarding` — Campo obligatorio "Tipo de solicitud"

Cuando el ticket usa la categoría `WABiz: Onboarding`, Meta muestra un segundo campo obligatorio: **Tipo de solicitud**. Siempre incluirlo en la entrega del ticket.

### Opciones disponibles y cuándo usar cada una:

| Tipo de solicitud | Cuándo usarla |
|-------------------|---------------|
| `App Review` | El cliente espera aprobación de una app o integración dentro del proceso de onboarding |
| `Appeal API Onboarding Decision` | Meta rechazó el acceso a la API durante el onboarding y el cliente quiere apelar esa decisión |
| `Embedded Signup` | El cliente no puede completar el flujo de Embedded Signup (error, loop, no avanza) |
| `Onboarding Status Pending` | La verificación o el onboarding lleva más de 7 días en estado pendiente sin resolución |
| `Troubleshoot Meta Business Verification` | La verificación del portafolio está atascada, rechazada o con datos incorrectos (nombre legal, sitio, etc.) |
| `Troubleshoot Meta Business Verification for Government Entity` | Igual que el anterior pero para entidades gubernamentales (municipios, ministerios, instituciones públicas) |
| `Partner-led Business Verification for WhatsApp` | Vambe como BSP gestiona directamente la verificación en nombre del cliente (flujo de partner-led) |
| `Embedded Signup - Coexistence Onboarding` | Problemas específicos durante la migración a coexistencia dual (número SMB migrando a API) |
| `Embedded Signup - MSC Onboarding` | Problemas durante el onboarding de un número bajo el flujo MSC (Meta Shared Channels) |
| `Embedded Signup - MSC Offboarding` | El cliente necesita desconectar o migrar fuera de un número bajo MSC |

### Árbol de decisión rápido para `WABiz: Onboarding`:

```
¿El problema es la verificación del BM?
├── ¿Cliente es entidad gubernamental?       → Troubleshoot Meta Business Verification for Government Entity
├── ¿Portafolio atascado en "In Review"?     → Troubleshoot Meta Business Verification
└── ¿Vambe está gestionando la verificación? → Partner-led Business Verification for WhatsApp

¿El problema es el Embedded Signup?
├── ¿Migración de número SMB a API?          → Embedded Signup - Coexistence Onboarding
├── ¿Número bajo flujo MSC?                  → Embedded Signup - MSC Onboarding
├── ¿Offboarding de número MSC?              → Embedded Signup - MSC Offboarding
└── ¿Flujo general de ES roto?               → Embedded Signup

¿El problema es una decisión de Meta?
├── ¿Rechazaron el acceso API?               → Appeal API Onboarding Decision
└── ¿App pendiente de aprobación?            → App Review

¿El onboarding simplemente no avanza?        → Onboarding Status Pending
```

---

## ⚠️ Subcategorías de `WABiz: Phone Number & Registration` — Campo obligatorio "Tipo de solicitud"

Cuando el ticket usa la categoría `WABiz: Phone Number & Registration`, Meta muestra un segundo campo obligatorio: **Request type**. Siempre incluirlo en la entrega del ticket.

### Opciones disponibles y cuándo usar cada una:

| Request type | Cuándo usarla |
|--------------|---------------|
| `Request access to pre-verified phone number API` | El cliente quiere usar un número de teléfono que ya fue verificado previamente en otra plataforma o sistema, y necesita acceso vía API |
| `Appeal Display Name Rejection` | **Muy usada.** Meta rechazó el Display Name propuesto y el cliente quiere apelar esa decisión |
| `Certificate Not Available From Business Manager` | El certificado necesario para registrar el número no aparece disponible en Business Manager (problema frecuente en migraciones o cuentas con inconsistencias) |
| `Change Display Name (non Official Business Account)` | El cliente quiere cambiar el nombre visible de su WhatsApp Business y la cuenta NO tiene check verde (OBA). Para cuentas con OBA, el proceso es diferente |
| `Lost 2FA code` | El cliente perdió el PIN de verificación en dos pasos (2FA) de su número de WhatsApp Business y no puede acceder |
| `Phone Migration` | Migración de un número de teléfono: entre BMs, entre BSPs, de On-Premises a Cloud API, o de SMB a API |
| `Provide IVR Voice Call Phone Numbers` | El cliente necesita números de teléfono IVR (Interactive Voice Response) para flujos de llamadas de voz en lugar de mensajes de texto |
| `Registration Issues` | El número no puede completar el proceso de registro en WhatsApp Business API: errores durante el registro, OTP que no llega al registrar, número que queda en estado "pending registration" |

### Árbol de decisión rápido para `WABiz: Phone Number & Registration`:

```
¿El problema es el Display Name?
├── ¿Meta rechazó el nombre propuesto?               → Appeal Display Name Rejection
└── ¿El cliente quiere cambiar el nombre (sin OBA)?  → Change Display Name (non Official Business Account)

¿El problema es una migración de número?
├── ¿Migración entre BMs / BSPs / On-Prem → Cloud?  → Phone Migration
└── ¿Migración SMB → API (coexistencia)?             → Phone Migration

¿El problema es el registro del número?
├── ¿Error durante el registro / OTP no llega?       → Registration Issues
├── ¿Certificado no disponible en BM?                → Certificate Not Available From Business Manager
└── ¿Número pre-verificado en otra plataforma?       → Request access to pre-verified phone number API

¿El problema es el PIN 2FA?
└── ¿Perdió el código 2FA del número?                → Lost 2FA code

¿El cliente necesita números IVR para voz?           → Provide IVR Voice Call Phone Numbers
```

### Mapeo directo de casos reales de Vambe:

| Caso real | Request type correcto |
|-----------|----------------------|
| Americar/Clicar — Display Name "Verificación Clicar" rechazado | `Appeal Display Name Rejection` |
| Segmail — Display Name visible en perfil pero no en chat | `Appeal Display Name Rejection` |
| Ceón Santiago — foto perdida tras migración coexistencia | `Phone Migration` |
| U. Andes — número SMB atrapado, no puede migrar a API | `Phone Migration` |
| Cualquier número que no completa el registro inicial | `Registration Issues` |

---

## ⚠️ Formulario especial de `WABiz: Request Outbound Load Testing` — Campos obligatorios

Esta categoría **no tiene un dropdown de Tipo de solicitud**. En su lugar, Meta despliega un formulario estructurado con campos específicos que deben completarse. Es la única categoría con este comportamiento — siempre entregar todos los campos al usuario.

### Campos del formulario (en orden de aparición):

| Campo | Tipo | Obligatorio | Qué poner |
|-------|------|-------------|-----------|
| `Título` | Texto libre | ✅ Sí | Nombre descriptivo del test: ej. `Load Test – [Cliente] – [Número] – [Fecha]` |
| `Descripción` | Texto libre | ✅ Sí | Contexto del test: volumen esperado, tipo de mensajes, caso de uso del cliente |
| `Session start time` | Fecha (dd/mm/aaaa) | ⚪ Opcional | Fecha propuesta del test. Meta pide mínimo **2 días hábiles** desde el envío del ticket para preparación. Si no hay fecha definida, dejar vacío |
| `Session Length (in mins)` | Número | ✅ Sí | Duración estimada de la sesión de prueba en minutos |
| `Email addresses of people who will join the session` | Emails separados por coma | ✅ Sí | Emails del equipo técnico de Vambe + equipo del cliente que participará en la sesión de VC con ingenieros de Meta |
| `Plataforma` | Radio button | ✅ Sí | `On Premise` (API cliente local) o `Cloud API (Beta)` — seleccionar según la integración del cliente |
| `Please specify your reason for load testing` | Texto libre | ✅ Sí | Justificación del test: ej. lanzamiento de campaña masiva, onboarding de cliente de alto volumen, migración de plataforma |
| `Archivos adjuntos` | Archivo | ⚪ Opcional | Documentación técnica de respaldo: specs de integración, estimados de volumen, historial de mensajería |

### Reglas críticas para este formulario:

1. **Mínimo 2 días hábiles de anticipación** — Meta configura una videollamada (VC) entre su equipo de ingeniería y el equipo del cliente. No se puede pedir para mañana.
2. **Emails reales y activos** — Los participantes recibirán una invitación de VC de parte de Meta. Siempre incluir al menos un email técnico de Vambe.
3. **Plataforma correcta** — Si el cliente usa Cloud API (la mayoría de los casos nuevos), seleccionar `Cloud API (Beta)`. Si aún usa la API On-Premises (cliente local instalado), seleccionar `On Premise`.
4. **El campo Título aparece como Subject** en la queue de Meta — hacerlo descriptivo para que el agente entienda el caso sin leer la descripción.

### Plantilla de entrega para Load Testing:

```
═══════════════════════════════════════════
CATEGORÍA META A SELECCIONAR:
WABiz: Request Outbound Load Testing

⚠️ Esta categoría no tiene Tipo de solicitud.
   Completar el formulario con los siguientes campos:
═══════════════════════════════════════════
TÍTULO:
Load Test – [Nombre cliente] – [Phone Number ID] – [Fecha propuesta]

DESCRIPCIÓN:
[Contexto: volumen esperado de mensajes, tipo de contenido,
caso de uso, integración actual del cliente]

SESSION START TIME:
[dd/mm/aaaa — mínimo 2 días hábiles desde hoy]

SESSION LENGTH (mins):
[Duración estimada — típicamente 60 o 120 minutos]

EMAILS (separados por coma):
[email-vambe@vambe.ai], [email-tecnico@cliente.com]

PLATAFORMA:
☑ Cloud API (Beta)   ó   ☑ On Premise
[Marcar la que corresponde]

REASON FOR LOAD TESTING:
[Justificación: lanzamiento de campaña / onboarding alto volumen /
migración de plataforma / otro]
═══════════════════════════════════════════
```

---

## ⚠️ Formulario especial de `WABiz: Request or Update an Official Business Account` — Campos obligatorios

Esta categoría tiene un **formulario estructurado propio** y un aviso crítico de Meta al inicio del modal.

### ⚠️ Aviso de Meta antes de abrir el formulario:

> *"Las solicitudes de una cuenta de empresa oficial (OBA) deben enviarse al administrador de WhatsApp."*
> Botón disponible: **"Ir al administrador de WhatsApp"**

**Qué significa en la práctica:** Meta recomienda gestionar la solicitud de OBA (check verde) directamente desde el WhatsApp Manager antes de abrir un ticket. Si el flujo del Manager falla o no está disponible para el cliente, entonces se usa este formulario como canal alternativo. **Siempre intentar primero por WhatsApp Manager.**

### Tipo de solicitud (radio button — 2 opciones):

| Tipo | Cuándo usarlo |
|------|---------------|
| `Request an OBA` | El cliente quiere obtener el check verde (Official Business Account) por primera vez |
| `Update OBA Display Name` | El cliente ya tiene OBA y quiere cambiar el nombre visible. **Distinto al Display Name normal** — las cuentas OBA tienen un proceso de actualización separado |

### Campos del formulario:

| Campo | Tipo | Obligatorio | Qué poner |
|-------|------|-------------|-----------|
| `Tipo de solicitud` | Radio button | ✅ Sí | `Request an OBA` o `Update OBA Display Name` |
| `Cuenta de WhatsApp` | Texto | ✅ Sí | Nombre o ID de la cuenta de WhatsApp Business del cliente |
| `Número de teléfono` | Selector | ✅ Sí | Seleccionar el número de WhatsApp Business válido desde el dropdown. Debe estar registrado y activo |
| `Two Factor Authentication Check` | Texto | ✅ Sí | Confirmación de que el 2FA del número está activo y el cliente tiene acceso al PIN. Meta verifica esto antes de aprobar OBA |
| `Business Verification Check` | Texto | ✅ Sí | Confirmación de que el portafolio tiene Business Verification completada. Sin verificación aprobada, Meta no procesa solicitudes OBA |
| `If the business is known under any other names` | Texto | ⚪ Opcional | Nombres alternativos, marcas secundarias o nombres comerciales distintos al nombre legal. Útil cuando el nombre de WhatsApp difiere del nombre legal del BM |
| `If the business name is in a language other than English` | Texto | ⚪ Opcional | Si el nombre del negocio está en español, portugués u otro idioma, proveer transliteración o traducción al inglés. Ayuda al equipo de Meta a encontrar la marca en bases de datos internacionales |
| `Archivos adjuntos` | Archivo | ⚪ Opcional | Evidencia de legitimidad de la marca: cobertura de medios, sitio web oficial, registros de marca, documentación corporativa |

### Reglas críticas para OBA:

1. **Business Verification debe estar aprobada** antes de solicitar OBA. Si no está verificado, el ticket será rechazado automáticamente.
2. **2FA debe estar activo** en el número. Meta lo verifica como control de seguridad antes de otorgar el check verde.
3. **Intentar primero por WhatsApp Manager** — el botón "Ir al administrador de WhatsApp" es el canal preferido de Meta. El ticket es el canal de escalación cuando el Manager no funciona.
4. **Update OBA Display Name ≠ Change Display Name normal** — las cuentas OBA tienen restricciones adicionales sobre el nombre que no aplican a cuentas estándar. Meta revisa la coherencia entre el nombre OBA y la identidad pública de la marca.
5. **Los nombres alternativos importan** — si la marca es conocida por un nombre distinto al legal (ej: "Coca-Cola" vs "The Coca-Cola Company"), incluirlo en el campo opcional aumenta las chances de aprobación.

### Plantilla de entrega para OBA:

```
═══════════════════════════════════════════
CATEGORÍA META A SELECCIONAR:
WABiz: Request or Update an Official Business Account

⚠️ ANTES DE ABRIR EL TICKET:
   Intentar primero desde WhatsApp Manager → botón
   "Request Official Business Account". El ticket es
   el canal de escalación si el Manager falla.
───────────────────────────────────────────
TIPO DE SOLICITUD:
☑ Request an OBA   ó   ☑ Update OBA Display Name
[Marcar el que corresponde]

CUENTA DE WHATSAPP:
[Nombre o ID de la cuenta]

NÚMERO DE TELÉFONO:
[Phone Number ID — debe estar registrado y activo]

TWO FACTOR AUTHENTICATION CHECK:
2FA is active on this number. The account admin has
confirmed access to the PIN.

BUSINESS VERIFICATION CHECK:
Business Portfolio [BM ID] has completed Meta Business
Verification [since fecha]. Status: Verified.

NOMBRES ALTERNATIVOS (si aplica):
[Nombres comerciales o marcas secundarias]

NOMBRE EN IDIOMA ORIGINAL (si aplica):
[Nombre en español/otro idioma + transliteración]

ARCHIVOS ADJUNTOS (recomendado):
[Cobertura de medios, sitio web oficial, registro de marca]
═══════════════════════════════════════════
```

---

## ⚠️ Subcategorías de `WABiz: Usernames API Integration` — Campo obligatorio "Tipo de solicitud"

Cuando el ticket usa la categoría `WABiz: Usernames API Integration`, Meta muestra un segundo campo obligatorio: **Tipo de solicitud**. Siempre incluirlo en la entrega del ticket.

Esta categoría cubre todo lo relacionado con **BSUID** (Business Solution User ID) y los **usernames de WhatsApp** — identificadores únicos que permiten a los usuarios encontrar y contactar a un negocio sin necesidad de número de teléfono.

### Opciones disponibles y cuándo usar cada una:

| Tipo de solicitud | Cuándo usarla |
|-------------------|---------------|
| `BSUID API Integration` | El cliente está integrando o tiene problemas con el BSUID en su implementación de la API. Incluye errores de autenticación por BSUID, configuración inicial y problemas de reconocimiento del identificador |
| `Webhook Issues` | Los webhooks vinculados al sistema de Usernames/BSUID no llegan, llegan con retraso o con datos incorrectos. Distinto de `WABiz: Cloud API → Bug or Implementation Issue` — este es específico del sistema de usernames |
| `Username Update` | El cliente quiere cambiar o actualizar su username de WhatsApp Business (el identificador tipo @nombre que aparece en el perfil) |
| `Temporarily Opt-Out from BSUID Webhook` | El cliente necesita desactivar temporalmente los webhooks del BSUID — por mantenimiento, migración técnica o debugging — sin eliminar la configuración permanentemente |
| `Reinstate BSUID from Webhook` | El cliente quiere reactivar los webhooks del BSUID después de un opt-out temporal. Complementario al tipo anterior |

### Árbol de decisión rápido para `WABiz: Usernames API Integration`:

```
¿El problema es con la integración del BSUID en la API?
└── ¿Errores de autenticación / configuración BSUID?     → BSUID API Integration

¿El problema es con los webhooks del sistema de usernames?
├── ¿Webhooks no llegan o llegan mal?                    → Webhook Issues
├── ¿Necesita desactivar webhooks temporalmente?         → Temporarily Opt-Out from BSUID Webhook
└── ¿Necesita reactivar webhooks después de opt-out?     → Reinstate BSUID from Webhook

¿El problema es el username visible del negocio?
└── ¿Quiere cambiar el @username de WhatsApp Business?   → Username Update
```

### Nota sobre BSUID:

El **BSUID (Business Solution User ID)** es el identificador único que Meta asigna a los BSPs como Vambe para gestionar cuentas en nombre de sus clientes. Los problemas de BSUID generalmente afectan a múltiples clientes simultáneamente — si un cliente reporta un error de BSUID, verificar si otros clientes del portafolio tienen el mismo síntoma antes de abrir el ticket.

---

## ⚠️ Formulario + Subcategorías de `WhatsApp Tech Provider: Onboarding`

> **Recordatorio:** Vambe opera como BSP. Esta categoría aplica solo si Vambe tiene registro formal como Tech Provider. Documentada por completitud y casos excepcionales.

Esta categoría es **híbrida con comportamiento dinámico**: tiene un formulario base con campos fijos, y cuando se selecciona cualquier opción `Embedded Signup` en el dropdown, aparecen **campos adicionales específicos** de debugging técnico.

### Formulario base — campos que siempre aparecen:

| Campo | Tipo | Obligatorio | Qué poner |
|-------|------|-------------|-----------|
| `Título` | Texto libre | ✅ Sí | Nombre descriptivo — actúa como Subject en la queue |
| `Description` | Texto libre | ✅ Sí | "Briefly describe the problem you are having." |
| `Tipo de solicitud` | Dropdown | ✅ Sí | Ver opciones abajo |
| `WhatsApp Account ID` | Texto | ⚪ Opcional | WABA ID del cliente afectado |
| `Número de teléfono` | Texto | ⚪ Opcional | Phone Number ID afectado |
| `Issue Observed By` | Radio button | ✅ Sí | `Issue observed by the end-client issue` (el cliente final reportó el problema) o `Issue observed by the partner issue` (Vambe/Tech Provider detectó el problema) |
| `Archivos adjuntos` | Archivo | ⚪ Opcional | Capturas, logs, evidencia del error |

### Tipos de solicitud — dropdown:

| Tipo de solicitud | Cuándo usarla |
|-------------------|---------------|
| `Troubleshoot Meta Business Verification` | Verificación del portafolio atascada o con errores bajo gestión Tech Provider |
| `Appeal API Onboarding Decision` | Meta rechazó el acceso a la API y el Tech Provider quiere apelar |
| `App Review Questions/Issues` | Dudas o problemas durante el proceso de App Review de una integración |
| `Embedded Signup Issues` | **Abre campos extra.** Problemas generales en el flujo de Embedded Signup |
| `Embedded Signup - Coexistence Onboarding` | **Abre campos extra.** Migración de número SMB a API con errores durante la coexistencia |
| `Embedded Signup - MSC Onboarding` | **Abre campos extra.** Onboarding de número bajo flujo MSC |
| `Embedded Signup - MSC Offboarding` | **Abre campos extra.** Desconexión o migración fuera de número MSC |

### ⚡ Campos adicionales — aparecen SOLO al seleccionar cualquier opción `Embedded Signup`:

Cuando el Tipo de solicitud es cualquiera de las 4 opciones Embedded Signup, el formulario expande y muestra campos técnicos de debugging:

| Campo extra | Tipo | Obligatorio | Qué poner |
|-------------|------|-------------|-----------|
| `Partner App Id` | Texto | ✅ Sí | ID de la app del partner/Tech Provider registrada en Meta for Developers |
| `End Client BM ID` | Texto | ⚪ Opcional | Business Manager ID del cliente final que está haciendo el onboarding |
| `Timestamp` | Fecha (dd/mm/aaaa) | ✅ Sí | Fecha exacta en que ocurrió el error o se detectó el problema |
| `Session Id` | Texto | ⚪ Opcional | ID de la sesión de Embedded Signup donde ocurrió el error (se obtiene de los logs de la integración) |
| `Oauth Url` | Texto | ⚪ Opcional | URL de OAuth usada durante el flujo de Embedded Signup donde ocurrió el error |
| `Issue Observed By` | Radio button | ✅ Sí | `Issue observed by the end-client issue` o `Issue observed by the partner issue` |
| `Would you like to start a chat session with our support team?` | Dropdown | ✅ Sí | Opción para iniciar chat directo con soporte de Meta. Seleccionar según urgencia del caso |

### Árbol de decisión rápido para `WhatsApp Tech Provider: Onboarding`:

```
¿El problema es la verificación del BM?
└── ¿Portafolio atascado en "In Review"?              → Troubleshoot Meta Business Verification

¿El problema es una decisión de Meta?
├── ¿Rechazaron acceso API al Tech Provider?           → Appeal API Onboarding Decision
└── ¿Preguntas o problemas en App Review?              → App Review Questions/Issues

¿El problema es el Embedded Signup? (abre campos extra)
├── ¿Flujo general de ES roto?                         → Embedded Signup Issues
├── ¿Migración número SMB a API (coexistencia)?        → Embedded Signup - Coexistence Onboarding
├── ¿Onboarding número bajo MSC?                       → Embedded Signup - MSC Onboarding
└── ¿Offboarding de número MSC?                        → Embedded Signup - MSC Offboarding
```

### Campo crítico — `Issue Observed By`:

Este campo define cómo Meta clasifica internamente el origen del problema:

| Valor | Cuándo usarlo | Impacto |
|-------|--------------|---------|
| `Issue observed by the end-client issue` | El cliente final reportó el error al intentar hacer el signup | Meta orienta la investigación hacia la experiencia del usuario final |
| `Issue observed by the partner issue` | Vambe/Tech Provider detectó el error en sus sistemas o logs | Meta orienta la investigación hacia la integración técnica del partner |

**Regla práctica:** Si el usuario final dijo "no pude completar el registro", usar `end-client`. Si los logs de Vambe muestran un error antes de que el usuario llegue al paso problemático, usar `partner`.

### Plantilla de entrega para Embedded Signup Issues:

```
═══════════════════════════════════════════
CATEGORÍA: WhatsApp Tech Provider: Onboarding

TÍTULO:
[Embedded Signup Issue] – [Cliente] – [Fecha]

DESCRIPTION:
[Descripción técnica del problema]

TIPO DE SOLICITUD:
Embedded Signup Issues
(o Coexistence / MSC Onboarding / MSC Offboarding según aplique)

── CAMPOS ADICIONALES (se activan al seleccionar Embedded Signup) ──

PARTNER APP ID:
[App ID del Tech Provider en Meta for Developers]

END CLIENT BM ID:
[BM ID del cliente final — si disponible]

TIMESTAMP:
[dd/mm/aaaa — fecha del error]

SESSION ID:
[Session ID del ES si está disponible en logs]

OAUTH URL:
[URL de OAuth del flujo donde ocurrió el error]

ISSUE OBSERVED BY:
☑ Issue observed by the end-client issue
☑ Issue observed by the partner issue
[Marcar el que corresponde]

WHATSAPP ACCOUNT ID: [WABA ID si aplica]
NÚMERO DE TELÉFONO: [Phone Number ID si aplica]
═══════════════════════════════════════════
```

---

## ⚠️ Formulario + Subcategorías de `WhatsApp Tech Provider: Account & WABA`

> **Recordatorio:** Vambe opera como BSP, no como Tech Provider registrado. Esta categoría solo aplica si Vambe tiene registro formal como Tech Provider. Documentada aquí por completitud y para casos excepcionales.

Esta categoría es **híbrida**: tiene un formulario con campos propios **Y** un dropdown de Tipo de solicitud dentro del mismo modal.

### Campos del formulario (aparecen antes del dropdown):

| Campo | Tipo | Obligatorio | Qué poner |
|-------|------|-------------|-----------|
| `Título` | Texto libre | ✅ Sí | Nombre descriptivo del caso — actúa como Subject en la queue |
| `Description` | Texto libre | ✅ Sí | "Briefly describe the problem you are having." — descripción técnica del problema |
| `Tipo de solicitud` | Dropdown | ✅ Sí | Ver opciones abajo |
| `Archivos adjuntos` | Archivo | ⚪ Opcional | Documentación de respaldo del caso |

### ⚠️ Aviso de Meta sobre límite de números de teléfono:

> *"In order to review your request for a phone limit increase, we need a valid, registered, and active phone number. If you do not see your phone number when searching, you may need to select a different WhatsApp Business Account that has the valid phone number associated with it."*

Este aviso aparece cuando el Tipo de solicitud involucra un aumento de límite de números. El número seleccionado debe estar **registrado y activo** — no sirve un número en estado pending o desactivado.

### Tipos de solicitud disponibles (dropdown):

| Tipo de solicitud | Cuándo usarla |
|-------------------|---------------|
| `Report Abuse` | La cuenta del cliente está siendo víctima de abuso externo (suplantación, spam dirigido, acceso no autorizado desde afuera) |
| `Report a Security Breach` | Compromiso de seguridad activo en la cuenta — tokens filtrados, acceso malicioso confirmado |
| `Appeal Business Ban Decision` | WABA o BM desactivado/baneado bajo gestión Tech Provider — apelar la decisión |
| `Account Activity Issues` | Problemas con la actividad de la cuenta que no encajan en las otras categorías: comportamiento inesperado, estados inconsistentes, flags sin explicación |

### Diferencia clave con `WABiz: Account & WABA`:

| Aspecto | `WABiz: Account & WABA` | `WhatsApp Tech Provider: Account & WABA` |
|---------|------------------------|------------------------------------------|
| Quién lo usa | BSP (Vambe) | Tech Provider registrado formalmente en Meta |
| Queue destino | Agentes de BSP | Agentes de Tech Provider |
| Tipos disponibles | 7 opciones | 4 opciones (subset) |
| Formulario | Solo dropdown | Formulario con Título + Description + Dropdown |
| Casos de uso | Gestión diaria de clientes | Casos técnicos de plataforma |

---

## ⚠️ Subcategorías de `WhatsApp Tech Provider: Phone Number & Registration` — Campo obligatorio "Tipo de solicitud"

> **Recordatorio:** Vambe opera como BSP. Esta categoría aplica solo si Vambe tiene registro formal como Tech Provider.

### Tipos de solicitud disponibles (3 opciones — subset de WABiz):

| Tipo de solicitud | Cuándo usarla |
|-------------------|---------------|
| `Change Display Name (non Official Business Account)` | El cliente quiere cambiar el nombre visible y la cuenta NO tiene check verde (OBA) |
| `Appeal Display Name Rejection` | Meta rechazó el Display Name propuesto y el cliente quiere apelar |
| `Registration Issues` | El número no puede completar el registro en WhatsApp Business API — errores durante el registro, OTP que no llega, número en estado "pending registration" |

### Diferencia con `WABiz: Phone Number & Registration`:

| `WABiz: Phone Number & Registration` (8 tipos) | `WhatsApp Tech Provider: Phone Number & Registration` (3 tipos) |
|------------------------------------------------|-----------------------------------------------------------------|
| `Appeal Display Name Rejection` ✅ | `Appeal Display Name Rejection` ✅ |
| `Change Display Name (non OBA)` ✅ | `Change Display Name (non OBA)` ✅ |
| `Registration Issues` ✅ | `Registration Issues` ✅ |
| `Phone Migration` ✅ | ❌ No disponible |
| `Lost 2FA code` ✅ | ❌ No disponible |
| `Certificate Not Available From BM` ✅ | ❌ No disponible |
| `Request access to pre-verified number API` ✅ | ❌ No disponible |
| `Provide IVR Voice Call Phone Numbers` ✅ | ❌ No disponible |

**Regla práctica:** Si el caso involucra migración de número, 2FA perdido o certificado faltante, usar `WABiz: Phone Number & Registration` — esos tipos no existen en la versión Tech Provider.

---

## ⚠️ Formulario + Subcategorías de `WhatsApp Tech Provider: Usernames API Integration`

> **Recordatorio:** Vambe opera como BSP. Esta categoría aplica solo si Vambe tiene registro formal como Tech Provider.

Esta categoría es **híbrida**: tiene Título + Description como campos de texto libre + dropdown de Tipo de solicitud — igual al patrón de `WhatsApp Tech Provider: Account & WABA`.

### Campos del formulario:

| Campo | Tipo | Obligatorio | Qué poner |
|-------|------|-------------|-----------|
| `Título` | Texto libre | ✅ Sí | Nombre descriptivo — actúa como Subject en la queue |
| `Description` | Texto libre | ✅ Sí | Descripción técnica del problema |
| `Tipo de solicitud` | Dropdown | ✅ Sí | Ver opciones abajo |
| `Archivos adjuntos` | Archivo | ⚪ Opcional | Logs, capturas, evidencia técnica |

### Tipos de solicitud disponibles (5 opciones — idénticos a WABiz):

| Tipo de solicitud | Cuándo usarla |
|-------------------|---------------|
| `BSUID API Integration` | Problemas con la integración del BSUID en la API del Tech Provider |
| `Webhook Issues` | Webhooks del sistema de usernames/BSUID que no llegan o llegan con datos incorrectos |
| `Username Update` | Cambiar el @username de WhatsApp Business del cliente |
| `Temporarily Opt-Out from BSUID Webhook` | Desactivar temporalmente los webhooks BSUID (mantenimiento, debugging, migración) |
| `Reinstate BSUID from Webhook` | Reactivar los webhooks BSUID después de un opt-out temporal |

### Diferencia con `WABiz: Usernames API Integration`:

| Aspecto | `WABiz: Usernames API Integration` | `WhatsApp Tech Provider: Usernames API Integration` |
|---------|-----------------------------------|-----------------------------------------------------|
| Tipos disponibles | 5 (mismos) | 5 (mismos) |
| Formulario | Solo dropdown | Formulario híbrido: Título + Description + Dropdown |
| Queue destino | Agentes de BSP | Agentes de Tech Provider |

**Los 5 tipos son idénticos** en ambas categorías. La diferencia está únicamente en el formulario (Tech Provider añade Título + Description) y en la queue de agentes a la que va el ticket.

---

## Matriz de decisión rápida para `WABiz:`

| Síntoma del cliente | Categoría | Tipo de solicitud |
|---------------------|-----------|-------------------|
| WABA desactivada al crearla (false positive) | `WABiz: Account & WABA` | `Appeal Business Ban Decision` |
| WABA baneada después de enviar mensajes | `WABiz: Account & WABA` | `Appeal Business Ban Decision` |
| BM restringido / "not eligible for advertising" | `WABiz: Account & WABA` | `Appeal Business Ban Decision` |
| WABA desactivada por Commerce Policy confundida | `WABiz: Account & WABA` | `Appeal Business Ban Decision` |
| System User Token revocado / permisos de mensajería perdidos | `WABiz: Account & WABA` | `Unexpected System Token or Messaging Permission Loss` |
| Reset de cuenta (cambio de BSP, migración de partner) | `WABiz: Account & WABA` | `On-Behalf-Of Resets` |
| Cliente alcanzó límite de tier de mensajería | `WABiz: Account & WABA` | `Messaging Limits` |
| Cuenta de cliente comprometida / tokens filtrados | `WABiz: Account & WABA` | `Report a Security Breach` |
| Abuso hacia la cuenta del cliente | `WABiz: Account & WABA` | `Report Abuse` |
| Template rechazado y no hay botón de appeal en UI | `WABiz: Message Templates` | — |
| Verification stuck por semanas | `WABiz: Onboarding` | `Troubleshoot Meta Business Verification` |
| Verification stuck — entidad gubernamental | `WABiz: Onboarding` | `Troubleshoot Meta Business Verification for Government Entity` |
| Embedded Signup no avanza | `WABiz: Onboarding` | `Embedded Signup` |
| Error al migrar número SMB a API (coexistencia) | `WABiz: Onboarding` | `Embedded Signup - Coexistence Onboarding` |
| Onboarding en estado pendiente +7 días | `WABiz: Onboarding` | `Onboarding Status Pending` |
| Vambe verifica en nombre del cliente | `WABiz: Onboarding` | `Partner-led Business Verification for WhatsApp` |
| Meta rechazó acceso API durante onboarding | `WABiz: Onboarding` | `Appeal API Onboarding Decision` |
| Display Name rechazado / Meta rechazó nombre propuesto | `WABiz: Phone Number & Registration` | `Appeal Display Name Rejection` |
| Cambiar Display Name (cuenta sin check verde) | `WABiz: Phone Number & Registration` | `Change Display Name (non Official Business Account)` |
| Migración de número (entre BMs, BSPs, SMB → API) | `WABiz: Phone Number & Registration` | `Phone Migration` |
| Número no completa registro / OTP no llega al registrar | `WABiz: Phone Number & Registration` | `Registration Issues` |
| Certificado no disponible en Business Manager | `WABiz: Phone Number & Registration` | `Certificate Not Available From Business Manager` |
| Cliente perdió PIN 2FA del número | `WABiz: Phone Number & Registration` | `Lost 2FA code` |
| Número pre-verificado en otra plataforma | `WABiz: Phone Number & Registration` | `Request access to pre-verified phone number API` |
| Cloud API devuelve 500/timeout consistente | `WABiz: Cloud API` | `Bug or Implementation Issue` |
| Webhook no llega / mensajes no se envían | `WABiz: Cloud API` | `Bug or Implementation Issue` |
| WhatsApp Flow no renderiza o falla submit | `WABiz: Cloud API` | `Issues with WhatsApp Flows` |
| Migración On-Premises → Cloud API con errores | `WABiz: Cloud API` | `On-Premises API -> Cloud API Migration Issues` |
| Sincronización SMB ↔ API rota en coexistencia | `WABiz: Cloud API` | `Coexistence Data Synchronization APIs and Webhooks` |
| Activar No Storage Solution | `WABiz: Cloud API` | `Request to use Cloud API No Storage Solution` |
| Local Storage para medios en infra propia | `WABiz: Cloud API` | `Cloud API Local Storage` |
| OTP no llega al usuario final | `WABiz: OTP Delivery Issues` | — |
| Solicitar check verde (OBA) por primera vez | `WABiz: Request or Update an Official Business Account` | ⚠️ Formulario especial. Tipo: `Request an OBA`. Intentar primero por WhatsApp Manager |
| Actualizar nombre de cuenta OBA (check verde) | `WABiz: Request or Update an Official Business Account` | ⚠️ Formulario especial. Tipo: `Update OBA Display Name` |
| Load test para número de alto volumen | `WABiz: Request Outbound Load Testing` | ⚠️ Formulario especial — ver sección dedicada. No tiene Tipo de solicitud |
| Problemas de facturación del cliente | `WABiz: Billing, Credit & Pricing` | — |
| Marketing message flow roto (Open Beta) | `WABiz: Marketing Messages` | — |
| Error de integración BSUID en la API | `WABiz: Usernames API Integration` | `BSUID API Integration` |
| Webhooks de usernames/BSUID no llegan | `WABiz: Usernames API Integration` | `Webhook Issues` |
| Cambiar @username de WhatsApp Business | `WABiz: Usernames API Integration` | `Username Update` |
| Desactivar webhooks BSUID temporalmente | `WABiz: Usernames API Integration` | `Temporarily Opt-Out from BSUID Webhook` |
| Reactivar webhooks BSUID tras opt-out | `WABiz: Usernames API Integration` | `Reinstate BSUID from Webhook` |
