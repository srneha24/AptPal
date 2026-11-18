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

## Setup

Requirements: Node.js and npm. The backend API must also be running for API-backed features.

Create a local environment file from the example, install dependencies, and start the Vite dev server.

### PowerShell

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

### Bash

```bash
cp .env.example .env
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` to the backend API base URL, including `/api`. The example uses `http://localhost:8000/api`.

## Checks

These npm commands work in PowerShell and Bash:

```bash
npm run build
npm run lint
```
