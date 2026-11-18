# AGENTS.md — AptPal Project Guidelines

Operational rules and commands for AI coding agents working on AptPal (Backend: Django/Postgres, Frontend/Site/Admin: React/Tailwind, Mobile: React Native/Expo SDK 58).

## Essential Commands

### Backend (`/backend`)

- **Package Manager:** Always use `uv`. Never call `pip` directly.
- **Install dependencies:** `cd backend && uv sync`
- **Add dependency:** `cd backend && uv add <package>`
- **Run dev server:** `cd backend && uv run python manage.py runserver`
- **System check:** `cd backend && uv run python manage.py check`
- **Database migrations:** Agents must never handle database migrations. Do not create, edit, delete, inspect by execution, or apply migration files; do not run `makemigrations`, `makemigration`, `migrate`, or other commands that generate or apply database migrations. Leave all migration work to the project owner.
- **Run all tests:** `cd backend && uv run python manage.py test`
- **Run single test:** `cd backend && uv run python manage.py test <app>.tests.<test_module>`

### Frontend (`/frontend`)

- **Node / Package Manager:** `npm` (on Windows, use `cmd.exe /c npm ...` or `npm.cmd` if blocked by PowerShell execution policy).
- **Install dependencies:** `cd frontend && npm install`
- **Run dev server:** `cd frontend && npm run dev`
- **Type-check & build:** `cd frontend && npm run build` (runs `tsc -b && vite build`)
- **Type-check only:** `cd frontend && npx tsc -b`
- **Lint:** `cd frontend && npm run lint` (runs `oxlint`)

### Site (`/site`) — Public Portal

- **Node / Package Manager:** `npm` (on Windows, use `cmd.exe /c npm ...` or `npm.cmd` if blocked by PowerShell execution policy).
- **Install dependencies:** `cd site && npm install`
- **Run dev server:** `cd site && npm run dev`
- **Type-check & build:** `cd site && npm run build` (runs `tsc -b && vite build`)
- **Type-check only:** `cd site && npx tsc -b`
- **Lint:** `cd site && npm run lint` (runs `oxlint`)

### Admin (`/admin`) — Operations Dashboard

