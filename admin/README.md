# AptPal Admin

The operations dashboard for AptPal, supporting listing moderation, landlord verification, scammer management, and platform analytics.

## Tech Stack

- **Framework & Runtime:** React 19 (`19.3.1`) with TypeScript
- **Build Tool & Dev Server:** Vite 8 (`@vitejs/plugin-react`)
- **Routing:** React Router v7 (`react-router-dom`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`, `tailwindcss`)
- **Design System & Palette:** Synchronized Figma design tokens (`primary`, `secondary`, `tertiary`, `quaternary`, `grey`)
- **Theme Support:** Triple-theme mode (`light`, `dark`, `system`) powered by `ThemeContext` and CSS custom variables
- **Icons:** Lucide React (`lucide-react`)
- **Networking:** Axios for REST API calls
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
