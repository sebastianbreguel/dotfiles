# Dotfiles Toolkit Page

Pagina interactiva para explorar las 150+ herramientas del setup. React 19 + Vite.

## Dev

```bash
npm install && npm run dev
```

## Estructura

- `src/data.js` — single source of truth con todas las herramientas
- `src/App.jsx` — layout principal con busqueda, categorias, dark mode
- `src/components/` — cards, panel de detalle, seccion "How It Works" sin videos generados

## Build

```bash
npm run build
```

Output en `dist/`. Deployable en cualquier hosting estatico.
