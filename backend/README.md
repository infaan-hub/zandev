# Zandeveloper API Backend

Django REST API powering the Zandeveloper Design-to-Code platform.

## Overview

Provides endpoints for design management, user authentication, analytics, and admin operations.

## Tech Stack

- Django 5.2
- Django REST Framework 3.16
- PostgreSQL (Neon)
- Gunicorn (Production)

## API Endpoints

### Public
- `GET /api/designs/` - List all designs
- `GET /api/designs/<id>/` - Design detail
- `GET /api/categories/` - List categories
- `POST /api/contact/` - Submit contact form

### Authenticated
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `GET /api/dashboard/` - User dashboard data
- `POST /api/collections/` - Create collection

### Admin
- `GET /api/admin/designs/` - Manage designs
- `GET /api/admin/users/` - User management
- `GET /api/admin/logs/` - Audit logs
- `GET /api/admin/security/` - Security dashboard

## Setup

```bash
# Create virtual environment
python -m venv myvenv
source myvenv/bin/activate  # Linux/Mac
myvenv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver
```

## Database Models

- **Design** - UI component with code
- **Category** - Design categories
- **Collection** - User design collections
- **Review** - User ratings
- **AnalyticsEvent** - Usage tracking
- **ActivityLog** - User actions
- **ThreatAlert** - Security threats

## Security

- Token-based authentication
- Rate limiting (100/hour anonymous, 1000/hour users)
- IP blocking
- CORS protection
- XSS/CSRF protection

## License

Private - Zandeveloper
