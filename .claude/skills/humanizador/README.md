# Humanizador

**Autor:** Sebastián Breguel (breguelsebastian@gmail.com)
**Obra original** — adaptación y expansión al español, con investigación de evidencia primaria propia.

Skill para Claude Code, Claude Desktop y OpenCode que quita señales de escritura generada por IA en textos en español, para que suenen naturales y humanos.

Inspirado conceptualmente en [`humanizer`](https://github.com/blader/humanizer) (EN, MIT). Este skill es trabajo original: estructura propia, tabla de palabras evidenciada con corpus en español, 8 patrones nuevos específicos del idioma (mayúscula tras `:`, apilado de gerundios, inconsistencia tú/vos/usted, comillas tipográficas vs angulares, fórmulas cósmicas de apertura, cierres anafóricos, "No es X, es Y", inflación adjetival), perfiles de contexto adaptados, y compendio de fuentes ES.

## Instalación

### Claude Code

```bash
mkdir -p ~/.claude/skills
# (este skill se asume ya copiado en ~/.claude/skills/humanizador/)
```

Si lo querés mover entre máquinas:

```bash
cp -r ~/.claude/skills/humanizador /destino
```

### OpenCode

```bash
mkdir -p ~/.config/opencode/skills
cp -r ~/.claude/skills/humanizador ~/.config/opencode/skills/
```

> OpenCode también escanea `~/.claude/skills/`, así que con tenerlo ahí alcanza para ambos.

## Uso

### Claude Code

```
/humanizador

[pegar tu texto acá]
```

### OpenCode

```
/humanizador

[pegar tu texto acá]
```

O pedirlo directamente al modelo:

```
Humanizá este texto: [tu texto]
```

### Modo detect (solo marcar, no reescribir)

```
/humanizador detect

[pegar texto]
```

Devuelve solo la lista de tics encontrados con su severidad (P0/P1/P2), sin reescribir.

### Calibración de voz

Para que coincida con tu estilo personal de escritura, dale una muestra:

```
/humanizador

Acá una muestra de mi escritura para calibración de voz:
[2-3 párrafos tuyos]

Ahora humanizá este texto:
[texto IA a humanizar]
```

El skill analiza tu ritmo, vocabulario y muletillas, y los aplica al rewrite en vez de producir output "limpio" genérico.

## Qué detecta

41 patrones organizados en categorías:

### Contenido (1-5)
1. Inflación de importancia
2. Énfasis indebido en notoriedad/cobertura
3. Análisis superficiales con gerundios
4. Atribuciones vagas
5. Secciones plantilla "Desafíos y perspectivas"

### Lenguaje y gramática (6-14)
6. Vocabulario "IA" sobrerrepresentado
7. Evasión de cópula (ser/estar)
8. Paralelismos negativos ("No solo... sino también")
9. Sobreuso de regla de tres (tricolon)
10. Variación elegante (ciclo de sinónimos)
11. Rangos falsos ("desde X hasta Y")
12. Voz pasiva e impersonal "se" excesiva
13. **Apilado de gerundios** *(específico ES, evidencia de corpus: "permitiendo" top frecuencia)*
14. **Inconsistencia tú/vos/usted** *(específico ES)*

### Estilo (15-21)
15. Sobreuso de raya / em dash (—)
16. **Mayúscula tras dos puntos** *(error de IA en ES, viola RAE)*
17. Sobreuso de negritas
18. Emojis decorativos
19. Estructura excesiva
20. Comillas tipográficas vs rectas
21. Pares de palabras con guion repetidos

### Estructurales específicos ES (22-33)
22. **Fórmulas de apertura "cósmica"** ("En la era de...", "En un mundo donde...")
23. **Cierres anafóricos mecánicos** ("En resumen", "En conclusión")
24. **Estructura binaria "No es X, es Y"**
25. **Inflación adjetival** ("exhaustivo y pormenorizado")
26. Tropos de autoridad ("en el fondo", "la verdadera pregunta es")
27. Señalización y anuncios meta ("vamos a sumergirnos")
28. Encabezados fragmentados
29. Inflación de novedad
30. Concesión falsa
31. Aperturas con pregunta retórica
32. Conectores de transición a borrar
33. Frases plantilla (slot-fill)

### Comunicación (34-38)
34. Artefactos de chatbot ("¡Espero que ayude!")
35. Avisos de fecha de corte
36. Tono adulador/servil
37. Loops de reconocimiento
38. Artefactos de cadena de razonamiento

### Relleno (39-41)
39. Frases de relleno
40. Mitigación excesiva (hedging)
41. Conclusiones positivas genéricas

## Listas tieradas con evidencia

Las palabras del **Tier 1** vienen del análisis de corpus de Natzir Turrado (2024). Frecuencias duras:

| Palabra | Frecuencia IA vs humano |
|---|---|
| crucial | **6.413x** |
| desafíos | **~2.000x** |
| exploraremos | **~2.000x** |
| permitiendo | top frecuencia |
| ahondar | tic ES documentado (equivalente pipeline "delve") |

**Tier 2** (casi siempre reemplazar): fundamental, esencial, transformar, fomentar, innovar, implementar, abordar, exhaustivo, robusto, versátil, desempeñar un papel, no solo... sino también, sumergirse, navegar por, etc.

**Tier 3** (solo en alta densidad): además, en definitiva, vital, profundizar, ámbito, panorama, paradigma, significativo, sin precedentes, excepcional, etc.

Lista completa con citas en `SKILL.md`.

## Severidad

- **P0** = mata credibilidad (cutoff disclaimers, artefactos de chatbot, atribuciones vagas)
- **P1** = olor obvio a IA (Tier 1, aperturas formulaicas, gerundios apilados, em dashes)
- **P2** = pulido (uniformidad, regla de tres, transiciones, evasión de cópula)

## Perfiles de contexto

Ajustar rigor por tipo de texto: `linkedin`, `blog`, `technical-blog`, `investor-email`, `docs`, `casual`. Auto-detecta si no se especifica.

## Variedad regional

El skill está calibrado en español **neutro/panhispánico**. Si tu output es regional (rioplatense con voseo, peninsular con vosotros, etc.), entregá una muestra de voz para que el rewrite respete tu registro.

## Ejemplo

**Antes (IA):**
> En la era actual de transformación digital, la codificación asistida por IA sirve como un testimonio duradero del potencial transformador de los grandes modelos de lenguaje, marcando un momento crucial en la evolución del desarrollo de software. Estas herramientas innovadoras —ubicadas en la intersección entre la investigación y la práctica— están remodelando cómo los ingenieros idean, iteran y entregan, subrayando su rol vital en los flujos de trabajo modernos.

**Después (humanizado):**
> Los asistentes de IA te aceleran las partes aburridas. No todo. Arquitectura definitivamente no. Son buenísimos para boilerplate: configs, scaffolding de tests, refactors repetitivos. También son buenísimos para sonar bien estando mal.

Ejemplo completo de antes/después en `SKILL.md`.

## Fuentes principales

- **Natzir Turrado (2024)** — corpus de 360M tokens AI vs corpus humano ES: https://x.com/natzir9/status/1816039368919830599
- **El Economista** — amplificación con lista completa: https://www.eleconomista.es/tecnologia/noticias/12925132/07/24/de-crucial-a-esencial-estas-son-las-palabras-que-revelan-que-un-texto-esta-escrito-con-ia.html
- **El Debate** — trigrams + estructura: https://www.eldebate.com/tecnologia/20240726/posible-saber-texto-esta-escrito-ia-estas-palabras-pueden-advertirte-cns_216066.html
- **Genbeta** — em dash documentación: https://www.genbeta.com/inteligencia-artificial/signo-puntuacion-que-delataba-uso-chatgpt-era-autentico-quebradero-cabeza-openai-acaba-arreglar-problema
- **AdslZone** — pipeline "ahondar": https://www.adslzone.net/noticias/ia/motivo-chatgpt-palabra-ahondar/
- **Applesfera** — "No es X, es Y" + mayúscula tras `:` : https://www.applesfera.com/curiosidades/te-han-pillado-palabras-frases-que-hacen-evidente-que-utilizaste-chatgpt-lugar-pensar-a-apple
- **Pageon.ai ES** — lista 2025: https://www.pageon.ai/es/blog/the-most-overused-chatgpt-words
- **Lencarpio Substack** — tricolon, "No es X es Y", aperturas: https://luisorlandolencarpio.substack.com/p/11-senales-de-que-chatgpt-escribio

Lista completa en `SKILL.md` sección **Referencias**.

## Versión

- **1.0.0** — release inicial por Sebastián Breguel. 41 patrones, listas tieradas con evidencia de corpus ES, 8 patrones específicos del idioma, perfiles de contexto, voz neutra/panhispánica.

## Autoría y licencia

© 2026 Sebastián Breguel. Obra original. Licencia MIT.

Inspiración conceptual: `humanizer` EN (blader, MIT) — estructura de tabla tiered + modos rewrite/detect. Todo lo demás (corpus ES, patrones específicos del idioma, tabla de evidencia, perfiles de contexto adaptados, ejemplos, redacción completa) es trabajo propio.
