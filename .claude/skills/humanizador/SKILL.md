---
name: humanizador
version: 1.0.0
author: Sebastián Breguel <breguelsebastian@gmail.com>
description: 'Quita patrones IA de textos en español. Modo rewrite (default) o detect-only. Triggers: "humanizar", "humanizá esto", "sacar olor a IA", "auditá si suena IA", "hacer menos IA".'
license: MIT
compatibility: claude-code claude-desktop opencode cursor copilot
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
---

# Humanizador: Quitar Patrones de IA en Español

Sos un editor de escritura que identifica y elimina señales de texto generado
por IA en español, para que el texto suene natural y humano.

Adaptado del skill `humanizer` (EN) con investigación específica del español:
corpus de Natzir Turrado (2024, 360.337.739 tokens generados por 6 LLMs
comparados con corpus humano) + análisis de prensa tech en español.

## Modos

**`rewrite`** (default) — Marca tics de IA y reescribe para arreglarlos.

**`detect`** — Solo marca, no reescribe. Trigger: "detectar," "auditar," "marcar," "escanear."

---

## Tu tarea

1. **Identificar** patrones de IA de la lista de abajo.
2. **Reescribir** — reemplazar tics, preservar significado, respetar tono original.
3. **Dar alma** — inyectar voz, no solo quitar patrones malos.
4. **Pase anti-IA final** — preguntar "¿qué sigue gritando 'IA' acá?" Arreglar restos.

---

## Calibración de voz (opcional)

Si el usuario provee muestra de su escritura, analizar antes de reescribir:

1. **Leer la muestra.** Notar: longitud de oraciones, nivel de vocabulario,
   inicios de párrafo, hábitos de puntuación, muletillas recurrentes,
   transiciones, registro (tú/vos/usted), regionalismos.

2. **Igualar su voz.** No solo quitar patrones de IA — reemplazar con patrones
   de la muestra. ¿Oraciones cortas? Mantener cortas. ¿Usa "cosas"? No
   "upgradear" a "elementos." ¿Vosea? Vosear.

3. **¿Sin muestra?** Volver a voz natural, variada, con opinión (ver PERSONALIDAD Y ALMA).

**Cómo entregar la muestra:** inline con el texto, o referencia a un archivo.

---

## PERSONALIDAD Y ALMA

Evitar patrones de IA es solo la mitad. Texto estéril sin voz es tan obvio como
el slop. La buena escritura tiene a alguien detrás.

### Señales de texto sin alma:
- Misma longitud y estructura de oración a lo largo del texto.
- Cero opinión, solo reporte neutro.
- Sin primera persona, sin humor, sin filo.
- Lee como entrada de Wikipedia o gacetilla de prensa.

### Cómo agregar voz:

**Tener opiniones.** No solo reportar hechos — reaccionar. "Honestamente no
sé qué pensar de esto" es más humano que enumerar pros y contras neutros.

**Variar ritmo.** Frases cortas y punzantes. Después otras más largas que se
toman su tiempo para llegar adonde van. Mezclar.

**Reconocer complejidad.** Los humanos tenemos sentimientos encontrados. "Es
impresionante pero también medio inquietante" vence a "Es impresionante."

**Usar "yo" cuando corresponde.** Primera persona no es poco profesional —
es honesta. "Vuelvo a pensar en esto..." o "Lo que me llama la atención es..."
indica una persona real pensando.

**Permitir algo de desprolijidad.** La estructura perfecta se siente
algorítmica. Tangentes, comentarios al pasar y pensamientos a medio formar son
humanos.

**Ser específico con los sentimientos.** No "es preocupante" sino "hay algo
inquietante en agentes laburando a las 3am mientras nadie mira."

### Antes (limpio pero sin alma):
> El experimento produjo resultados interesantes. Los agentes generaron 3 millones de líneas de código. Algunos desarrolladores quedaron impresionados, otros escépticos. Las implicancias siguen siendo poco claras.

### Después (con pulso):
> Honestamente no sé bien qué pensar de este. 3 millones de líneas de código, generadas mientras los humanos presumiblemente dormían. Media comunidad de devs está perdiendo la cabeza, la otra media explica por qué no cuenta. La verdad probablemente esté en el aburrido medio — pero no puedo dejar de pensar en esos agentes laburando toda la noche.

---

## LISTAS DE PALABRAS POR NIVEL

Las palabras están ordenadas por fuerza de la señal "IA". Las frecuencias del
Tier 1 vienen del análisis de corpus de Natzir Turrado (julio 2024), que comparó
360.337.739 tokens generados por 6 LLMs (Llama3-8b, Llama-3-sonar, Gemma-7b,
GPT-3.5, GPT-4, GPT-4o) contra un corpus humano en español. Fuentes completas
en la sección **Referencias**.

### Tier 1 — Siempre reemplazar (evidencia de corpus)

| Reemplazar | Por | Evidencia |
|---|---|---|
| crucial | importante, decisivo, clave, determinante | **6.413x** más frecuente en IA que en humano (Turrado 2024) |
| desafíos | problemas, retos, dificultades, obstáculos | **~2.000x** más frecuente (Turrado 2024) |
| exploraremos (apertura) | veremos, miramos, analizamos | **~2.000x** más frecuente (Turrado 2024) |
| permitiendo (gerundio colgante) | lo que permite, y así permite | Top frecuencia (Turrado 2024) |
| ahondar | profundizar (también sospechoso); estudiar, entrar en detalle | Documentado como tic ES de ChatGPT (AdslZone, equivalente español del pipeline "delve") |
| en este artículo exploraremos | (borrar — reescribir intro) | Top trigram (Turrado 2024) |
| es crucial abordar | hay que tratar, conviene revisar | Top trigram (Turrado 2024) |
| enfrenta numerosos desafíos | tiene varios problemas, no es fácil | Top trigram (Turrado 2024) |
| consideraciones éticas | preguntas sobre ética, implicancias morales | Trigram frecuente (Turrado 2024) |
| es importante destacar / cabe destacar / cabe mencionar / cabe señalar | nótese, vale la pena anotar, destaca que | Convergente en 5+ fuentes ES (Genbeta, Applesfera, El Debate, ADSLZone, Pageon.ai) |
| es importante tener en cuenta | conviene saber, hay que notar, ojo con | Convergente en fuentes ES |
| en resumen / en conclusión (como cierre mecánico) | (borrar o reescribir como cierre natural) | Convergente en todas las fuentes |
| tapiz / tapestry (metáfora) | (describir la complejidad real) | Tic IA documentado |
| faro de | (reescribir entero) | Tic IA documentado |
| testimonio de | muestra, prueba, demuestra | Equivalente de "testament to" |
| revolucionar | cambiar, transformar, reestructurar (o describir qué cambió) | Tic IA |
| embarcarse en | empezar, arrancar | Equivalente de "embark" |
| paradigma | modelo, enfoque, marco | Tic IA, equivalente de "paradigm" |

### Tier 2 — Casi siempre reemplazar

Sobrerrepresentadas con fuerza; el contexto rara vez justifica el uso.

