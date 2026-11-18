# MyTempHome Backend

The Django backend for MyTempHome. It contains the account, listing, and booking apps and exposes REST API endpoints for authentication, email verification, profile management, and image access.

[API Documentation](https://flobi1oe4c.apidog.io/)

## Technology

- **Language:** Python 3.13 or newer
- **Web framework:** Django 6.1 or newer
- **API:** Django REST Framework with JWT authentication and CORS support
- **Database:** PostgreSQL with `psycopg`
- **Package manager:** `uv`
- **Image storage:** Appwrite Storage
- **Email:** Django SMTP email backend using Brevo

## Authentication

Accounts use an email address and password. Signup sends an email verification link, and users must verify their email before logging in. Phone numbers are optional profile information and are not verified. The Django user model is `users.User`; client-facing profile data is represented by `AppUser`.

The authentication routes are under `/api/auth/`, including signup, login, token refresh, email verification, verification email resend, and profile management.

## Local setup

### Requirements

- Python 3.13 or newer
- [`uv`](https://docs.astral.sh/uv/)
- PostgreSQL

### Install and configure

PowerShell:

```powershell
Copy-Item .env.example .env
uv sync
```

Bash:

```bash
cp .env.example .env
uv sync
```

Set the database connection values and Django secret in `.env`. Configure the Appwrite credentials and Brevo SMTP settings for image storage and email delivery. Set `FRONTEND_URL` to the web app that handles email verification, and configure `CORS_ALLOWED_ORIGINS` for browser clients. Keep real credentials in `.env`; do not commit them.

The PostgreSQL database must be available with its schema prepared before the API can run. Follow the project owner's database setup and migration process.

### Run the server

PowerShell or Bash:

```shell
uv run python manage.py check
uv run python manage.py runserver
```

To make the development server reachable from a phone on the same network, bind it to all interfaces:

```shell
uv run python manage.py runserver 0.0.0.0:8000
```

## Tests

```shell
uv run python manage.py test
```
