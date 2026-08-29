#!/bin/bash
set -e

echo "Running migrations..."
python manage.py migrate --noinput

echo "Creating superuser..."
python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@zandev.dev', 'admin123')
    print('Superuser created')
else:
    print('Superuser exists')
"

echo "Seeding designs..."
python manage.py seed_designs 2>/dev/null || true

echo "Running keep-alive..."
python keep_alive.py 2>/dev/null || true

echo "Collecting static..."
python manage.py collectstatic --noinput 2>/dev/null || true

echo "Done!"
