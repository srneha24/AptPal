# AGENTS.md — AptPal Project Guidelines

Operational rules and commands for AI coding agents working on AptPal (Backend: Django/Postgres, Frontend: React/Tailwind, Mobile: React Native/Expo SDK 58).

## Essential Commands

### Backend (`/backend`)

- **Package Manager:** Always use `uv`. Never call `pip` directly.
- **Install dependencies:** `cd backend && uv sync`
- **Add dependency:** `cd backend && uv add <package>`
- **Run dev server:** `cd backend && uv run python manage.py runserver`
- **System check:** `cd backend && uv run python manage.py check`
- **Migrations:** `cd backend && uv run python manage.py makemigrations && uv run python manage.py migrate`
- **Run all tests:** `cd backend && uv run python manage.py test`
- **Run single test:** `cd backend && uv run python manage.py test <app>.tests.<test_module>`

### Frontend (`/frontend`)

- **Node / Package Manager:** `npm` (on Windows, use `cmd.exe /c npm ...` or `npm.cmd` if blocked by PowerShell execution policy).
- **Install dependencies:** `cd frontend && npm install`
- **Run dev server:** `cd frontend && npm run dev`
- **Type-check & build:** `cd frontend && npm run build` (runs `tsc -b && vite build`)
- **Type-check only:** `cd frontend && npx tsc -b`
- **Lint:** `cd frontend && npm run lint` (runs `oxlint`)

### Mobile (`/mobile`)

- **Framework:** Expo SDK 58 (`~58.0.25`), React Native 0.88.
- **Install dependencies:** `cd mobile && npm install` (for native modules: `npx expo install <module>`)
- **Run Expo server:** `cd mobile && npx expo start`
- **Type-check:** `cd mobile && npx tsc --noEmit`
- **Inspect Expo config:** `set EXPO_NO_TELEMETRY=1 && cd mobile && npx expo config --type public`

---

## Architectural & Project Boundaries

- **Uniform Project Naming:** Every project configuration MUST use `"name": "aptpal"`.
  - Backend: [backend/pyproject.toml](file:///c:/Users/Neha/Documents/Programming/AptPal/backend/pyproject.toml) (`name = "aptpal"`, settings module: `aptpal.settings`).
  - Frontend: [frontend/package.json](file:///c:/Users/Neha/Documents/Programming/AptPal/frontend/package.json) (`name = "aptpal"`).
  - Mobile: [mobile/package.json](file:///c:/Users/Neha/Documents/Programming/AptPal/mobile/package.json) (`name = "aptpal"`), [mobile/app.json](file:///c:/Users/Neha/Documents/Programming/AptPal/mobile/app.json) (`name = "AptPal"`, `slug = "aptpal"`).
  - Always synchronize lockfiles ([backend/uv.lock](file:///c:/Users/Neha/Documents/Programming/AptPal/backend/uv.lock), [frontend/package-lock.json](file:///c:/Users/Neha/Documents/Programming/AptPal/frontend/package-lock.json), [mobile/package-lock.json](file:///c:/Users/Neha/Documents/Programming/AptPal/mobile/package-lock.json)) when updating project metadata.
- **Directory Structure:**
  - `backend/aptpal/`: Django project core (`settings.py`, `urls.py`, `wsgi.py`, `asgi.py`).
  - `backend/<app>/`: Domain applications (rentals, accounts, etc.).
  - `frontend/src/`: React SPA source (`theme/`, `context/`, `components/`, `pages/`).
  - `mobile/`: Expo app source (`theme/`, `constants/`, `context/`, `components/`, `screens/`).

---

## Design System & Theme Parity

Frontend and mobile MUST remain visually and stylistically synchronized at all times.

- **Figma Palette:** Extracted from Figma project `AptPal` (`ColorPalette` node `1:2`):
  - `primary`: 100–700 (`base: #1F0A57`)
  - `secondary`: 100–700 (`base: #510782`)
  - `tertiary`: 100–700 (`base: #B32E5F`)
  - `quaternary`: 100–700 (`base: #CB1A7D`)
  - `grey`: 100–700 (light surface: `#F1F0F1`, dark surface: `#1D1C20`)
- **Triple Theme Support:** Both apps must support `light`, `dark`, and `system` modes:
  - Frontend: [frontend/src/context/ThemeContext.tsx](file:///c:/Users/Neha/Documents/Programming/AptPal/frontend/src/context/ThemeContext.tsx) toggles `.dark` class, consumes `--color-theme-*` variables from [frontend/src/index.css](file:///c:/Users/Neha/Documents/Programming/AptPal/frontend/src/index.css).
  - Mobile: [mobile/context/ThemeContext.tsx](file:///c:/Users/Neha/Documents/Programming/AptPal/mobile/context/ThemeContext.tsx) consumes `useColorScheme()`, tokens in [mobile/constants/Colors.ts](file:///c:/Users/Neha/Documents/Programming/AptPal/mobile/constants/Colors.ts), and [mobile/app.json](file:///c:/Users/Neha/Documents/Programming/AptPal/mobile/app.json) (`"userInterfaceStyle": "automatic"`).
  - When introducing new tokens or components, define matching semantic colors for both platforms.

---

## Coding Conventions & TypeScript Rules

- **Frontend TypeScript (`verbatimModuleSyntax`):**
  - Always use explicit type-only imports: `import type { Foo } from '...'`.
  - Keep component files clean for Fast Refresh compliance.
- **Mobile UI:**
  - Use StyleSheet / themed style objects consuming `useTheme().colors`.
  - Use `@expo/vector-icons` to correspond with web's `lucide-react` icons.
- **Backend / Django:**
  - Use PostgreSQL with `psycopg` (binary locally).
  - Expose API endpoints using Django REST framework (`rest_framework`) with CORS configured.
  - Follow PEP 8 and `snake_case` in Python; `camelCase` for TypeScript/React.

---

## Environment & Gotchas

- **Django Settings Module:** Always set `DJANGO_SETTINGS_MODULE=aptpal.settings`. Do not use `aptpal_backend`.
- **Environment Variables:** Load environment variables via `python-dotenv`.
- **Offline uv:** If working offline or in sandboxes without PyPI access, use `uv lock --offline` and `uv run --no-sync` / `uv run --offline`.
- **Windows CLI Quirk:** On Windows PowerShell, npm scripts may trigger execution policy errors (`PSSecurityException`). Always invoke via `cmd.exe /c "npm ..."` or `npm.cmd`.
- **Expo Telemetry in Sandboxes:** Prefix Expo commands with `set EXPO_NO_TELEMETRY=1` to prevent permission errors on `~/.expo`.

---

## Git & PR Hygiene

- **Branch naming:** `feat/<feature>`, `fix/<bug>`, `refactor/<scope>`.
- **Pre-commit verification checklist:**
  1. Backend: `cd backend && uv run python manage.py check && uv run python manage.py test`
  2. Frontend: `cd frontend && npm run build && npm run lint`
  3. Mobile: `cd mobile && npx tsc --noEmit`
- Commit messages: Imperative and scoped (e.g. `feat(mobile): add rental search filter card`).
