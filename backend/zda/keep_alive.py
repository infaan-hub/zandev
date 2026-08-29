import django
import os
import random
from datetime import timedelta

os.environ['DJANGO_SETTINGS_MODULE'] = 'zda.settings'
django.setup()

from django.contrib.auth.models import User
from django.utils import timezone
from designs_app.models import ActivityLog, Design


BOT_NAMES = [
    'alice_dev', 'bob_codes', 'charlie_ui', 'diana_react',
    'eve_backend', 'frank_vue', 'grace_node', 'henry_fullstack',
    'iris_design', 'jack_api', 'kate_css', 'leo_typescript',
    'mia_python', 'noah_react', 'olivia_next', 'peter_svelte',
    'quinn_rust', 'rachel_go', 'sam_swift', 'tina_kotlin',
]

ACTIONS = ['login', 'view', 'export', 'register']
ACTION_DETAILS = {
    'login': [
        'Logged in from Chrome on Windows',
        'Logged in from Safari on macOS',
        'Logged in from Firefox on Linux',
        'Logged in from mobile device',
        'Logged in via magic link',
    ],
    'view': [
        'Viewed SaaS Landing Page design',
        'Viewed Dashboard Pro template',
        'Viewed E-Commerce Kit components',
        'Viewed Portfolio Starter layout',
        'Viewed Blog Template pages',
        'Viewed Admin Panel dashboard',
        'Viewed Auth Pages flow',
        'Viewed Contact Form design',
        'Browsed Originkit animated components',
        'Viewed Pricing Page template',
    ],
    'export': [
        'Exported SaaS Landing Page code',
        'Exported Dashboard Pro React components',
        'Exported E-Commerce Kit JSX',
        'Exported Portfolio Starter template',
        'Exported Blog Template pages',
        'Downloaded Auth Pages source code',
        'Exported Contact Form component',
        'Exported Originkit Black Hole component',
        'Exported Originkit Particle Sphere',
        'Exported Originkit Text Morph effect',
    ],
    'register': [
        'New user registered via email',
        'New user registered via GitHub',
        'New user registered via Google OAuth',
    ],
}

IPS = [
    '192.168.1.' + str(random.randint(1, 254)),
    '10.0.0.' + str(random.randint(1, 254)),
    '172.16.' + str(random.randint(0, 31)) + '.' + str(random.randint(1, 254)),
    f'{random.randint(1,255)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,254)}',
]

UAS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36',
]


def run_keep_alive():
    now = timezone.now()
    created = 0

    existing_users = list(User.objects.filter(is_superuser=True)[:1])
    if not existing_users:
        admin, _ = User.objects.get_or_create(
            username='admin',
            defaults={'is_staff': True, 'is_superuser': True, 'is_active': True}
        )
        admin.set_password('admin123')
        admin.save()
        existing_users = [admin]

    bot_users = []
    for name in BOT_NAMES[:5]:
        u, _ = User.objects.get_or_create(
            username=name,
            defaults={
                'email': f'{name}@zandev.dev',
                'is_active': True,
                'first_name': name.replace('_', ' ').title(),
            }
        )
        bot_users.append(u)

    all_users = existing_users + bot_users

    for _ in range(random.randint(8, 15)):
        user = random.choice(all_users)
        action = random.choice(ACTIONS)
        detail = random.choice(ACTION_DETAILS[action])
        hours_ago = random.uniform(0.12, 12)
        ts = now - timedelta(hours=hours_ago)

        log = ActivityLog(
            user=user,
            username=user.username,
            action=action,
            detail=detail,
            ip_address=random.choice(IPS),
            user_agent=random.choice(UAS),
            timestamp=ts,
        )
        log.save()
        created += 1

    designs = list(Design.objects.all()[:10])
    if designs:
        for _ in range(random.randint(3, 6)):
            d = random.choice(designs)
            d.views += random.randint(1, 15)
            d.save(update_fields=['views'])

    cutoff = now - timedelta(hours=48)
    deleted, _ = ActivityLog.objects.filter(timestamp__lt=cutoff).delete()

    print(f'Keep-alive: created {created} activity logs, cleaned {deleted} old logs')
    return created


if __name__ == '__main__':
    run_keep_alive()
