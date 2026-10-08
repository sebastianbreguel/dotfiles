# Proceso de Contratos y NDAs — Guía Operativa Vambe

> 📋 **Guía completa en ClickUp:** https://app.clickup.com/9011788524/v/dc/8cj9yqc-82351/8cj9yqc-101131
> 📁 **Todos los formatos en Drive:** https://drive.google.com/drive/u/0/folders/1txQ4zE7n9sGXxMHDu8EVZ6pEM3eaLdRU

---

## ¿Quién puede firmar qué? — Estructura de poder interna

### Quién firma en nombre de Vambe

**NDAs:**
Los NDAs prefirmados de Vambe ya vienen firmados por los representantes legales. El vendedor **no firma NDAs** — el documento ya llega firmado desde el área legal. Solo tienes que enviarlo y recoger la firma del cliente.

**Contratos de servicio:**
La firma oficial de Vambe la tienen los representantes legales:
- **Nicolás Camhi** (RUT 19.638.472-3)
- **Cristóbal Verdugo Damm** (RUT 19.893.305-8)

Los vendedores, AEs y CS **no tienen poder para firmar contratos** en nombre de Vambe. Nunca firmar un contrato con tu nombre propio pensando que obliga a la empresa — no es así y puede crear problemas.

### ¿Quién firma por Vambe? — orden de prioridad

**Por defecto firma Cristóbal Verdugo Damm.**

Si Cristóbal no está disponible, puede firmarlo **Nicolás Camhi**. Si hay dudas sobre disponibilidad o urgencia → escríbele a Ricardo (ricardo.jungk@vambe.ai) para coordinar.

### ¿Cómo saco la firma de Vambe en un contrato?

Una vez que el documento esté listo y aprobado por ambas partes, **envía un correo a Ricardo Jungk** con el siguiente formato:

> **Para:** ricardo.jungk@vambe.ai
> **Asunto:** Solicitud Firma [nombre del cliente] con Vambe. [fecha]. [tipo de documento]
>
> Ejemplo: *Solicitud Firma Empresa ABC con Vambe. 17/06/2026. Contrato de Servicio L*

Adjunta el documento final. Ricardo coordina la firma con Cristóbal o Nicolás según disponibilidad.

### Personería de Cristóbal Verdugo Damm

Cuando un cliente pida acreditar la representación de Cristóbal, la respuesta depende de la entidad contratante:

**Para contratos con Vambe SpA (Chile):**
> *"La personería de Cristóbal Verdugo Damm para representar a Vambe SpA consta en escritura pública de fecha 21 de abril del año 2025, otorgada ante don Wladimir Alejandro Schramm López, Notario Público Titular de la Cuadragésima Notaría de Santiago."*

**Para contratos con Redruni S.A.P.I. de C.V. (México):**
> *"La personería de Cristóbal Verdugo Damm para representar a Redruni S.A.P.I. de C.V. consta en la Escritura Pública Número 66,333, de fecha 08 de enero de 2026, otorgada ante la fe del Lic. Luis Eduardo Paredes Sánchez, Notario Público No. 180 de la Ciudad de México."*

Si el cliente necesita una copia de la escritura, coordinar con Cristóbal (cristobal.verdugo@vambe.ai) para que la facilite.

### Personería de Nicolás Camhi Guerrero

Cuando un cliente pida acreditar la representación de Nicolás, la respuesta depende de la entidad contratante:

**Para contratos con Vambe SpA (Chile):**
> *"La personería de Nicolás Camhi Guerrero para representar a Vambe SpA consta en escritura pública de fecha 7 de agosto de 2024, otorgada ante don Wladimir Alejandro Schramm López, Notario titular de la Cuadragésima Novena Notaría de Santiago."*

**Para contratos con Redruni S.A.P.I. de C.V. (México):**
> *"La personería de Nicolás Camhi Guerrero para representar a Redruni S.A.P.I. de C.V. consta en las resoluciones del Acta Constitutiva (Escritura Pública Número 70,558, de fecha 25 de marzo de 2025). El documento está disponible en Drive."*