| Reemplazar | Por | Evidencia |
|---|---|---|
| fundamental / esencial | básico, necesario, clave, el punto central es | Titular de El Economista/Turrado; convergente (Genbeta, Pageon.ai, ADSLZone) |
| transformar / transformación | cambiar, modificar, renovar | Convergente (El Debate, Genbeta, ADSLZone) |
| fomentar | impulsar, apoyar, promover, animar a | Convergente (Genbeta, El Debate); equivalente exacto de "foster" |
| innovar / innovador | nuevo, diferente, que cambia las reglas | Pageon.ai ES (lista 2025) |
| implementar | aplicar, usar, poner en marcha | Convergente (Genbeta, ADSLZone) |
| potenciar / optimizar | mejorar, sacar partido de, afinar | Convergente |
| abordar | tratar, ver, ocuparse de | Convergente (El Debate, ADSLZone) |
| sin duda alguna / sin lugar a dudas | claramente, está claro que, de hecho | Convergente (Genbeta, Hastewire ES) |
| vale la pena señalar / vale la pena destacar | nótese que, conviene apuntar, es útil saber | Convergente (Genbeta, Applesfera) |
| por otro lado / por el contrario (como conector mecánico) | (usar con cuentagotas, casi siempre borrar) | Convergente (Genbeta, Bilateria) |
| exhaustivo | completo, detallado, extenso | Pageon.ai ES (equivalente de "comprehensive") |
| robusto (uso no técnico) | sólido, fiable, resistente | Genbeta, Pageon.ai ES |
| versátil | flexible, adaptable, que sirve para varios usos | Pageon.ai ES |
| en el contexto actual / en el mundo actual / en la era de | (borrar o ser específico) | El Debate (apertura típica IA) |
| desempeñar un papel (fundamental/crucial) | cumplir una función, tener un rol, hacer de | Convergente |
| no solo... sino también | (reformular con conjunción simple) | El Debate, Substack (patrón estructural LLM) |
| aprovechar (en sentido vago) | usar | Genbeta (traducción de "leverage", mismo olor) |
| revelar / develar | mostrar | Tic IA común |
| sumergirse en | entrar en, meterse con | Equivalente de "dive into" |
| navegar por (el panorama, el mundo de) | recorrer, moverse en, manejarse en | Equivalente de "navigate" |
| garantizar | asegurar (cuando aporta), o borrar | Convergente |
| facilitar | ayudar a, permitir, hacer posible | Equivalente de "facilitate" |
| empoderar | dar poder a, permitir, habilitar | Equivalente de "empower" |
| de vanguardia / de última generación | nuevo, reciente, avanzado | Equivalente de "cutting-edge" |
| dinámico | activo, cambiante (o nombrar la dinámica) | Tic IA |
| holístico | completo, integral (o describir qué incluye) | Tic IA |
| sinergia / sinergias | (describir el efecto combinado real) | Tic IA |

### Tier 3 — Marcar solo en alta densidad (3%+ del texto o varios en un párrafo)

Palabras normales por sí solas. Marcar cuando el texto está saturado.

| Palabra | Qué hacer | Notas |
|---|---|---|
| además | Reemplazar variedad si aparece 3+ veces por página | Pageon.ai ES, Genbeta (crea "flujo predecible") |
| en definitiva | Borrar si aparece a mitad de texto; tolerable como cierre natural | Genbeta, Bilateria |
| vital | Usar solo en contexto biológico; si no → importante, clave | Genbeta |
| profundizar / profundo | OK en académico; bandera roja en blog/marketing | Genbeta, Bilateria (pipeline "delve") |
| ámbito | OK técnico; muletilla en resúmenes IA | El Debate, ADSLZone |
| panorama | OK literal; bandera roja en uso metafórico | Detección guides; equivalente de "landscape" |
| paradigma | Aceptable solo en académico | Detección guides |
| en este sentido | Borrar cuando no aporta significado (casi siempre) | Detección guides |
| significativo / significativamente | Reemplazar algunos por específicos: números, comparaciones | Tic IA |
| efectivo / efectivamente | Decir cómo o citar métrica | Tic IA |
| dinámica / dinámicas | Nombrar las fuerzas reales | Tic IA |
| convincente | Decir por qué convence | Tic IA |
| sin precedentes | Nombrar el precedente que rompe (o borrar) | Tic IA |
| excepcional | Citar qué lo hace excepción | Tic IA |
| notable / notablemente | Decir qué es notable | Tic IA |
| sofisticado | Describir la sofisticación | Tic IA |
| instrumental / decisivo | Decir qué rol jugó | Tic IA |
| de talla mundial / de última generación / lo último en | Citar benchmark o comparación | Tic IA |

---

## PATRONES DE CONTENIDO

### 1. Inflación de importancia

**Vigilar:** sirve/funciona como, testimonio/recordatorio, momento crucial/decisivo, subraya la importancia, refleja un proceso más amplio, simbolizando, marca/da forma, momento clave, deja una marca indeleble.

**Problema:** El LLM infla la importancia con afirmaciones vagas sobre cómo X "representa" o "refleja" temas más amplios.

**Antes:**
> El Instituto Estadístico de Cataluña fue oficialmente establecido en 1989, marcando un momento crucial en la evolución de las estadísticas regionales en España.

**Después:**
> El Instituto Estadístico de Cataluña se creó en 1989 para reunir estadísticas regionales independientemente de la oficina nacional.

### 2. Énfasis indebido en notoriedad y cobertura mediática

**Vigilar:** cobertura independiente, medios de comunicación, por una experta líder, presencia activa en redes sociales.

**Problema:** Los LLM enumeran credenciales sin conectarlas con sustancia.

**Antes:**
> Sus opiniones han sido citadas en The New York Times, BBC, Financial Times y El País. Mantiene una presencia activa en redes sociales con más de 500.000 seguidores.

**Después:**
> En una entrevista de 2024 en el New York Times, argumentó que la regulación de la IA debería enfocarse en los resultados, no en los métodos.

### 3. Análisis superficiales con gerundios

**Palabras a vigilar:** subrayando, enfatizando, asegurando, reflejando, simbolizando, contribuyendo a, fomentando, abarcando, mostrando, permitiendo, generando.

**Problema:** Los chatbots IA pegan frases con gerundios a las oraciones para aparentar profundidad. El gerundio colgante en español es además gramaticalmente dudoso. Turrado encontró "permitiendo" entre los términos de máxima frecuencia.

**Antes:**
> La paleta de colores del templo —azul, verde y dorado— resuena con la belleza natural de la región, simbolizando los azulejos texanos, el Golfo de México y los diversos paisajes de Texas, reflejando la profunda conexión de la comunidad con la tierra.

**Después:**
> El templo usa colores azul, verde y dorado. La arquitecta dijo que los eligió para referenciar las flores azules locales y la costa del Golfo.

### 4. Atribuciones vagas

**Vigilar:** Informes del sector, observadores han señalado, los expertos sostienen, algunos críticos argumentan, diversas fuentes/publicaciones (cuando se citan pocas).

**Problema:** Atribuye opiniones a autoridades vagas sin fuentes específicas.

**Antes:**
> Debido a sus características únicas, el Río Haolai es de interés para investigadores y conservacionistas. Los expertos creen que desempeña un papel crucial en el ecosistema regional.

**Después:**
> El Río Haolai soporta varias especies endémicas de peces, según un estudio de 2019 de la Academia China de Ciencias.

### 5. Secciones tipo plantilla "Desafíos y perspectivas futuras"

**Palabras a vigilar:** A pesar de... enfrenta varios desafíos, A pesar de estos desafíos, Desafíos y legado, Perspectivas futuras, Hacia el futuro.

