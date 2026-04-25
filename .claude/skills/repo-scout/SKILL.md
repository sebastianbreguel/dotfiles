---
name: repo-scout
description: "Analyze a GitHub repo to generate a contribution profile, project interest map, and a ranked table of feature opportunities with predicted merge likelihood. Use this skill whenever the user wants to contribute to an open-source repo and needs to understand what the maintainers care about, what gets merged vs rejected, or what improvements would have the highest chance of acceptance. Also use when asked to 'scout a repo', 'analyze contribution patterns', 'what should I contribute', 'profile this project', or 'find good first contributions'. Triggers on any intent to understand a repo's contribution dynamics before submitting work."
---

# Repo Scout

Estás analizando un repositorio de GitHub para ayudar al usuario a hacer contribuciones de alto impacto que sean aceptadas. Tu trabajo es entender el código, las preferencias del maintainer, y producir oportunidades accionables.

## Resumen

Este skill produce tres outputs:
1. **Perfil de Contribución** — Qué acepta, rechaza y le importa al owner
2. **Mapa de Interés del Proyecto** — Hacia dónde va, áreas activas, áreas descuidadas
3. **Tabla de Oportunidades** — Features/fixes rankeados con score de merge estimado

## Step 0: Gate Check (antes de todo)

Antes de analizar nada, verificar condiciones de entrada:

```bash
# Contribution guidelines
cat CONTRIBUTING.md 2>/dev/null || cat .github/CONTRIBUTING.md 2>/dev/null || echo "NO_CONTRIBUTING_GUIDE"

# CLA requirements
cat CLA.md 2>/dev/null; grep -ri "contributor license" CONTRIBUTING.md .github/ 2>/dev/null || echo "NO_CLA"

# Code owners
cat CODEOWNERS 2>/dev/null || cat .github/CODEOWNERS 2>/dev/null || echo "NO_CODEOWNERS"

# PR template
cat .github/PULL_REQUEST_TEMPLATE.md 2>/dev/null || cat .github/pull_request_template.md 2>/dev/null || echo "NO_PR_TEMPLATE"
```

**Si hay CLA obligatorio y el usuario no puede firmarlo → reportar inmediatamente y abortar.** No tiene sentido analizar oportunidades con 0% de merge.

Si existe CONTRIBUTING.md, extraer: estilo requerido, tests obligatorios, proceso de PR, restricciones de scope. Esto informa todo el análisis posterior.

Si existe CODEOWNERS, mapear qué persona/equipo revisa qué directorio — el score de merge varía según *quién* revisa.

## Step 1: Análisis del Repo

Entender la forma del repo:

```bash
# Estructura — usar tokei/cloc si disponible, sino fallback estructurado
tokei . 2>/dev/null || cloc . --quiet 2>/dev/null || find . -type f -not -path './.git/*' -not -path './node_modules/*' -not -path './.venv/*' | sed 's|/[^/]*$|/|' | sort | uniq -c | sort -rn | head -30

# Actividad reciente (últimos 6 meses — peso alto)
git log --oneline --since="6 months ago" | head -40
git shortlog -sn --no-merges --since="6 months ago" | head -10

# Actividad histórica (contexto, peso bajo)
git shortlog -sn --no-merges | head -10

# CI/CD — entender qué requirements hay
ls .github/workflows/ 2>/dev/null
cat .github/workflows/*.yml 2>/dev/null | grep -E '(pytest|jest|cargo test|go test|coverage|ruff|eslint|mypy|tsc|clippy)' | head -20
```

Identificar: lenguaje principal, framework, patrones de arquitectura, cobertura de tests, setup de CI, calidad de documentación. Notar áreas con alto churn (muchos commits recientes) y zonas frías (sin tocar por meses).

**Del CI, extraer:** requirements de coverage, linters, type checkers, formatters. Esto ajusta directamente las estimaciones de esfuerzo en la tabla final.

## Step 2: Inteligencia de GitHub

Usar `gh` CLI para obtener datos de contribución. Apuntar a 50+ data points entre issues y PRs.

```bash
# PRs mergeados — qué aceptan
gh pr list --state merged --limit 50 --json title,body,labels,files,additions,deletions,author,mergedAt,reviews

# PRs rechazados/cerrados — qué NO quieren
gh pr list --state closed --limit 30 --json title,body,labels,closedAt,author,reviews,comments --search "is:unmerged"

# PRs abiertos — trabajo en curso (para detectar colisiones)
gh pr list --state open --limit 30 --json title,body,labels,author,files

# Issues abiertos — qué necesita hacerse
gh issue list --state open --limit 50 --json title,body,labels,comments,createdAt,author

# Issues cerrados — qué se priorizó
gh issue list --state closed --limit 30 --json title,body,labels,closedAt,author

# Patrones de review recientes
gh pr list --state merged --limit 20 --json reviews,comments,reviewDecision
```

Procesar estos datos con `ctx_execute` o scripts inline — NO volcar JSON crudo al contexto. Escribir código de análisis que extraiga patrones.

### Fallback para repos chicos (<5 PRs)

Si el repo tiene menos de 5 PRs (común en proyectos personales o nuevos):
- Analizar commits directos del owner en lugar de PRs
- Inferir dirección del proyecto desde README, docs, y estructura de issues
- Usar el historial de issues como señal principal
- Bajar la confianza general del análisis y decirlo explícitamente

## Step 3: Construir Perfil de Contribución

Analizar los datos para responder:

- **¿Qué se mergea?** — Tipos de cambios (bug fixes, features, docs, refactors), distribución de tamaño, qué áreas del código
- **¿Qué se rechaza?** — Razones comunes de cierre (scope creep, estilo inconsistente, no alineado con roadmap, sin tests)
- **Estilo de review** — ¿Qué tan riguroso? ¿Nitpicky con estilo? ¿Requiere tests? ¿Prefiere PRs chicos o grandes?
- **Tiempo de respuesta** — ¿Qué tan rápido revisan? ¿Están activos?
- **Contribuidores preferidos** — ¿Aceptan contribuciones externas? ¿Hay patrones en quién logra merge?
- **Patrones de calidad de código** — De los diffs mergeados: ¿piden type hints? ¿Docstrings? ¿Prefieren funcional vs OOP? ¿Hay estándares implícitos?

**Ponderación temporal:** dar ~3x más peso a los últimos 6 meses vs actividad anterior. Los patrones de merge de hace 2 años pueden ser irrelevantes.

Presentar como perfil estructurado:

```
## Perfil de Contribución: {owner}/{repo}

**Estilo del maintainer**: {caracterización breve}
**Tasa de merge para PRs externos**: {estimado %}
**Tiempo promedio de review**: {estimado}
**Tamaño de PR preferido**: {chico/mediano/grande} ({avg additions} líneas)
**CI requirements**: {coverage %, linters, type checkers detectados}

### Qué se mergea
- {patrón 1}
- {patrón 2}

### Qué se rechaza
- {patrón 1}
- {patrón 2}

### Expectativas de review
- {tests requeridos? style guide? docs? CODEOWNERS?}
```

## Step 4: Mapa de Interés del Proyecto

Cruzar análisis de código con actividad de issues/PRs para mapear:

- **Zonas calientes** — Áreas con muchos issues, PRs y commits recientes
- **Áreas de crecimiento** — Features nuevos siendo agregados, directorios nuevos
- **Puntos de dolor** — Bug reports recurrentes, quejas de performance
- **Áreas descuidadas** — Issues abiertos sin actividad, código sin tocar
- **Señales de roadmap** — Labels como "roadmap", "v2", "planned"; uso de milestones; comentarios del owner sobre dirección futura
- **Trabajo en curso** — PRs abiertos que ya cubren ciertos temas (para evitar colisiones)

```
## Mapa de Interés del Proyecto

**Dirección del proyecto**: {hacia dónde va}
**Áreas más activas**: {lista}
**Puntos de dolor conocidos**: {lista}
**Descuidado pero necesario**: {lista}
**Trabajo en curso (PRs abiertos)**: {lista breve de temas cubiertos}
```

## Step 5: Tabla de Oportunidades

Este es el entregable principal. Combinar todo para producir una tabla rankeada de oportunidades de contribución.

**Antes de agregar una oportunidad, verificar que no hay un PR abierto que ya la cubra.** Si hay trabajo en curso, marcar como "Colisión" o excluir.

Para cada oportunidad, evaluar:

| Columna | Cómo evaluar |
|---------|-------------|
| **Feature/Fix** | Descripción concreta del cambio |
| **Razón** | Por qué importa — linkeado a issues, pain points, o gaps |
| **Impacto** | Alto/Medio/Bajo — basado en cuántos usuarios/áreas afecta |
| **Esfuerzo** | S/M/L/XL — complejidad estimada (incluyendo requirements de CI) |
| **Líneas est.** | Estimación rough de líneas del cambio |
| **Score de Merge** | Score 0-100 de likelihood de merge basado en el perfil |

### Cómo estimar el Score de Merge

Este score es una **heurística explícita**, no una probabilidad calibrada. Base de 30 (las contribuciones externas siempre tienen fricción) y ajustar:

| Factor | Ajuste |
|--------|--------|
| Coincide con lo que se mergea | +20 a +30 |
| Evita lo que se rechaza | +10 a +20 |
| Hay un issue abierto pidiéndolo | +15 a +25 |
| Coincide con el tamaño de PR preferido | +5 a +10 |
| Está en un área activa del codebase | +5 a +10 |
| El owner es receptivo a contribuciones externas | +10 a +20 / -10 a -20 |
| CONTRIBUTING.md existe y se puede cumplir | +5 |
| CI requirements son claros y cumplibles | +5 |
| Hay un PR abierto similar (colisión parcial) | -15 a -25 |

**Cap en 95** — nunca hay certeza total. **Floor en 10** — si es tan bajo, probablemente no vale la pena listarlo.

### Formato de output

```
## Tabla de Oportunidades

| # | Feature/Fix | Razón | Impacto | Esfuerzo | Líneas | Score de Merge |
|---|------------|-------|---------|----------|--------|----------------|
| 1 | ... | ... | Alto | S | ~50 | 85 |
| 2 | ... | ... | Medio | M | ~200 | 70 |
| ... | | | | | | |
```

Ordenar por score combinado de (Impacto × Score de Merge / Esfuerzo) — alto impacto, alto score, bajo esfuerzo primero.

## Lineamientos

- Ser honesto con las chances de merge. Si el repo raramente acepta PRs externos, decirlo — no inflar números.
- Linkear oportunidades a issues específicos cuando sea posible (`#123`).
- Factorizar CONTRIBUTING.md y PR templates en las recomendaciones.
- Mantener el análisis fundamentado en datos. Cada claim debe trazar a PRs, issues, o patrones de código específicos.
- Escribir el reporte completo a `repo-scout-{owner}-{repo}.md` en el directorio actual. Informar al usuario el file path cuando termine.
- Dar un resumen breve de 3 líneas inline (headline del perfil, top 3 oportunidades, file path).
- Si `gh` auth falla o el repo es privado sin acceso, informar al usuario inmediatamente en vez de adivinar.