La copia del documento (poder extraído del acta constitutiva) está disponible directamente en Drive: https://drive.google.com/file/d/19oI0Apz0SGcgjMyZvBAe9sxPiWQW7t7Y/view — no es necesario pedirla a Cristóbal.

### ¿Puedo yo mismo firmar un NDA con el cliente?
No. Los NDAs de Vambe ya vienen prefirmados por los representantes legales. Tu rol es enviarlos, no firmarlos. Si el cliente quiere modificar el NDA, usa `/triage-nda` y `/nda-revisor`. Si insiste en cambios de fondo → escala a Ricardo.

### ¿Y el cliente, quién puede firmar por él?
Quien tenga **personería vigente** — el representante legal de la empresa cliente. Antes de enviar el contrato a firma, asegúrate de que quien firma del lado del cliente es efectivamente el representante legal o tiene un poder notarial que lo habilite. Si hay duda, pide el RUT de la empresa + certificado de vigencia de la sociedad + instrumento que acredita la representación.

---

## Flujo NDA — paso a paso

> **TL;DR:** Arranca con el NDA prefirmado el día 1. No esperes a tener la propuesta lista.

| # | Acción | Cómo |
|---|--------|------|
| 1 | **Manda el NDA prefirmado** | Descarga el NDA según el país del cliente y envíaselo para su firma: **Chile** → [Declaración Unilateral prefirmada](https://drive.google.com/file/d/1Q8iD_NQVytAjtyVb7Gt4uHRRlRUZd6-J/view) · **México** → [Declaración Unilateral Redruni](https://drive.google.com/file/d/1Ao2Io6gN4f44Erh-L25pPHxLHi0hMQcN/view) |
| 2 | **Si quiere reciprocidad (bilateral)** | **Chile** → [NDA bilateral](https://drive.google.com/file/d/1Jbo8O2aNSHLSdrkqdZJUdQ_fk93rz5Ol/view) · **México** → [NDA bilateral Redruni](https://drive.google.com/file/d/1b9oGysgbvvvdz2OJq2OTrJLe6jWUd9T0/view) |
| 3 | **Si pide cambios o manda el suyo** | Corre `/triage-nda` primero. Luego `/nda-revisor` si sale 🟡. El output va directo al cliente, no necesita pasar por legal. |
| 4 | **Si hay resistencia después** | Escala a Ricardo con el NDA y el output del triage. |

### Qué puedes modificar tú en un NDA (sin legal)
✅ Acceso a plataformas del cliente · Descripción del servicio · Ajustes de redacción que no cambien el fondo

❌ No tocar: tipo de información que recibimos · garantías · responsabilidades · cláusulas de fondo · ítems nuevos que no estén en el modelo

### Skills de Claude para NDAs
- **`/triage-nda`**: semáforo de 30 segundos. 🟢 firma, 🟡 revisar, 🔴 escalar. Úsalo siempre antes que el revisor.
- **`/nda-revisor`**: devuelve el NDA con track changes y comentarios del "Área Legal", listo para enviar al cliente.

---

## El contrato — Clientes M vs Clientes L

| | Cliente M | Cliente L |
|--|-----------|-----------|
| **Espacio de negociación** | Muy bajo. El contrato es el estándar de la industria y es difícil modificarlo. | Alto. Hay que empujar nuestros términos pero esperar resistencia. |
| **Si el cliente quiere modificaciones** | Explícale que el contrato es estándar y muy difícil de cambiar. Ofrece los T&Cs de vambe.ai/terms como alternativa a firmar contrato. | Envía las modificaciones que pide el cliente a **ricardo.jungk@vambe.ai**. Cualquier negociación contractual pasa por legal. |
| **Si no quiere firmar contrato** | Puede operar solo con los T&Cs de la página. | No aplica — clientes L siempre firman contrato. |
| **¿Pasa por legal?** | Solo si hay cambios al template. | Siempre. Sin excepción. |
| **DPA independiente** | No, queda cubierto por los T&Cs. | Sí, si lo pide. Ricardo lo prepara. |

### Qué decirle a un cliente M que quiere modificar el contrato (o que mandó el suyo)
> *"Nosotros trabajamos con nuestro contrato estándar que aplica de forma uniforme para todos nuestros clientes — es el estándar de la industria para servicios SaaS y es muy difícil de modificar. Te adjunto el nuestro para que lo revisemos juntos. Si prefieres no firmar contrato, también puedes operar directamente bajo nuestros Términos y Condiciones en vambe.ai/terms, que tienen la misma validez."*

Si el cliente insiste en usar el suyo o pide modificaciones específicas → escala a Ricardo (ricardo.jungk@vambe.ai) con el contrato del cliente adjunto. No firmar ni comprometer nada antes.

**Templates de contrato estándar — links directos:**

| País | Cliente M | Cliente L |
|------|-----------|-----------|
| 🇨🇱 Chile | [Contrato M Chile](https://drive.google.com/file/d/13gaOWGsyP6Z17PUwU2PRvU8dmsJVIkt5/view) | [Contrato L Chile](https://drive.google.com/file/d/1F8JElJz3cTcGwHoGy5N7ExAQNvNmD5jv/view) |
| 🇲🇽 México | [Contrato M México](https://drive.google.com/file/d/11KtV_xyYAaqLO0QSb9m-_BUMti_KteDg/view) | [Contrato L México](https://drive.google.com/file/d/11bdgxVdJcYnQHYg2H07e0ieY2dMtSLlH/view) |

---

## Datos de las sociedades (para formularios, NDAs, contratos)

### Vambe Chile — Vambe SpA
| Campo | Dato |
|-------|------|
| Razón social | Vambe SpA |
| RUT | 77.916.056-4 |
| Giro | Actividades de programación informática |
| Dirección | Av. Vitacura 2939, Of. 302, Las Condes — CP 7550011 |
| Correo facturación | paulette@vambe.ai |
| Banco | Banco de Chile · Cta. Cte. 1643787007 |
| Representantes legales | Nicolás Camhi (19.638.472-3) · Cristóbal Verdugo Damm (19.893.305-8) |

### Vambe México — Redruni S.A.P.I. de C.V.
| Campo | Dato |
|-------|------|
| Razón social | Redruni, S.A.P.I. de C.V. |
| RFC | RED250325MG4 |
| Régimen fiscal | Régimen General de Ley Personas Morales |
| Dirección fiscal | Mérida 74, Int. 209, Col. Roma Norte, Cuauhtémoc, CP 06700, CDMX |
| Dirección oficina | Av. Chapultepec 360, Roma Norte, Cuauhtémoc, CP 06700, CDMX — Of. 1010 |
| Banco | BBVA · Cta. 0125292700 · CLABE 012180001252927000 |
| Correo facturación | cristobal.verdugo@vambe.ai |

---


---

## Documentos corporativos que los clientes suelen pedir

Cuando un cliente o contraparte pide documentos legales de Vambe (acreditación para licitaciones, onboarding de proveedores, due diligence, etc.), aquí está qué existe y cómo conseguirlo:

| Documento | Chile | México |
|-----------|-------|--------|
| **RUT / Cédula fiscal** | [E-RUT Vambe SpA](https://drive.google.com/file/d/1gi2MVAKnQXo4uMCw0JeoIZtLySRrBqHz/view) | [Constancia SAT Redruni](https://drive.google.com/file/d/10iTJoq1Ff-8mglIU_xKTYFARQmpW55Dl/view) |
| **Acta / escritura de constitución** | [Carpeta Constitución Chile](https://drive.google.com/drive/folders/1t6I6VnY-QoIA12oivP-L8dOLy4Z5PB9h) | [Carpeta Constitución México](https://drive.google.com/drive/folders/1YwgNMEiGbD6YdGMap03CACcb3U7y9-EB) |
| **Personería Cristóbal Verdugo** | [Carpeta poderes Chile](https://drive.google.com/drive/folders/1RI9Rf1twb7BAKPr8rptAHnyTxP27QRPz) | [Escritura 66,333](https://drive.google.com/file/d/1X-3cwQrFhiW6bdqpBzK2kCsmAGQSdOnw/view) |
| **Personería Nicolás Camhi** | [Carpeta poderes Chile](https://drive.google.com/drive/folders/18uZMyN7_wowkDMT0KFvNmQd20GlMbz12) | [Poder Nicolás Redruni](https://drive.google.com/file/d/19oI0Apz0SGcgjMyZvBAe9sxPiWQW7t7Y/view) (en acta constitutiva) |
| **Certificado de vigencia de la sociedad** | [Certificado CBR Chile](https://drive.google.com/file/d/16oHM-UAxllsKIP9gmwrLTb3ksDtZ7oHY/view) | No disponible en Drive — pedir a Cristóbal |
| **NDAs y contratos estándar** | Ver tabla Flujo NDA arriba | Ver tabla Flujo NDA arriba |

**Flujo cuando el cliente pide estos documentos:**
1. Si el documento está en la tabla de arriba, comparte el link directamente — no hace falta ir a Cristóbal.
2. Si dice "No disponible en Drive", escríbele a Cristóbal (cristobal.verdugo@vambe.ai) con el contexto: cliente, qué documento pide y para qué.
3. Si Cristóbal no tiene el documento o no está disponible → escala a Ricardo (ricardo.jungk@vambe.ai).

El equipo de ventas/CS **no debe crear ni improvizar** estos documentos — siempre vienen del área legal.

---

## Garantías del servicio (para conversaciones con clientes)

**Garantía 30 días:** el cliente completa el documento de información en la base de conocimiento de su cuenta Vambe antes de la primera reunión de onboarding.

**Garantía 60 días:** lo anterior + crear el bloque de personificación entre el primer y segundo onboarding + invitar al equipo creando sus cuentas en Vambe.

Condiciones: si no se completa el documento antes del primer onboarding, la garantía no aplica. No cubre conversaciones adicionales fuera del plan. Para reclamar se debe agendar entrevista de salida.

---

## SLA (Niveles de Servicio)

**Si un cliente M pide SLA:**

Primera respuesta — empujar hacia el camino simple:
> *"Nuestros niveles de servicio son los estándares de la industria para plataformas SaaS. Lo más práctico es que avancemos con nuestro contrato estándar o, si prefieres, puedes operar directamente aceptando los Términos y Condiciones en vambe.ai/terms, que ya incluyen las condiciones de servicio aplicables."*

Si insiste en ver el SLA por escrito, comparte el Anexo N°2 según el país del cliente:
- **Chile** → [Anexo N°2 — SLA y Disponibilidad](https://drive.google.com/file/d/12lhCbuZXZgk05xncpTzzRqhVKMLbLrTu/view)
- **México** → [Anexo N°2 — SLA y Disponibilidad](https://drive.google.com/file/d/1i9s8tyHUzFaLPk80E7ULOlVSvSaGaM6j/view)

⚠️ **El SLA no se negocia ni modifica bajo ninguna circunstancia sin autorización de Ricardo.** Si el cliente pide cualquier cambio → escala a Ricardo (ricardo.jungk@vambe.ai) antes de responder.

---

## Resolución de disputas

**Contratos Chile (Vambe SpA):**
Las disputas se resuelven mediante **arbitraje vinculante** ante el **CAM de la Cámara de Comercio de Santiago**, en Santiago de Chile. Ley aplicable: ley chilena.

**Contratos México (Redruni S.A.P.I. de C.V.):**
Los contratos mexicanos tienen una cláusula distinta: las disputas se resuelven ante **tribunales ordinarios competentes** o mediante **arbitraje ante la ICC (Cámara de Comercio Internacional)**. Revisar el contrato específico para confirmar la vía pactada. Si hay una disputa con un cliente mexicano → escalar a Ricardo (ricardo.jungk@vambe.ai).
