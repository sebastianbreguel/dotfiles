# Ejemplos de referencia — tickets que recibieron prioridad URGENTE 24hr

Estos tickets reales fueron aprobados con prioridad máxima por Meta Support. Úsalos como plantilla estructural. Las decisiones de copy están validadas.

## Por qué funcionan

1. **Subject preciso**: problema + cliente + BM ID en una sola línea
2. **Framing fuerte**: "evident automated detection error" desde el primer párrafo
3. **Evidencia técnica en lista**: cada bullet es un hecho verificable que prueba no-violación
4. **Contexto del cambio reciente**: identifica el probable trigger del false positive
5. **Legitimidad del negocio con prueba externa**: acreditaciones, reconocimiento oficial, fecha de verificación
6. **Un solo ask claro**: human review, no múltiples peticiones
7. **Cierre que invita documentación**: reduce fricción con el agente
8. **Preguntas numeradas al final**: cuando el caso requiere respuesta comprometida del agente, cierra con 3–4 preguntas específicas que obligan a contestar antes de cerrar el ticket

---

## Ejemplo 1 — Clínica Flow (salud — false positive clásico)

**SUBJECT:**
```
Appeal – WABA Immediately Disabled Upon Creation | Clínica Flow | BM 260226476319005
```

**BODY:**
```
Dear WhatsApp Business Support Team,

We are writing on behalf of our client Clínica Flow to request a review of the situation currently affecting their WhatsApp Business accounts.

Business Portfolio ID: 260226476319005
Business Verification Status: Verified since November 2025
Affected WABA IDs:
- 1231182432554276
- 165284763326596

The basis of our appeal is an evident automated detection error. Every time we attempt to create a new WhatsApp Business Account under our client's verified Business Portfolio to connect a phone number via API, the account is immediately deactivated without giving us the opportunity to connect a phone number or perform any activity whatsoever.

At the time of each deactivation:
- No phone number had been connected
- No messages had been sent or received
- No templates had been submitted
- No API calls had been executed

It is technically impossible to have violated WhatsApp's policies without having initiated any activity.

RELEVANT CONTEXT:
Clínica Flow recently updated their business verification details as requested by Meta's review team. We believe this update may have inadvertently triggered an automated flag on the account, as the deactivations began immediately after completing that process.

ABOUT THE BUSINESS:
Clínica Flow is a legitimate, established business operating in full compliance with Meta's policies. Their Business Portfolio has been verified since November 2025 and has a clean history with no prior policy violations. Their intended use of WhatsApp Business API is strictly limited to official client communications, appointment notifications, and customer service — all fully aligned with Meta's permitted messaging categories.

We kindly ask that a human reviewer assess the status of the accounts listed above and help us restore normal account functionality so our client can proceed with their legitimate WhatsApp Business API onboarding. We are happy to provide any additional documentation that may support the review.

Thank you for your time and support.
```

---

## Ejemplo 2 — Universidad de los Andes Chile (educación — false positive + BM raíz)

**SUBJECT:**
```
WABA Immediately Disabled Upon Creation – Post-Verification False Positive | Universidad de los Andes Chile | BM 445406739156054
```

