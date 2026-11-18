# AptPal Site

The public-facing web portal for AptPal, with a landing page, rental posting discovery, and project information.

## Tech Stack

- **Framework & Runtime:** React 19 (`19.3.1`) with TypeScript
- **Build Tool & Dev Server:** Vite 8 (`@vitejs/plugin-react`)
- **Routing:** React Router v7 (`react-router-dom`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`, `tailwindcss`)
- **Design System & Palette:** Synchronized Figma design tokens (`primary`, `secondary`, `tertiary`, `quaternary`, `grey`)
- **Theme Support:** Light, dark, and system modes powered by `ThemeContext` and CSS custom variables
- **Icons:** Lucide React (`lucide-react`)
- **Networking:** Axios for REST API calls
- **Utilities:** `clsx`, `tailwind-merge`
- **Linting & Code Quality:** Oxlint (`oxlint`), TypeScript strict checks
- **Package Manager:** `npm`

## Setup

Requirements: Node.js and npm.

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

Set `VITE_FRONTEND_URL` in `.env` to the base URL of the AptPal frontend. The site uses it to build the Log in and Join AptPal links. The example uses `http://localhost:5173`.

## Checks

These npm commands work in PowerShell and Bash:

```bash
npm run build
npm run lint
```