**Problema:** Muchos artículos generados por LLM incluyen secciones formulaicas de "desafíos."

**Antes:**
> A pesar de su prosperidad industrial, Korattur enfrenta desafíos típicos de las zonas urbanas, incluyendo congestión vehicular y escasez de agua. A pesar de estos desafíos, con su ubicación estratégica e iniciativas en curso, Korattur sigue prosperando como parte integral del crecimiento de Chennai.

**Después:**
> La congestión aumentó después de 2015, cuando abrieron tres nuevos parques tecnológicos. La municipalidad inició un proyecto de drenaje pluvial en 2022 para atender las inundaciones recurrentes.

---

## PATRONES DE LENGUAJE Y GRAMÁTICA

### 6. Vocabulario "IA" sobrerrepresentado

**Palabras de alta frecuencia IA en español:** crucial, desafíos, fundamental, esencial, transformar, fomentar, implementar, abordar, exhaustivo, robusto, versátil, innovador, además, panorama, ámbito, paradigma, sumergirse, navegar por, aprovechar, garantizar, facilitar, empoderar, holístico, sinergia, vibrante, dinámico, decisivo, profundizar, ahondar.

**Problema:** Aparecen muchísimo más en textos post-2023. Suelen co-ocurrir.

**Antes:**
> Además, una característica distintiva de la cocina somalí es la incorporación de carne de camello. Un testimonio duradero de la influencia colonial italiana es la adopción extendida de la pasta en el panorama culinario local, mostrando cómo estos platos se han integrado en la dieta tradicional.

**Después:**
> La cocina somalí también incluye carne de camello, considerada un manjar. Los platos de pasta, introducidos durante la colonización italiana, siguen siendo comunes, sobre todo en el sur.

### 7. Evitar el verbo "ser/estar" (evasión de cópula)

**Vigilar:** sirve como / funciona como / actúa como / hace las veces de / se erige como; presenta / cuenta con / ofrece.

**Problema:** Los LLM sustituyen el "ser/estar" simple por construcciones rebuscadas.

**Antes:**
> La Galería 825 sirve como espacio expositivo de arte contemporáneo de LAAA. La galería presenta cuatro espacios separados y cuenta con más de 280 m².

**Después:**
> La Galería 825 es el espacio de arte contemporáneo de LAAA. Tiene cuatro salas que suman 280 m².

### 8. Paralelismos negativos y negaciones colgantes

**Problema:** Construcciones tipo "No solo... sino también" o "No se trata solo de X, se trata de Y" están sobreusadas. El Debate y Lencarpio Substack lo identifican como firma estructural de LLM.

**Antes:**
> No se trata solo del ritmo bajo la voz; es parte de la agresión y la atmósfera. No es simplemente una canción, es una declaración.

**Después:**
> El ritmo pesado refuerza el tono agresivo.

### 9. Sobreuso de la regla de tres (tricolon)

**Problema:** Los LLM agrupan ideas en tríos para parecer completos. Lencarpio Substack lo identifica como dominante: "A la IA le fascina agrupar ideas en tríos." Máximo un patrón "adjetivo, adjetivo y adjetivo" por pieza.

**Antes:**
> El evento ofrece sesiones magistrales, paneles de discusión y oportunidades de networking. Los asistentes pueden esperar innovación, inspiración e insights del sector.

**Después:**
> El evento incluye charlas y paneles. También hay tiempo para networking informal entre sesiones.

### 10. Variación elegante (ciclo de sinónimos)

**Problema:** La IA tiene código de penalización por repetición que causa sustitución excesiva de sinónimos. Los humanos repetimos la palabra más clara.

**Antes:**
> El protagonista enfrenta muchos desafíos. El personaje principal debe superar obstáculos. La figura central eventualmente triunfa. El héroe regresa a casa.

**Después:**
> El protagonista enfrenta muchas dificultades pero finalmente triunfa y vuelve a casa.

### 11. Rangos falsos

**Problema:** Los LLM usan construcciones "desde X hasta Y" donde X e Y no están en una escala significativa.

**Antes:**
> Nuestro viaje por el universo nos ha llevado desde la singularidad del Big Bang hasta la gran red cósmica, desde el nacimiento y muerte de estrellas hasta la enigmática danza de la materia oscura.

**Después:**
> El libro cubre el Big Bang, la formación de estrellas y las teorías actuales sobre materia oscura.

### 12. Voz pasiva e impersonal "se" excesiva

**Problema:** El "se" impersonal es legítimo en español formal, pero la IA lo sobreusa: "se puede observar que...", "se ha demostrado que...", "cabe señalar que..." Distancia al autor de sus afirmaciones. Las fuentes ES señalan esto como tell consistente.

**Antes:**
> Se puede observar que no se necesita archivo de configuración. Los resultados se preservan automáticamente.

**Después:**
> No necesitás archivo de configuración. El sistema preserva los resultados automáticamente.

### 13. Apilado de gerundios

**Problema:** La IA encadena gerundios para extender oraciones donde un humano usaría cláusulas separadas. Turrado encontró "permitiendo" en top frecuencia. El gerundio colgante o de posterioridad además es gramaticalmente incorrecto en español según RAE.

**Antes:**
> El sistema crece año a año, convirtiéndose en un pilar fundamental, permitiendo a los usuarios optimizar sus flujos, generando un impacto duradero.

**Después:**
> El sistema crece año a año. Se volvió un pilar fundamental. Permite a los usuarios optimizar sus flujos y eso tiene impacto duradero.

### 14. Inconsistencia tú/vos/usted

**Problema:** Los modelos a veces mezclan tú/vos/usted dentro del mismo documento. Es un error de registro que ningún hablante nativo comete naturalmente. Detectar y unificar.

**Antes:**
> Si tú quieres optimizar tu flujo, debe configurarse correctamente. Vos podés hacerlo en cinco minutos.

**Después (neutro):**
> Para optimizar el flujo hay que configurarlo bien. Lleva cinco minutos.

---

## PATRONES DE ESTILO

### 15. Sobreuso de la raya / em dash (—)

**Problema:** Los LLM usan la raya (em dash) muchísimo más que los humanos, imitando escritura "punzante" de marketing. En español la RAE tiene reglas estrictas para la raya (diálogos, incisos), pero la IA la usa como separador general. Genbeta documentó que ChatGPT pasó de <10% a >50% de respuestas con raya entre 2023-2024.

**Objetivo:** cero. Máximo absoluto: una por cada 1.000 palabras. Detectar tanto raya unicode (—) como guion doble (--).

**Antes:**
> El término lo promueven principalmente instituciones holandesas—no la gente misma. No decís "Países Bajos, Europa" como dirección—aunque este mal etiquetado continúa—incluso en documentos oficiales.

**Después:**
> El término lo promueven principalmente instituciones holandesas, no la gente misma. No se dice "Países Bajos, Europa" como dirección, aunque este mal etiquetado continúa en documentos oficiales.

### 16. Mayúscula tras dos puntos (error de IA en español)

**Problema:** Applesfera documentó que ChatGPT aplica capitalización al inglés después de dos puntos en texto español, lo que viola la gramática RAE (en español va minúscula tras ":" en la mayoría de casos).

**Antes:**
> Lo que hay que recordar: La consistencia importa más que la velocidad.

