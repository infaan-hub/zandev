import os
from django.core.management.base import BaseCommand
from designs_app.models import Design


class Command(BaseCommand):
    help = 'Delete all designs from the database'

    def add_arguments(self, parser):
        parser.add_argument('--confirm', action='store_true', help='Confirm deletion')

    def handle(self, *args, **options):
        count = Design.objects.count()
        if count == 0:
            self.stdout.write(self.style.WARNING('No designs to delete.'))
            return

        if not options['confirm']:
            self.stdout.write(self.style.WARNING(
                f'About to delete {count} design(s). Run with --confirm to proceed.'
            ))
            return

        for d in Design.objects.all():
            if d.uploaded_file:
                try:
                    os.remove(d.uploaded_file.path)
                except OSError:
                    pass

        Design.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} design(s).'))