**BODY:**
```
Dear WhatsApp Business Support Team,

We are writing on behalf of our client Universidad de los Andes Chile, a higher education institution fully accredited and officially recognized by the Chilean Ministry of Education, to request a review of the situation affecting their WhatsApp Business onboarding process.

Affected Account IDs:
- 913998917647267
- 811775041685569
- 1398111305147351
- 118330764627766
- 1645357363452246
- 1261043866135825

The basis of our appeal is an evident automated detection error. Every time we attempt to create a new WhatsApp Business Account under our client's verified Business Portfolio, the account is immediately deactivated — without giving us the opportunity to connect a phone number or perform any activity whatsoever. Each attempt results in the same outcome: the account is disabled before we can even begin the setup process.

It is technically impossible to have violated WhatsApp's policies without having initiated any operation.

It is worth highlighting that Universidad de los Andes Chile's Business Portfolio has successfully completed Meta Business Verification, following an update of the business details requested by Meta's review team. This confirms the legitimacy of the entity and its commitment to full compliance with the platform's policies.

We would like to clarify the following points:

Nature of the business: Universidad de los Andes Chile is an established educational institution with an active student body and official recognition from the Chilean government.

Policy compliance: The intended use of WhatsApp Business API is exclusively for official academic communications with students, administrative notifications, and support channels for prospective applicants. All planned use cases have been internally reviewed and are fully aligned with Meta's permitted messaging categories.

Clean history: There is no record of any policy violation by this entity on the platform.

We kindly ask that a human reviewer assess the status of the accounts listed above and guide us on the steps needed to complete the onboarding process correctly. If helpful, we are happy to provide supporting documentation, such as the official university accreditation certificate issued by the Chilean Ministry of Education.

We appreciate your time and attention, and we look forward to any guidance that allows us to move forward.
```

---

## Ejemplo 3 — Clínica A:C2 / Dr. Patricio Andrades (salud — Commerce Policy confundida con agendamiento)

**Situación:** WABA desactivada por presunta violación de política sobre "productos médicos" cuando el uso era exclusivamente agendar citas. El crawler de Meta confundió el catálogo de servicios del sitio con e-commerce de productos. Otra WABA del mismo portafolio estaba activa (evidencia clave).

**SUBJECT:**
```
Appeal – WABA Disabled for Alleged Medical Products Policy Violation | Dr. Patricio Andrades Clinic | BM 227651957834497
```

**BODY:**
```
Dear WhatsApp Business Support Team,

We are writing on behalf of our client Clínica Dr. Patricio Andrades to appeal the deactivation of their WhatsApp Business Account (WABA ID: 1785379779107509).

Business Portfolio ID: 227651957834497
Business Verification Status: Verified
Affected WABA ID: 1785379779107509

The basis of our appeal is a misclassification by the automated review system. The deactivation notice references a violation of Meta's Commerce Policy regarding medical products. However, this classification does not reflect the actual nature of the business or its intended use of the WhatsApp Business API.

CRITICAL DISTINCTION — SERVICE PROVIDER, NOT PRODUCT SELLER:
- The business sells schedulable aesthetic medical treatments (appointments), not physical medical products.
- There is no e-commerce store, no product catalog, and no transaction of physical goods through WhatsApp.
- The intended API use is exclusively: appointment scheduling notifications, appointment reminders, and patient service support.

EVIDENCE SUPPORTING THE APPEAL:
- Another WABA under the same verified Business Portfolio (BM 227651957834497) is currently active and operational, indicating the portfolio itself is in compliance.
- The deactivation occurred upon creation, before any message was sent, any template was submitted, or any phone number was connected.
- It is technically impossible to have violated any policy without having initiated any operation.

We believe Meta's crawler may have scanned the clinic's website and misidentified the treatment catalog (professional services) as a medical product marketplace. These are categorically different: one is a licensed professional service provider, the other is a product retailer subject to Commerce Policy restrictions.

We respectfully ask that a human reviewer address the following:
1. Can a human reviewer confirm that aesthetic medical clinics offering appointment-based services fall within permitted WhatsApp Business API use cases?
2. Can the reviewer clarify which specific element triggered the Commerce Policy flag?
3. Can the deactivation of WABA 1785379779107509 be reversed based on the evidence above?
4. If additional documentation is required (business registration, professional medical license, service catalog), can the reviewer specify what is needed?

We are happy to provide any supporting documentation. Thank you for your time.
```

**Por qué funciona:** La distinción SERVICE PROVIDER vs PRODUCT SELLER en mayúsculas enmarca el argumento central. Las 4 preguntas numeradas al cierre impiden que el agente cierre el ticket con una respuesta genérica.

---

