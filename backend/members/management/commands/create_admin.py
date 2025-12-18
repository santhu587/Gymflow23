"""
Django management command to create superuser
Can be run via Render's build command or one-off jobs
"""
from django.core.management.base import BaseCommand
from members.models import Owner
import os


class Command(BaseCommand):
    help = 'Create a superuser account for admin access'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            default=os.getenv('ADMIN_USERNAME', 'admin'),
            help='Username for superuser (default: admin or ADMIN_USERNAME env var)'
        )
        parser.add_argument(
            '--email',
            type=str,
            default=os.getenv('ADMIN_EMAIL', 'admin@gymflow.com'),
            help='Email for superuser (default: admin@gymflow.com or ADMIN_EMAIL env var)'
        )
        parser.add_argument(
            '--password',
            type=str,
            default=os.getenv('ADMIN_PASSWORD', 'Admin@123'),
            help='Password for superuser (default: Admin@123 or ADMIN_PASSWORD env var)'
        )
        parser.add_argument(
            '--skip-if-exists',
            action='store_true',
            help='Skip creation if user already exists'
        )

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']
        skip_if_exists = options['skip_if_exists']

        if Owner.objects.filter(username=username).exists():
            if skip_if_exists:
                self.stdout.write(
                    self.style.WARNING(f'User "{username}" already exists. Skipping.')
                )
                return
            else:
                self.stdout.write(
                    self.style.ERROR(f'User "{username}" already exists!')
                )
                self.stdout.write('Use --skip-if-exists to skip, or choose a different username.')
                return

        try:
            Owner.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(
                self.style.SUCCESS(f'✅ Superuser "{username}" created successfully!')
            )
            self.stdout.write(f'   Email: {email}')
            self.stdout.write(f'   Admin URL: https://gymflow23.onrender.com/admin/')
            self.stdout.write(
                self.style.WARNING('⚠️  IMPORTANT: Change the password after first login!')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error creating superuser: {str(e)}')
            )