- **Node / Package Manager:** `npm` (on Windows, use `cmd.exe /c npm ...` or `npm.cmd` if blocked by PowerShell execution policy).
- **Install dependencies:** `cd admin && npm install`
- **Run dev server:** `cd admin && npm run dev`
- **Type-check & build:** `cd admin && npm run build` (runs `tsc -b && vite build`)
- **Type-check only:** `cd admin && npx tsc -b`
- **Lint:** `cd admin && npm run lint` (runs `oxlint`)

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
  - Site: [site/package.json](file:///c:/Users/Neha/Documents/Programming/AptPal/site/package.json) (`name = "aptpal"`).
  - Admin: [admin/package.json](file:///c:/Users/Neha/Documents/Programming/AptPal/admin/package.json) (`name = "aptpal"`).
  - Mobile: [mobile/package.json](file:///c:/Users/Neha/Documents/Programming/AptPal/mobile/package.json) (`name = "aptpal"`), [mobile/app.json](file:///c:/Users/Neha/Documents/Programming/AptPal/mobile/app.json) (`name = "AptPal"`, `slug = "aptpal"`).
  - Always synchronize lockfiles ([backend/uv.lock](file:///c:/Users/Neha/Documents/Programming/AptPal/backend/uv.lock), [frontend/package-lock.json](file:///c:/Users/Neha/Documents/Programming/AptPal/frontend/package-lock.json), [site/package-lock.json](file:///c:/Users/Neha/Documents/Programming/AptPal/site/package-lock.json), [admin/package-lock.json](file:///c:/Users/Neha/Documents/Programming/AptPal/admin/package-lock.json), [mobile/package-lock.json](file:///c:/Users/Neha/Documents/Programming/AptPal/mobile/package-lock.json)) when updating project metadata.
- **Directory Structure:**
  - `backend/aptpal/`: Django project core (`settings.py`, `urls.py`, `wsgi.py`, `asgi.py`).
  - `backend/<app>/`: Domain applications (rentals, accounts, etc.).
  - `frontend/src/`: React SPA source — authenticated app (`theme/`, `context/`, `components/`, `pages/`).
  - `site/src/`: React SPA source — public portal (`theme/`, `context/`, `components/`, `pages/`).
  - `admin/src/`: React SPA source — admin operations dashboard (`theme/`, `context/`, `components/`, `pages/`).
  - `mobile/`: Expo app source (`theme/`, `constants/`, `context/`, `components/`, `screens/`).

---

## Design System & Theme Parity

Frontend and mobile MUST remain visually and stylistically synchronized at all times. This applies to all three web frontends (`frontend/`, `site/`, `admin/`) and the mobile app.

- **Figma Palette:** Extracted from Figma project `AptPal` (`ColorPalette` node `1:2`):
  - `primary`: 100–700 (`base: #1F0A57`)
  - `secondary`: 100–700 (`base: #510782`)
  - `tertiary`: 100–700 (`base: #B32E5F`)
  - `quaternary`: 100–700 (`base: #CB1A7D`)
  - `grey`: 100–700 (light surface: `#F1F0F1`, dark surface: `#1D1C20`)
- **Triple Theme Support:** Both apps must support `light`, `dark`, and `system` modes:
  - Frontend: [frontend/src/context/ThemeContext.tsx](file:///c:/Users/Neha/Documents/Programming/AptPal/frontend/src/context/ThemeContext.tsx) toggles `.dark` class, consumes `--color-theme-*` variables from [frontend/src/index.css](file:///c:/Users/Neha/Documents/Programming/AptPal/frontend/src/index.css).
  - Site: [site/src/context/ThemeContext.tsx](file:///c:/Users/Neha/Documents/Programming/AptPal/site/src/context/ThemeContext.tsx) — same pattern as frontend.
  - Admin: [admin/src/context/ThemeContext.tsx](file:///c:/Users/Neha/Documents/Programming/AptPal/admin/src/context/ThemeContext.tsx) — same pattern as frontend.
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
  - Avoid unnecessary `try`/`except` clauses. Never catch broadly with `except Exception` or bare `except:`; when handling an exception is necessary, catch only the specific exception types that can be safely handled.
  - Never expose Django user IDs in responses sent to the frontend or mobile app; client-facing account data must use the `AppUser` object.
  - Use Appwrite for file storage only. Do not use Appwrite Account or other Appwrite services for authentication, email, or SMS.
  - Send email through Django's configured email backend using Brevo SMTP. Phone numbers are optional profile contact information and are not verified; do not implement SMS verification.
  - Keep provider credentials in server-side environment variables and out of source control.

---

## Environment & Gotchas

- **Django Settings Module:** Always set `DJANGO_SETTINGS_MODULE=aptpal.settings`. Do not use `aptpal_backend`.
- **Environment Variables:** Load environment variables via `python-dotenv`.
- **Offline uv:** If working offline or in sandboxes without PyPI access, use `uv lock --offline` and `uv run --no-sync` / `uv run --offline`.
- **Windows CLI Quirk:** On Windows PowerShell, npm scripts may trigger execution policy errors (`PSSecurityException`). Always invoke via `cmd.exe /c "npm ..."` or `npm.cmd`.
- **Expo Telemetry in Sandboxes:** Prefix Expo commands with `set EXPO_NO_TELEMETRY=1` to prevent permission errors on `~/.expo`.

---

## Notion & Project Tracking Rules

- **API Documentation:** Consult the [AptPal Apidog documentation](https://flobi1oe4c.apidog.io/) for API contracts. If documentation is unavailable or unclear, use the backend implementation as the source of truth.

- **Consult Notion Sources for Insights:** Agents MUST ALWAYS consult the two Notion resources for project requirements, architecture context, and roadmaps:
  1. **AptPal Plans** (Page ID: `41961011-8983-8024-b16f-d3ce6b64e7e2`, [Notion Page](https://app.notion.com/p/4196101189838024b16fd3ce6b64e7e2)) — feature specs, user roles, security checks, design tokens.
  2. **AptPal Roadmap** (Database ID: `41961011-8983-80b6-9737-fb902fc92d36`, [Notion Database](https://app.notion.com/p/41961011898380b69737fb902fc92d36)) — official project tracker and ticket board.
- **Roadmap Ticket Workflow:**
  - For noteworthy or substantial features and tasks, check the AptPal Roadmap before starting. If a matching ticket exists, move it to `In progress`; if none exists, create a ticket and set it to `In progress`.
  - If the user asks to remember or build a substantial task later, create a ticket with status `Planned` and leave it there until work begins.
  - Do not create roadmap tickets for minor fixes, simple edits, or routine housekeeping.
  - When a tracked task is verified and finished, move its ticket to `Completed`.
- **README Files Policy:** DO NOT modify, generate, or update any `README.md` files (root, `/backend`, `/frontend`, `/site`, `/admin`, `/mobile`) unless the user explicitly instructs you to do so.
- **Test Execution Policy:** Automated tests (`python manage.py test`, npm test, etc.) MUST ONLY be executed when the user explicitly instructs it. Do not run test suites autonomously during pre-commit checks or development unless requested.

---

## Git & PR Hygiene

- **Branch naming:** `feat/<feature>`, `fix/<bug>`, `refactor/<scope>`.
- **Pre-commit verification checklist:**
  1. Backend: `cd backend && uv run python manage.py check` (run `test` ONLY if user explicitly requested)
  2. Frontend: `cd frontend && npm run build && npm run lint`
  3. Site: `cd site && npm run build && npm run lint`
  4. Admin: `cd admin && npm run build && npm run lint`
  5. Mobile: `cd mobile && npx tsc --noEmit`
- Commit messages: Imperative and scoped (e.g. `feat(mobile): add rental search filter card`).

## Code Formatting & Output Rules

- **No Long Single-Line Code:** Never write long, minified, or single-line code blocks. All code must be properly formatted with standard indentation and newlines.
- **Line Length Limits:** Keep individual lines of code reasonably short (ideally under 100-120 characters) by breaking complex statements, JSX elements, and function arguments across multiple lines.
- **JSX & React Best Practices:** Multi-attribute JSX elements must have each attribute on a new line, and nested children must be properly indented.