## Ejemplo 4 — Americar / Clicar (concesionaria — Display Name + Commerce Policy de vehículos)

**Situación:** Cambio de Display Name activó amenaza de desactivación por Commerce Policy (venta de vehículos usados). El sistema automatizado confundió a un dealer regulado y licenciado con un marketplace P2P entre particulares.

**SUBJECT:**
```
Appeal – Display Name Change Flagged Under Commerce Policy | Clicar (Americar) | BM 165878127532670
```

**BODY:**
```
Dear WhatsApp Business Support Team,

We are writing on behalf of our client Clicar (formerly registered as Americar) to appeal a Commerce Policy flag triggered by a Display Name update request for their WhatsApp Business Account.

Business Portfolio ID: 165878127532670
Affected WABA ID: 1809207119752600
Requested Display Name change: "Verificación Americar" → "Verificación Clicar"

NATURE OF THE ISSUE:
Following the submission of a Display Name update, our client received a notification suggesting their account may be subject to deactivation due to an alleged violation of Meta's Commerce Policy related to used vehicle sales.

APPEAL BASIS — PROFESSIONAL LICENSED DEALER vs. P2P MARKETPLACE:
Meta's Commerce Policy restricts peer-to-peer sales of used vehicles between private individuals. Clicar is not a P2P marketplace. It is a licensed, professional automotive dealership operating under full regulatory compliance.

Specifically:
- Clicar holds all required business licenses to operate as a professional used vehicle dealer.
- All transactions occur between the dealership (a registered legal entity) and end consumers — not between private individuals.
- The WhatsApp Business API use case is strictly limited to: appointment scheduling, sales inquiry responses, and official vehicle delivery notifications. No transactions are processed through WhatsApp.
- The sale of used vehicles by licensed professional dealers is NOT listed among Meta's prohibited commerce categories.

We respectfully request that a human reviewer:
1. Confirm that licensed professional automotive dealerships are permitted to use WhatsApp Business API for customer communications.
2. Review and approve the requested Display Name update from "Verificación Americar" to "Verificación Clicar."
3. Confirm that no deactivation action will be taken on this account pending this review.

We are prepared to provide the dealership's official business registration documents and regulatory licenses upon request.

Thank you for your attention.
```

---

## Ejemplo 5 — Circuito de Buenos Aires (verificación atascada — solicitar rechazo manual para resubmitir)

**Situación:** Verificación del portafolio atascada 2 veces. Meta identificó que el nombre legal no aparecía en el sitio web (requisito obligatorio). El cliente corrigió el sitio, pero no puede resubmitir mientras la solicitud activa está en "In Review". Solución: pedir que Meta rechace manualmente la solicitud activa.

**SUBJECT:**
```
Business Verification Stuck in Review – Manual Rejection Required to Resubmit | Circuito de Buenos Aires SA | BM 1230569271493036
```

**BODY:**
```
Dear WhatsApp Business Support Team,

We are writing on behalf of our client Circuito de Buenos Aires SA regarding their Business Portfolio verification, which has been stuck in "In Review" status for more than 14 days across two separate submission attempts.

Business Portfolio ID: 1230569271493036
WABA ID: 557082977488349
Current verification status: Stuck in "In Review" — second attempt

ROOT CAUSE IDENTIFIED:
Through our previous support interaction, we confirmed that the legal business name of Circuito de Buenos Aires SA was not appearing on their website in an indexable format, which prevented Meta's review system from confirming the entity. This has since been corrected — the legal name now appears prominently on the website in plain text format (not as image), fully accessible to Meta's crawler.

THE PROCESS BLOCKER:
The current active verification submission cannot be corrected or resubmitted by the client while it remains in "In Review" status. The system does not allow a new submission until the existing one is formally rejected. We are therefore requesting that this team manually reject the current pending submission so that our client can immediately resubmit with the corrected website.

SPECIFIC REQUEST:
1. Please manually reject the current pending verification submission for BM 1230569271493036.
2. Once rejected, our client will immediately resubmit with the legal name correctly and indexably displayed on their website.

We are ready to resubmit as soon as the rejection is processed. Thank you.
```

