#!/bin/bash
set -e

export DJANGO_SETTINGS_MODULE=zda.settings
export DATABASE_URL="postgresql://neondb_owner:npg_pBYIbFKm7H0f@ep-morning-king-axkqo4hc-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require"

cd backend/zda

pip install -r ../requirements.txt

echo "Creating media directories..."
mkdir -p media/designs/gallery media/designs/previews

echo "Copying gallery images..."
if [ -d "../media/designs/gallery" ]; then
    cp -r ../media/designs/gallery/* media/designs/gallery/
    COPIED=$(ls media/designs/gallery/*.jpg 2>/dev/null | wc -l)
    echo "Copied $COPIED images to media/designs/gallery/"
else
    echo "ERROR: Source gallery not found at ../media/designs/gallery"
    echo "Contents of backend/media: $(ls ../media/ 2>/dev/null)"
fi

python manage.py migrate --noinput

python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@zandev.dev', 'admin123')
    print('Created admin')
else:
    print('Admin exists')
"

python keep_alive.py 2>/dev/null || true
python manage.py seed_designs 2>/dev/null || true
python manage.py collectstatic --noinput 2>/dev/null || true

echo "=== Build complete ==="
