# AptPal Frontend

The single-page web client for AptPal, delivering rental discovery, interactive OpenStreetMap exploration, real-time messaging, and multi-step listing workflows.

## Tech Stack

- **Framework & Runtime:** React 19 (`19.3.1`) with TypeScript
- **Build Tool & Dev Server:** Vite 8 (`@vitejs/plugin-react`)
- **Routing:** React Router v7 (`react-router-dom`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`, `tailwindcss`)
- **Design System & Palette:** Synchronized Figma design tokens (`primary`, `secondary`, `tertiary`, `quaternary`, `grey`)
- **Theme Support:** Triple-theme mode (`light`, `dark`, `system`) powered by `ThemeContext` and CSS custom variables
- **Interactive Maps:** Leaflet & OpenStreetMap (`leaflet`, `@types/leaflet`) for map search, coordinate picking, and listing pins
- **Icons:** Lucide React (`lucide-react`)
- **Networking & Real-Time:**
  - Axios for REST API calls
  - Native WebSockets for real-time Django Channels chat (message push, typing indicators, read receipts)
- **Utilities:** `clsx`, `tailwind-merge`
- **Linting & Code Quality:** Oxlint (`oxlint`), TypeScript strict checks
- **Package Manager:** `npm`

## Core Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type-check and production build
npm run build

# Run linter
npm run lint
```