**Por qué funciona:** Explica el bug de proceso de Meta (no se puede resubmitir sin rechazo formal) y pide el workaround correcto de forma directa: rechazo manual. Esta es la solución no documentada que solo se obtiene vía soporte — el agente sabe exactamente qué hacer.

---

## Frases gancho reutilizables

Úsalas adaptadas al caso, no literales:

- `The basis of our appeal is an evident automated detection error.`
- `It is technically impossible to have violated WhatsApp's policies without having initiated any operation.`
- `This confirms the legitimacy of the entity and its commitment to full compliance with the platform's policies.`
- `We kindly ask that a human reviewer assess the status of the accounts listed above.`
- `If helpful, we are happy to provide supporting documentation, such as [doc específico].`
- `Their intended use of WhatsApp Business API is strictly limited to [use cases] — all fully aligned with Meta's permitted messaging categories.`
- `[Business name] is a SERVICE PROVIDER, not a [product/marketplace/seller]. This distinction is critical to the appeal.`
- `The deactivation occurred upon creation, before any message was sent, any template was submitted, or any phone number was connected.`
- `We believe Meta's automated system may have misidentified [X] as [Y]. These are categorically different.`
- `Please manually reject the current pending [verification/submission] so that our client can immediately resubmit with the corrected information.`

## Técnica de preguntas numeradas al cierre

Cuando el caso requiere que el agente se comprometa con una respuesta específica (no solo "we'll investigate"), cierra con 3–4 preguntas numeradas:

```
We respectfully request that a human reviewer address the following:
1. [Pregunta técnica específica sobre la causa del flag]
2. [Pregunta sobre el criterio que activó la restricción]
3. [Pregunta sobre el paso de resolución concreto]
4. [Pregunta sobre documentación requerida si aplica]
```

Un agente no puede cerrar el ticket sin contestar preguntas explícitamente numeradas. Esta técnica aumenta la calidad de respuesta y previene cierres genéricos con "your account was reviewed."

## Cita literal del rechazo + timeline + evidencia visual (campos nuevos)

Estos tres elementos van justo después del bloque de IDs y antes del "basis of appeal". Ejemplo de cómo se integran en el cuerpo:

```
The rejection message received states verbatim:
"Your business verification request was rejected because we could not confirm your legal business name."

CASE TIMELINE:
| # | Date       | Action taken                        | Meta's response                                          |
|---|------------|--------------------------------------|-----------------------------------------------------------|
| 1 | 2026-06-02 | Submitted verification (1st attempt) | "Rejected — legal business name not confirmed"             |
| 2 | 2026-06-10 | Updated website, resubmitted         | "Rejected — legal business name not confirmed" (identical) |

Attached: screenshot of the rejection message and screenshot of the website section showing the legal business name, for reference.
```

**Por qué importa:**
- La cita verbatim obliga al agente a responder sobre el criterio exacto que aplicó, no sobre una versión resumida que el equipo de Vambe interpretó.
- El timeline muestra que ya hubo rebotes con la misma respuesta — esto cambia el ángulo del ticket de "primer reporte" a "escalación con evidencia de que el fix aplicado no resolvió el criterio real de Meta", lo que suele apuntar a un caso de "dato presente mal leído" en vez de "dato faltante".
- Mencionar la evidencia visual adjunta desde el cuerpo del ticket evita que el agente pida capturas que ya tiene, ahorrando un ciclo de respuesta completo.

Si el caso solo tuvo un intento, omite la tabla de timeline — no la fuerces. La cita literal y la mención de evidencia visual sí van siempre.

## Formato de IDs

Siempre como lista vertical cuando hay más de uno:

```
Affected WABA IDs:
- 1231182432554276
- 165284763326596
```

No en prosa. Meta Support los copia literalmente para buscar en sus sistemas.
