import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from designs_app.models import ActivityLog, Design


BOT_NAMES = [
    'alice_dev', 'bob_codes', 'charlie_ui', 'diana_react',
    'eve_backend', 'frank_vue', 'grace_node', 'henry_fullstack',
]

ACTION_DETAILS = {
    'login': [
        'Logged in from Chrome on Windows',
        'Logged in from Safari on macOS',
        'Logged in from Firefox on Linux',
        'Logged in from mobile device',
    ],
    'view': [
        'Viewed SaaS Landing Page design',
        'Viewed Dashboard Pro template',
        'Viewed E-Commerce Kit components',
        'Viewed Portfolio Starter layout',
        'Viewed Blog Template pages',
        'Browsed Originkit animated components',
    ],
    'export': [
        'Exported SaaS Landing Page code',
        'Exported Dashboard Pro React components',
        'Exported E-Commerce Kit JSX',
        'Exported Originkit Black Hole component',
        'Exported Originkit Text Morph effect',
    ],
    'register': [
        'New user registered via email',
        'New user registered via GitHub',
    ],
}

IPS = [
    f'192.168.1.{random.randint(1, 254)}',
    f'10.0.0.{random.randint(1, 254)}',
    f'{random.randint(1,255)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,254)}',
]

UAS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
]


class Command(BaseCommand):
    help = 'Keep Neon database alive by generating fake activity'

    def handle(self, *args, **options):
        now = timezone.now()
        created = 0

        admin, _ = User.objects.get_or_create(
            username='admin',
            defaults={'is_staff': True, 'is_superuser': True, 'is_active': True}
        )
        admin.set_password('admin123')
        admin.save()

        bot_users = []
        for name in BOT_NAMES:
            u, _ = User.objects.get_or_create(
                username=name,
                defaults={
                    'email': f'{name}@zandev.dev',
                    'is_active': True,
                    'first_name': name.replace('_', ' ').title(),
                }
            )
            bot_users.append(u)

        all_users = [admin] + bot_users

        for _ in range(random.randint(8, 15)):
            user = random.choice(all_users)
            action = random.choice(list(ACTION_DETAILS.keys()))
            detail = random.choice(ACTION_DETAILS[action])
            hours_ago = random.uniform(0.12, 12)
            ts = now - timedelta(hours=hours_ago)

            ActivityLog.objects.create(
                user=user,
                username=user.username,
                action=action,
                detail=detail,
                ip_address=random.choice(IPS),
                user_agent=random.choice(UAS),
                timestamp=ts,
            )
            created += 1

        designs = list(Design.objects.all()[:10])
        for _ in range(random.randint(3, 6)):
            if designs:
                d = random.choice(designs)
                d.views += random.randint(1, 15)
                d.save(update_fields=['views'])

        cutoff = now - timedelta(hours=48)
        deleted, _ = ActivityLog.objects.filter(timestamp__lt=cutoff).delete()

        self.stdout.write(self.style.SUCCESS(
            f'Keep-alive: created {created} logs, cleaned {deleted} old logs'
        ))