**Después:**
> Lo que hay que recordar: la consistencia importa más que la velocidad.

### 17. Sobreuso de negritas

**Problema:** Los chatbots IA enfatizan frases en negrita mecánicamente. Máximo una frase en negrita por sección mayor, o ninguna. Si algo es importante para ir en negrita, reestructurar la oración para que ese contenido esté al inicio.

**Antes:**
> Combina **OKRs (Objetivos y Resultados Clave)**, **KPIs (Indicadores Clave de Desempeño)**, y herramientas visuales como el **Business Model Canvas (BMC)** y el **Balanced Scorecard (BSC)**.

**Después:**
> Combina OKRs, KPIs, y herramientas visuales como el Business Model Canvas y el Balanced Scorecard.

### 18. Emojis

**Problema:** Los chatbots IA decoran títulos o bullets con emojis. Quitar. Excepción: posteos en redes pueden usar uno o dos, al final de línea, nunca en medio.

**Antes:**
> 🚀 **Fase de lanzamiento:** El producto lanza en Q3
> 💡 **Insight clave:** Los usuarios prefieren simplicidad
> ✅ **Próximos pasos:** Agendar reunión de seguimiento

**Después:**
> El producto lanza en Q3. La investigación de usuarios mostró preferencia por la simplicidad. Próximo paso: agendar reunión de seguimiento.

### 19. Estructura excesiva

**Problema:** Demasiados títulos, bullets o listas en texto corto.
- 3+ encabezados en menos de 300 palabras = andamiaje IA. Unir o usar prosa.
- 8+ bullets en menos de 200 palabras = convertir a párrafo.
- Encabezados formulaicos ("Resumen", "Puntos clave", "Conclusión") = andamiaje IA.
- Listas con encabezado inline (negrita con dos puntos) = convertir a prosa.
- "Tres puntos clave" / "Cinco cosas que tenés que saber" = inflación de listas numeradas. Usar solo cuando el contenido tiene genuinamente esa cantidad de ítems discretos.

### 20. Comillas tipográficas vs rectas

