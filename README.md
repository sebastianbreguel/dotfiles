# Dotfiles

Mi setup completo de desarrollo en macOS. No es solo config — es el sistema entero: que uso, por que lo uso, y como todo se conecta.

**150+ herramientas** trackeadas con explicacion personal de cada una. Un `setup.sh` que levanta todo desde cero. Y una [pagina interactiva](app/) para explorarlo visualmente.

## Que hay aqui

```
dotfiles/
  shell/          .zshrc, .p10k.zsh (Oh My Zsh + Powerlevel10k)
  git/            .gitconfig, global ignore
  ssh/            SSH config
  vscode/         VS Code settings
  gh/             GitHub CLI config
  .claude/        16 agentes, 22+ skills, hooks, commands, settings
  app/            Pagina React con todo el catalogo (Vite + React 19)
  animations/     Videos Manim del ecosistema Claude Code
  scripts/        Generador de docs desde data.js
  setup.sh        Setup automatizado de Mac nuevo
  TOOLKIT.md      Catalogo completo en markdown (generado)
```

## Lo mas interesante

### Claude Code Config (`.claude/`)

Lo que mas diferencia este setup. 25 agentes custom, 30+ skills, y un sistema de hooks que automatiza el workflow:

**Agentes** — personalidades especializadas que se invocan por tarea:

*Rotacion diaria* — los que uso constantemente:

| Agente | Para que |
|--------|----------|
| tech-lead | Decisiones tecnicas cross-domain |
| code-simplifier | Simplificar y limpiar codigo |
| skeptical-reviewer | Devil's advocate, stress-test decisiones |
| qa-test-engineer | Tests, edge cases, QA |
| ai-ml-expert | Arquitectura AI/ML, RAG, embeddings |

*Especializados* — para tareas puntuales:

| Agente | Para que |
|--------|----------|
| fullstack-refactor-architect | Arquitectura cross-stack |
| data-science-analytics | EDA, estadisticas, visualizacion |
| prompt-engineering | Craft y optimizar prompts para LLMs |
| ai-researcher | Papers, experimentos, escritura cientifica |
| neuroscience-ai-expert | Neurociencia, brain-computer interfaces |
| + 6 mas... | [Ver todos en .claude/agents/](.claude/agents/) |

**Skills** — workflows automatizados invocados con `/skill-name`:
`/sync-dotfiles`, `/ship-pr`, `/panel`, `/weekly-retro`, `/pre-merge-review`, `/explore-app`, `/browser-automation`, `/dream`, y [20+ mas](.claude/skills/).

**Plugins** — superpowers, context-mode, context7, skill-creator, playwright, frontend-design, claude-hud, feature-dev, claude-mem, code-simplifier.

### La Pagina (`app/`)

React app con busqueda, categorias, dark mode, y un panel de detalle con el "por que" de cada herramienta. La seccion "How It Works" tiene videos animados (Manim) que explican como funciona el ecosistema de Claude Code.

```bash
cd app && pnpm install && pnpm dev
```

### Single Source of Truth

`app/src/data.js` es la unica fuente de verdad. Contiene las 150+ herramientas con:
- Nombre, descripcion, categoria
- Comando de instalacion
- Costo (free/freemium/paid)
- Tags y herramientas relacionadas
- **Why** — por que uso cada una (en mi voz)

`TOOLKIT.md` y las secciones de instalacion del setup guide se **generan automaticamente** desde data.js:

```bash
node scripts/generate-docs.js
```

## Setup rapido

```bash
git clone git@github.com:sebastianbreguel/dotfiles.git ~/dotfiles
cd ~/dotfiles
./setup.sh
```

Para la guia paso a paso completa: [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)

## Sync

Para mantener el repo actualizado con lo que realmente esta instalado en la maquina:

```bash
# Desde Claude Code:
/sync-dotfiles
```

Esto copia configs, detecta herramientas nuevas/removidas, actualiza `data.js`, y regenera toda la documentacion.

## Stack

| Capa | Herramientas |
|------|-------------|
| Shell | zsh + Oh My Zsh + Powerlevel10k + fzf |
| Editor | Cursor + VS Code (21 extensions) |
| AI | Claude Code (25 agentes, 30+ skills, 10 plugins) |
| Terminal | tmux + cmux + htop + nvtop |
| Langs | Node 25 (NVM) + Python 3.14 (uv) + Bun + Go + Deno |
| DB | PostgreSQL 15 + Redis |
| DevOps | Docker + Vercel + GitHub CLI |
