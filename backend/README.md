# AptPal Backend

The server-side application for AptPal, delivering RESTful APIs, real-time WebSocket communication, AI image moderation, and third-party integrations.

[API Documentation](https://flobi1oe4c.apidog.io/)

## Tech Stack

- **Runtime & Language:** Python >= 3.13
- **Web Framework:** Django 6.1.3
- **ASGI & WebSockets:** Django Channels & Daphne (bi-directional real-time chat between landlords and tenants)
- **API Framework:** Django REST Framework (`djangorestframework`) with `django-cors-headers`
- **Authentication:** JWT Token Authentication (`djangorestframework-simplejwt`) with custom user model (`accounts.User`), role specialization (Landlords & Tenants), and mandatory post-signup phone verification
- **Database:** PostgreSQL with `psycopg[binary]` driver
- **Package Manager:** `uv` (Fast Python package manager)
- **AI & Moderation:** Groq Vision models (`llama-3.2-11b-vision-preview` / `llama-3.2-90b-vision-preview`) via Groq API for automated rental photo safety checks
- **External Services:** Appwrite Storage for uploaded files only; Django's email backend with Brevo SMTP for outbound email.
- **Mapping & Geodata:** OpenStreetMap geo-coordinates (latitude/longitude) and spatial bounding-box search

## Core Commands

```bash
# Install dependencies
uv sync

# Add a package
uv add <package-name>

# Run Django system checks
uv run python manage.py check

# Database migrations
uv run python manage.py makemigrations
uv run python manage.py migrate

# Start dev server
uv run python manage.py runserver

# Run tests
uv run python manage.py test
```