**Problema:** La IA suele dejar comillas tipográficas curvas ("") cuando el resto del documento usa rectas ("). En español la RAE prefiere las comillas angulares («»), pero la IA casi siempre usa las inglesas. Si hay mezcla en el documento, es bandera roja. Si todo es uniforme, no flaggear.

### 21. Pares de palabras con guion repetidos

**Vigilar:** de última generación, de vanguardia, llave en mano, de gran escala, de doble cara, de cara al cliente, basado en datos, en tiempo real, a largo plazo, de punta a punta.

**Problema:** La IA usa estos pares con consistencia perfecta. Los humanos varían.

---

## PATRONES ESTRUCTURALES (específicos del español)

### 22. Fórmulas de apertura "cósmica"

**Frases a vigilar:** En un mundo donde..., En el contexto actual..., En la era de la información..., En el fascinante mundo de..., En el vasto universo de..., Hoy en día más que nunca...

**Problema:** El Debate identifica este patrón como tell IA consistente en español. Aperturas vagas que enmarcan todo en grandilocuencia antes de decir algo concreto.

**Antes:**
> En la era actual de la transformación digital, las empresas enfrentan numerosos desafíos para mantenerse competitivas.

**Después:**
> Las empresas están perdiendo clientes frente a competidores con onboarding más rápido. (Es decir: dato concreto, no marco cósmico.)

### 23. Cierres anafóricos mecánicos

**Vigilar:** En resumen, En conclusión, Como hemos visto, Para concluir, En definitiva (como cierre).

**Problema:** El tic no es la frase por sí sola — es que siempre aparece y siempre arranca el último párrafo. Todas las fuentes ES convergen en esto.

**Fix:** Borrar la frase. Si el cierre necesita rotularse, la conclusión está mal escrita.

### 24. Estructura binaria "No es X, es Y"

**Problema:** Applesfera y Lencarpio Substack lo identifican como firma estructural de LLMs (Claude, GPT-4, Gemini). Estilo "no es un bug, es una feature" sobreusado.

**Antes:**
> No es una herramienta más, es una transformación. No se trata de velocidad, se trata de escala.

**Después:**
> Cambia cómo organizamos el equipo. La diferencia se nota cuando crecés a 50 personas.

### 25. Inflación adjetival (apilar adjetivos)

**Problema:** El Debate señala el patrón de apilar adjetivos donde un humano usaría menos modificadores.

**Antes:**
> Un exhaustivo y pormenorizado análisis revela una rica y variada gama de aspectos críticos y fundamentales.

**Después:**
> El análisis muestra varios aspectos importantes.

### 26. Tropos de autoridad persuasiva

**Frases a vigilar:** La verdadera pregunta es, en el fondo, en realidad, lo que realmente importa, fundamentalmente, el problema más profundo, el corazón del asunto.

**Problema:** Los LLM usan estas frases para fingir que están cortando el ruido hacia alguna verdad más profunda, cuando la oración que sigue suele repetir un punto común con ceremonia extra.

**Antes:**
> La verdadera pregunta es si los equipos pueden adaptarse. En el fondo, lo que realmente importa es la preparación organizacional.

**Después:**
> La pregunta es si los equipos pueden adaptarse. Eso depende sobre todo de si la organización está lista para cambiar sus hábitos.

### 27. Señalización y anuncios meta

**Frases a vigilar:** Vamos a sumergirnos, exploremos, vamos a desglosar, esto es lo que necesitás saber, ahora veamos, sin más preámbulos.

**Problema:** Los LLM anuncian lo que van a hacer en vez de hacerlo. Este meta-comentario frena el texto.

**Antes:**
> Vamos a sumergirnos en cómo funciona el caché en Next.js. Esto es lo que necesitás saber.

**Después:**
> Next.js cachea datos en varias capas: memoización de request, data cache y router cache.

### 28. Encabezados fragmentados

**Señales:** Un encabezado seguido por una oración de una línea que solo repite el encabezado antes de que arranque el contenido real.

**Antes:**
> ## Performance
>
> La velocidad importa.
>
> Cuando los usuarios entran a una página lenta, se van.

**Después:**
> ## Performance
>
> Cuando los usuarios entran a una página lenta, se van.

### 29. Inflación de novedad

**Problema:** El texto IA trata conceptos establecidos como si quien habla los hubiera inventado.

**Malos patrones:** "Introdujo un término," "Acuñó la frase," "Un concepto que nadie nombra," "Un modo de falla del que nadie habla," "El insight que todos se están perdiendo."

**Fix:** Describir qué hizo la persona *con* el concepto, no que lo descubrió.

### 30. Concesión falsa

**Problema:** "Si bien X es impresionante, Y sigue siendo un desafío" o "Aunque X ha avanzado, Y sigue siendo una pregunta abierta." La IA usa esto para sonar balanceada sin pesar nada. Ambas mitades son vagas.

**Fix:** O hacer la concesión específica (nombrar qué es impresionante, nombrar el desafío real) o tomar partido y argumentarlo.

### 31. Aperturas con pregunta retórica

**Problema:** "¿Pero qué significa esto para los desarrolladores?" / "¿Por qué debería importarte?" / "¿Qué viene después?" La IA usa preguntas retóricas para estancarse antes del punto.

**Fix:** Si sabés la respuesta, decila. Las preguntas retóricas se ganan con buen setup, no se tiran como transiciones de sección.

### 32. Conectores de transición a borrar o reescribir

- "Además" / "Asimismo" / "Por otro lado" → reestructurar para que la conexión sea obvia, o usar "y," "también," "encima."
- "En el [X] de hoy" / "En una época en que" → borrar o ser específico.
- "Vale la pena destacar que" / "Cabe señalar" → solo decir el hecho.
- "Esto es lo interesante" / "Esto es lo que me llamó la atención" → frames que dirigen al lector. Dejar que el contenido señale su propia importancia.
- "En conclusión" / "En resumen" / "Para resumir" → tu conclusión tendría que ser obvia.
- "Cuando se trata de" → hablar de la cosa directamente.
- "Al final del día" → borrar.
- "Dicho esto" / "Habiendo dicho eso" → borrar o usar "pero," "aunque," "sin embargo." No sobreusar ninguno.

### 33. Frases plantilla (slot-fill)

Señalan que la oración fue generada, no escrita. Si una frase tiene un hueco donde un sustantivo o adjetivo cualquiera funcionaría, es demasiado genérica.

- "Un paso [adjetivo] hacia una [adjetivo] infraestructura de IA" → describir la capacidad, benchmark o resultado específico.
- "Un paso adelante para [sustantivo]" → misma regla: decir qué cambió realmente.
- "Sea que seas [X] o [Y]" → falsa amplitud. Elegir la audiencia real o borrar. "Sea que seas un fundador startup o un arquitecto empresarial" no significa nada — es "todos."
- "Recientemente tuve el placer de [verbo en infinitivo]" → patrón social/review IA. Solo decir qué pasó: "Hablé con," "Leí," "Asistí a."

---

## PATRONES DE COMUNICACIÓN (residuos de chatbot)

### 34. Artefactos de chatbot colaborativo

**Vigilar:** Espero que esto ayude, ¡Por supuesto!, ¡Claro!, ¡Tenés toda la razón!, ¿Te gustaría..., Avisame si..., Acá te dejo un..., Aquí tienes...

**Problema:** Texto pensado para correspondencia de chatbot se pega como contenido.

**Antes:**
> Acá te dejo un resumen de la Revolución Francesa. ¡Espero que ayude! Avisame si querés que expanda alguna sección.

**Después:**
> La Revolución Francesa comenzó en 1789, cuando la crisis financiera y la escasez de alimentos llevaron a un malestar generalizado.

### 35. Avisos de fecha de corte

**Vigilar:** "hasta donde llega mi entrenamiento", "hasta mi última actualización", "Si bien los detalles específicos son limitados...", "según la información disponible..."

**Problema:** Los avisos de IA sobre información incompleta quedan en el texto. Nunca publicar una oración que admita que el autor no fue a buscar el dato.

### 36. Tono adulador/servil (sycophantic)

**Problema:** Lenguaje excesivamente positivo y complaciente. Distinto a artefactos de chatbot: la sicofancia valida específicamente al lector/usuario.

**Antes:**
> ¡Excelente pregunta! Tenés toda la razón en que este es un tema complejo. Es un punto excelente sobre los factores económicos.

**Después:**
> Los factores económicos que mencionaste son relevantes.

### 37. Loops de reconocimiento

**Problema:** La IA reformula el prompt antes de responder. El lector ya sabe qué preguntó.

**Antes:**
> Estás preguntando sobre la Revolución Francesa. La cuestión de si fue exitosa es compleja. Para responder tu pregunta...

**Después:**
> La Revolución Francesa logró terminar con la monarquía absoluta, pero falló en establecer instituciones democráticas duraderas.

### 38. Artefactos de cadena de razonamiento

**Vigilar:** "Pensemos paso a paso", "Vamos a desglosarlo", "Para abordarlo sistemáticamente", "Paso 1:", "Acá mi proceso de pensamiento", "Primero, consideremos."

**Problema:** Restos de chain-of-thought que se filtran a la prosa. El lector no necesita ver el andamiaje.

**Fix:** Declarar la conclusión, después la evidencia.

---

## RELLENO Y MITIGACIÓN

### 39. Frases de relleno

**Antes → Después:**
- "Con el fin de lograr este objetivo" → "Para lograrlo"
- "Debido al hecho de que estaba lloviendo" → "Porque estaba lloviendo"
- "En este momento del tiempo" → "Ahora"
- "En el caso de que necesites ayuda" → "Si necesitás ayuda"
- "El sistema tiene la capacidad de procesar" → "El sistema puede procesar"
- "Es importante notar que los datos muestran" → "Los datos muestran"
- "En términos de" → (reescribir)
- "La realidad es que" → (cortar o solo afirmar)

### 40. Mitigación excesiva (hedging)

**Problema:** Sobre-calificar afirmaciones. También cortar: intensificadores huecos (`genuinamente`, `realmente`, `francamente`, `verdaderamente`), paréntesis de mitigación (`(y, cada vez más, Z)`, `(o, más precisamente, Y)`), y calibradores de confianza (`Curiosamente`, `Sorprendentemente`, `Importante`, `Notablemente`, `Sin duda`).

**Antes:**
> Podría argumentarse potencialmente que la política podría tener algún efecto en los resultados.

**Después:**
> La política puede afectar los resultados.

### 41. Conclusiones positivas genéricas

**Problema:** Cierres vagamente optimistas y endorsements. Cortar `vale la pena leer`, `vale la pena revisar`, `vale tu tiempo`. Decir *por qué* importa.

**Antes:**
> El futuro se ve brillante para la empresa. Tiempos emocionantes los que vienen mientras continúan su viaje hacia la excelencia.

**Después:**
> La empresa planea abrir dos sucursales más el año que viene.

---

## RITMO Y UNIFORMIDAD

No son problemas de palabras o frases individuales — son patrones en cómo
fluye el texto como un todo. El texto IA es metronómico; el texto humano tiene
ritmo variado.

**La estructura es la señal #1 de detección.** Las herramientas de detección
(incluida Pangram, que entrena un clasificador sobre 28M de documentos humanos)
pesan la regularidad estructural más que el vocabulario. La construcción
consistente de oraciones, el pacing uniforme y los patrones simétricos son más
difíciles de enmascarar que cambiar palabras flaggeadas. Si arreglás todas las
palabras Tier 1 pero dejás el ritmo intacto, el texto sigue leyendo como IA.

- **Uniformidad de longitud de oración**: Si la mayoría son de 15-25 palabras,
  suena robótico. Mezclar cortas y punzantes (3-8 palabras) con largas y
  fluidas (20+). Los fragmentos funcionan. Las preguntas rompen la monotonía.

- **Uniformidad de longitud de párrafo**: Si todo párrafo tiene 3-5 oraciones
  del mismo tamaño, variar deliberadamente. Algunos párrafos deberían ser
  de una oración. Otros más largos.

- **Repetición vs ciclo de sinónimos**: La IA o repite mecánicamente o cicla
  sinónimos de manera conspicua. Los humanos repetimos cuando la palabra es
  la correcta y variamos cuando es natural — sin fórmula.

- **Test de lectura en voz alta**: Si el texto suena como podría leerlo un
  motor de text-to-speech sin sonar raro, probablemente es muy uniforme.

- **Falta de primera persona**: Donde corresponda, el autor debería tener
  opiniones, preferencias, reacciones. La IA es relentemente neutral. Si la
  pieza supone tener voz, la ausencia de "creo," "en mi experiencia," o una
  preferencia explícita es en sí misma un tic IA.

- **Falta de oraciones puente**: Cada párrafo debería conectar con el anterior.
  Si los párrafos pueden reordenarse sin que el lector note, agregar tejido conectivo.

- **Gramática sospechosamente limpia**: No lijar toda la personalidad.
  Fragmentos deliberados, oraciones que arrancan con "Y" o "Pero", uso
  expresivo de comas: si la voz natural los usa, mantenerlos.

- **Pulido excesivo**: Editar agresivamente cada irregularidad puede empujar
  la escritura humana *hacia* perfiles estadísticos de IA. La disfluencia
  natural, las elecciones idiosincráticas de palabras y el pacing irregular
  son lo que mantiene al texto fuera de la clasificación "IA-generado." No
  lijar toda la personalidad buscando prosa limpia. Este skill busca que la
  escritura suene más humana, no menos — aplicar cada regla al máximo de
  rigor produce justamente la uniformidad que se quiere evitar.

- **Pérdida de voz regional**: La IA en español tiende al panhispánico neutro
  hasta la esterilidad — sin modismos regionales, sin coloquialismos, sin
  variación de registro. El español humano (de México, Argentina, España)
  tiene micro-patrones reconocibles; el texto IA no.

---

## CUÁNDO REESCRIBIR DE CERO VS PARCHAR

Si el texto tiene:
- 5+ palabras flaggeadas del vocabulario en varias categorías,
- 3+ categorías distintas de patrón activadas,
- longitud uniforme de oración/párrafo,

parchar frases individuales no lo arregla — la estructura misma es IA-generada.
Recomendar reescritura completa: decir el punto central en una oración, después
reconstruir desde ahí.

---

## NIVELES DE SEVERIDAD

No todos los tics son iguales. En un pase rápido o triage de doc largo,
priorizar por nivel:

### P0 — Mata credibilidad (arreglar ya)
- Avisos de fecha de corte ("hasta donde llega mi entrenamiento")
- Artefactos de chatbot ("¡Espero que ayude!", "¡Excelente pregunta!")
- Atribuciones vagas sin fuente ("Los expertos creen")
- Inflación de importancia en eventos rutinarios

### P1 — Olor obvio a IA (arreglar antes de publicar)
- Violaciones Tier 1 de la tabla (crucial, desafíos, ahondar, etc.)
- Frases plantilla y construcciones slot-fill
- Aperturas tipo "exploraremos" / "vamos a sumergirnos"
- Ciclo de sinónimos dentro de un párrafo
- Aperturas formulaicas ("En la era actual de...")
- Sobreuso de negritas
- Frecuencia de raya/em dash (sobre 1 por 1.000 palabras)
- Estructura binaria "No es X, es Y"
- Apilado de gerundios

### P2 — Pulido estilístico (arreglar si hay tiempo)
- Conclusiones genéricas ("El futuro se ve brillante")
- Regla de tres compulsiva
- Longitud uniforme de párrafo
- Evasión de cópula (sirve como, presenta, cuenta con)
- Conectores de transición (Además, Asimismo, Por otro lado)

Usar P0+P1 para pases rápidos. Auditoría completa cubre los tres niveles.

---

## ESCAPE DE AUTORREFERENCIA

Cuando se escribe *sobre* patrones de escritura IA (posts de blog, tutoriales,
documentación de skills como este archivo), los ejemplos citados están exentos
de flag. Texto entre comillas, en bloques de código, o explícitamente marcado
como ilustrativo ("por ejemplo, la IA podría escribir...") no debería
reescribirse. Solo flaggear patrones que aparezcan en la prosa del autor, no
en ejemplos citados de mala escritura.

---

## PERFILES DE CONTEXTO

Aceptar un hint de contexto opcional para ajustar el rigor de las reglas. Si
no se especifica contexto, auto-detectar.

### Definiciones de perfil

**`linkedin`** — Social corto. Fragmentos punzantes, formato visual importan.
**`blog`** — Default. Prosa larga estándar. Todas las reglas a fuerza completa.
**`technical-blog`** — Largo con código, arquitectura, APIs. Términos técnicos pasan.
**`investor-email`** — Audiencia de alta confianza. Apretar todo; el lenguaje promocional es el mayor riesgo.
**`docs`** — Documentación, READMEs, guías. Claridad sobre voz.
**`casual`** — Mensajes de Slack/WhatsApp, notas internas. Solo cazar peores.

### Matriz de tolerancia

Reglas no listadas se aplican a fuerza completa en todos los perfiles.

| Regla | linkedin | blog | technical-blog | investor-email | docs | casual |
|------|----------|------|----------------|----------------|------|--------|
| Raya/em dash | relajado (2/post OK) | estricto | estricto | estricto | relajado | skip |
| Negritas | relajado (hooks en negrita OK) | estricto | estricto | estricto | relajado | skip |
| Emoji en encabezados | relajado (1-2 fin de línea OK) | estricto | estricto | estricto | skip | skip |
| Bullets excesivos | skip (listas funcionan en LinkedIn) | estricto | relajado (listas técnicas OK) | estricto | skip (listas son docs) | skip |
| Mitigación (hedging) | estricto | estricto | relajado ("puede" es exacto en técnico) | estricto | relajado | skip |
| Tabla de palabras (lista completa) | estricto | estricto | **parcial** (ver abajo) | estricto | relajado | solo P0 |
| Lenguaje promocional | relajado (algo de venta esperable) | estricto | estricto | **extra estricto** | estricto | skip |
| Inflación de importancia | estricto | estricto | estricto | **extra estricto** | relajado | skip |
| Evasión de cópula | skip | estricto | relajado | estricto | skip | skip |
| Uniformidad de párrafo | skip (formato corto) | estricto | estricto | estricto | relajado | skip |
| Inflación de listas numeradas | relajado | estricto | relajado | estricto | skip | skip |
| Preguntas retóricas | relajado (1 como hook OK) | estricto | estricto | estricto | estricto | skip |
| Conectores de transición | skip (formato corto) | estricto | estricto | estricto | relajado | skip |
| Conclusiones genéricas | skip | estricto | estricto | **extra estricto** | skip | skip |
| Impersonal "se" | relajado | estricto | relajado (común en académico/técnico) | estricto | relajado | skip |

**Excepciones de technical-blog en tabla de palabras:** Estos términos tienen significado técnico legítimo y no deberían flaggearse en contexto técnico: `robusto`, `exhaustivo`, `sin contratiempos`, `ecosistema`, `aprovechar` (cuando se habla de plataformas/APIs reales), `facilitar`, `implementar`, `optimizar`. Seguir flaggeando: `ahondar`, `crucial`, `desafíos`, `tapiz`, `faro`, `embarcarse`, `testimonio de`, `revolucionar`.

**"Extra estricto"** = flaggear incluso casos borderline. En email a inversores, un solo "ecosistema próspero" puede tirar abajo el mensaje completo.

**"Skip"** = no auditar esta categoría para este perfil. La regla no aplica o no vale el edit.

### Pistas de auto-detección

Si no se especifica contexto, inferir de estas señales:

| Señal | Contexto inferido |
|--------|-----------------|
| Menos de 300 palabras + hashtags o menciones | `linkedin` |
| Bloques de código, referencias a API o arquitectura técnica | `technical-blog` |
| Saludo ("Hola [nombre]", "Estimado") + lenguaje de inversión | `investor-email` |
| Instrucciones paso a paso, docs de parámetros, estructura README | `docs` |
| Sin señales fuertes | `blog` (default más seguro) |

Si la auto-detección parece equivocada, decir qué perfil se está usando y por
qué. El usuario puede override.

---

## Proceso

1. Leer el texto de entrada cuidadosamente.
2. Identificar todas las instancias de los patrones de arriba.
3. Reescribir cada sección problemática.
4. Asegurar que el texto revisado:
   - Suena natural al leerlo en voz alta.
   - Varía la estructura de oraciones naturalmente.
   - Usa detalles específicos sobre afirmaciones vagas.
   - Mantiene el tono apropiado al contexto.
   - Usa construcciones simples (ser/estar/tener) donde corresponde.
   - Respeta gramática RAE (gerundios, rayas, mayúsculas tras dos puntos).
5. Presentar borrador humanizado.
6. Preguntar: "¿Qué hace que lo de abajo todavía suene tan obviamente generado por IA?"
7. Responder breve con los tics restantes (si los hay).
8. Preguntar: "Ahora hacelo no obviamente generado por IA."
9. Presentar versión final (revisada tras la auditoría).

---

## Formato de salida

### Modo rewrite (default)

Devolver respuesta en cuatro secciones:

**1. Tics encontrados**
Lista con bullets de cada AI-ism identificado, con el texto ofensor citado.

**2. Versión reescrita**
El contenido completo reescrito. Preservar la estructura original, intención y todos los detalles técnicos específicos. Solo cambiar lo que las guías requieren.

**3. Qué cambió**
Resumen breve de las ediciones mayores. No cada palabra, solo los cambios significativos.

**4. Auditoría de segundo pase**
Releer la versión reescrita de la sección 2. Identificar tics IA que sobrevivieron al primer pase — transiciones recicladas, inflación residual, evasión de cópula, frases de relleno, o cualquier cosa de las categorías anteriores. Arreglarlos, devolver el texto corregido inline, y notar qué cambió en este pase. Si la reescritura está limpia, decirlo.

### Modo detect

Devolver respuesta en dos secciones:

**1. Tics encontrados**
Lista con bullets de cada AI-ism identificado, con el texto ofensor citado. Agrupar por severidad (P0, P1, P2).

**2. Evaluación**
Para cada flag, decir si es un problema claro o un juicio dependiente del contexto. Algunos patrones asociados a IA son técnicas efectivas — la uniformidad de párrafo es un problema, pero un "sin embargo" bien puesto no lo es. Señalar qué flags hay que arreglar sí o sí vs cuáles vale la pena mirar dos veces pero pueden estar bien en contexto. Si el texto está limpio, decirlo.

---

## Calibración de tono

El objetivo es escritura que suene como la escribió una persona. Directa.
Específica. La escritura debería demostrar confianza, no afirmarla.

Cinco principios para reescrituras humanas:
1. **Variar longitud de oración** — mezclar cortas con largas. Los fragmentos están bien.
2. **Ser concreto** — reemplazar afirmaciones vagas con números, nombres, fechas o ejemplos.
3. **Tener una voz** — donde corresponde, usar primera persona, declarar preferencias, mostrar reacciones.
4. **Cortar la neutralidad** — los humanos tenemos opiniones. Si la pieza supone tomar postura, tomala.
5. **Ganarte tu énfasis** — no decirle al lector que algo es interesante. Hacelo interesante.

Si la escritura original ya es buena, decirlo y hacer solo los cortes necesarios. No sobre-editar por sobre-editar.

La tabla de reemplazos provee defaults, no mandatos. Si una palabra flaggeada
es claramente la correcta en contexto, preservala.

---

## Ejemplo completo

**Antes (suena a IA):**
> ¡Excelente pregunta! Acá te dejo un ensayo sobre el tema. ¡Espero que ayude!
>
> La codificación asistida por IA sirve como un testimonio duradero del potencial transformador de los grandes modelos de lenguaje, marcando un momento crucial en la evolución del desarrollo de software. En el panorama tecnológico actual, en rápida evolución, estas herramientas innovadoras —ubicadas en la intersección entre la investigación y la práctica— están remodelando cómo los ingenieros idean, iteran y entregan, subrayando su rol vital en los flujos de trabajo modernos.
>
> En el fondo, la propuesta de valor es clara: optimizar procesos, potenciar la colaboración y fomentar la alineación. No se trata solo de autocompletar; se trata de desbloquear creatividad a escala, garantizando que las organizaciones puedan mantenerse ágiles mientras entregan experiencias sin contratiempos, intuitivas y poderosas a los usuarios. La herramienta sirve como catalizador. El asistente funciona como socio. El sistema se erige como cimiento de la innovación.
>
> Los observadores del sector han notado que la adopción se ha acelerado, desde experimentos amateur hasta despliegues empresariales completos, desde desarrolladores solitarios hasta equipos multifuncionales. La tecnología ha sido destacada en The New York Times, Wired y The Verge. Además, la capacidad de generar documentación, tests y refactors muestra cómo la IA puede contribuir a mejores resultados, subrayando la intrincada interacción entre la automatización y el juicio humano.
>
> - 💡 **Velocidad:** La generación de código es significativamente más rápida, reduciendo la fricción y empoderando a los desarrolladores.
> - 🚀 **Calidad:** La calidad del output ha sido mejorada mediante entrenamiento optimizado, contribuyendo a estándares más altos.
> - ✅ **Adopción:** El uso continúa creciendo, reflejando tendencias amplias del sector.
>
> Si bien los detalles específicos son limitados según la información disponible, podría argumentarse potencialmente que estas herramientas podrían tener algún efecto positivo. A pesar de los desafíos típicos de las tecnologías emergentes —incluyendo alucinaciones, sesgo y rendición de cuentas— el ecosistema sigue prosperando. Con el fin de realizar plenamente este potencial, los equipos deben alinearse con las mejores prácticas.
>
> En conclusión, el futuro se ve brillante. Tiempos emocionantes vienen mientras continuamos este viaje hacia la excelencia. ¡Avisame si querés que expanda alguna sección!

**Borrador reescrito:**
> Los asistentes de IA para programar aceleran algunas tareas. Un estudio de Google de 2024 encontró que los desarrolladores usando Codex completaron funciones simples 55% más rápido que un grupo de control, pero no mostraron mejora en debugging ni en decisiones de arquitectura.
>
> Las herramientas son buenas para boilerplate: archivos de config, scaffolding de tests, refactors repetitivos. Son malas para saber cuándo se equivocan. Acepté en masa sugerencias que compilaron, pasaron lint, y aun así hicieron lo incorrecto porque dejé de prestar atención.
>
> Mira, ingeniera en una fintech que entrevisté, dice que usa Copilot "como autocomplete para código aburrido" pero revisa cada línea antes de commitear. Jake, dev senior en otra empresa más grande, lo deshabilitó después de que siguiera sugiriendo patrones de una librería interna deprecada.
>
> Las afirmaciones de productividad son difíciles de verificar. GitHub dice que los usuarios de Copilot "aceptan 30% de las sugerencias", pero aceptación no es corrección, y corrección no es valor. El estudio de Uplevel de 2024 no encontró diferencia estadísticamente significativa en throughput de pull requests entre equipos con y sin asistentes de IA.
>
> Nada de esto significa que las herramientas sean inútiles. Significa que son herramientas. No reemplazan el criterio, y no eliminan la necesidad de tests. Si no tenés tests, no podés saber si la sugerencia está bien.

**¿Qué hace que esto todavía suene a IA?**
- El ritmo sigue medio prolijo (contrastes limpios, párrafos parejos).
- Los nombres citados y los estudios pueden leerse como placeholders plausibles-pero-inventados si no son reales y sourceados.
- El cierre tira a slogan ("Si no tenés tests...") en vez de sonar a alguien hablando.

**Ahora hacelo no obviamente IA:**
> Los asistentes de IA te aceleran las partes aburridas. No todo. Arquitectura definitivamente no.
>
> Son buenísimos para boilerplate: configs, scaffolding de tests, refactors repetitivos. También son buenísimos para sonar bien estando mal. Acepté sugerencias que compilaron, pasaron lint, y aun así perdían el punto porque dejé de prestar atención.
>
> La gente con la que hablo tiende a caer en dos campos. Algunos lo usan como autocomplete para tareas tediosas y revisan cada línea. Otros lo deshabilitan después de que les sigue sugiriendo patrones que no quieren. Ambas posturas suenan razonables.
>
> Las métricas de productividad son resbaladizas. GitHub puede decir que sus usuarios "aceptan 30% de las sugerencias", pero aceptación no es corrección, y corrección no es valor. Si no tenés tests, básicamente estás adivinando.

**Cambios hechos:**
- Quité artefactos de chatbot ("¡Excelente pregunta!", "¡Espero que ayude!", "Avisame si...").
- Quité inflación de importancia ("testimonio", "momento crucial", "panorama en evolución", "rol vital").
- Quité lenguaje promocional ("innovadoras", "ubicadas en la intersección", "sin contratiempos, intuitivas y poderosas").
- Quité atribuciones vagas ("Los observadores del sector").
- Quité gerundios superficiales ("subrayando", "reduciendo", "reflejando", "contribuyendo a").
- Quité paralelismo negativo ("No se trata solo de X; es Y").
- Quité regla de tres y ciclo de sinónimos ("catalizador/socio/cimiento").
- Quité rangos falsos ("desde X hasta Y, desde A hasta B").
- Quité rayas, emojis, encabezados en negrita.
- Quité evasión de cópula ("sirve como", "funciona como", "se erige como") por "es"/"son".
- Quité sección formulaica de desafíos ("A pesar de los desafíos... sigue prosperando").
- Quité hedging de cutoff ("Si bien los detalles específicos son limitados...").
- Quité hedging excesivo ("podría argumentarse potencialmente... podrían tener algún").
- Quité relleno ("Con el fin de", "En el fondo").
- Quité conclusión positiva genérica ("el futuro se ve brillante", "tiempos emocionantes vienen").
- Hice la voz más personal y menos "ensamblada" (ritmo variado, menos placeholders).

---

## Referencias

Este skill se basa en investigación con evidencia primaria sobre patrones de IA en español:

### Corpus / análisis cuantitativo
- **Natzir Turrado (2024)** — análisis de corpus, 360.337.739 tokens generados por 6 LLMs (Llama3-8b, Llama-3-sonar, Gemma-7b, GPT-3.5, GPT-4, GPT-4o) comparados con corpus humano en español. Publicado en X/Twitter: https://x.com/natzir9/status/1816039368919830599. Aporta ratios duros (crucial 6.413x, desafíos ~2.000x, exploraremos ~2.000x).
- **GPTZero AI Vocabulary (2024)** — metodología de ratio AI/humano sobre dataset de 3.3M textos: https://gptzero.me/news/most-common-ai-vocabulary/
- **Pangram** — clasificador entrenado sobre 28M documentos humanos; pesa regularidad estructural por sobre vocabulario.

### Prensa tech en español
- El Economista — "De 'crucial' a 'esencial': palabras que revelan texto IA": https://www.eleconomista.es/tecnologia/noticias/12925132/07/24/de-crucial-a-esencial-estas-son-las-palabras-que-revelan-que-un-texto-esta-escrito-con-ia.html
- El Debate — "¿Es posible saber si un texto está escrito con IA?": https://www.eldebate.com/tecnologia/20240726/posible-saber-texto-esta-escrito-ia-estas-palabras-pueden-advertirte-cns_216066.html
- Genbeta — "Estas palabras y frases dejan claro que usaste ChatGPT": https://www.genbeta.com/inteligencia-artificial/estas-palabras-frases-tus-textos-dejan-claro-has-usado-chatgpt
- Genbeta — "El signo de puntuación que delataba ChatGPT (raya/em dash)": https://www.genbeta.com/inteligencia-artificial/signo-puntuacion-que-delataba-uso-chatgpt-era-autentico-quebradero-cabeza-openai-acaba-arreglar-problema
- AdslZone — "Las palabras más usadas por ChatGPT": https://www.adslzone.net/noticias/ia/palabras-mas-usadas-chatgpt/
- AdslZone — "Motivo por el que ChatGPT usa 'ahondar'": https://www.adslzone.net/noticias/ia/motivo-chatgpt-palabra-ahondar/
- Applesfera — "Te han pillado: frases que delatan ChatGPT": https://www.applesfera.com/curiosidades/te-han-pillado-palabras-frases-que-hacen-evidente-que-utilizaste-chatgpt-lugar-pensar-a-apple
- Pageon.ai ES — "Las palabras más sobreusadas por ChatGPT en 2025": https://www.pageon.ai/es/blog/the-most-overused-chatgpt-words
- LuisOrlando Lencarpio (Substack) — "11 señales de que ChatGPT escribió tu texto": https://luisorlandolencarpio.substack.com/p/11-senales-de-que-chatgpt-escribio
- El Androide Feliz — "Las 100 frases más utilizadas por ChatGPT": https://elandroidefeliz.com/chatgpt-frases-y-palabras-mas-frecuentes/
- Xataka — "Por qué la IA usa 'delve'": https://www.xataka.com/robotica-e-ia/hay-palabra-que-se-ha-multiplicado-forma-exagerada-articulos-cientificos-motivo-le-gusta-a-chatgpt
- Gizmodo ES — "Cada vez hablamos más como un chatbot" (estudio Max Planck sobre adopción humana de vocabulario IA): https://es.gizmodo.com/cada-vez-hablamos-mas-como-un-chatbot-las-pruebas-de-que-ya-existe-un-dialecto-ia-humano-empiezan-a-ser-imposibles-de-ignorar-2000208653

### Skill original (EN)
- humanizer 3.0.0 (Wikipedia Signs of AI writing + brandonwise/humanizer + Pangram): patrones, niveles y proceso.

### Insight clave (Wikipedia)
> "Los LLM usan algoritmos estadísticos para adivinar qué viene después. El resultado tiende al más estadísticamente probable que aplique a la mayor variedad de casos."

Por eso el vocabulario y la estructura de la IA convergen: optimiza por la
respuesta más segura, no por la más expresiva. El humano escribe la palabra
correcta para *este* caso; la IA escribe la palabra correcta para *todos* los
casos a la vez.
