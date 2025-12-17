"""
Django management command to send expiry reminders
Run this daily via cron: python manage.py send_expiry_reminders
"""
from django.core.management.base import BaseCommand
from members.reminder_service import send_daily_expiry_reminders
from members.services import check_and_update_member_status


class Command(BaseCommand):
    help = 'Send expiry reminders to members expiring in 7 days'

    def handle(self, *args, **options):
        self.stdout.write('Checking member statuses...')
        check_and_update_member_status()
        
        self.stdout.write('Sending expiry reminders...')
        results = send_daily_expiry_reminders()
        
        self.stdout.write(
            self.style.SUCCESS(
                f"Reminders sent: {results['successful']} successful, "
                f"{results['failed']} failed out of {results['total_members']} members"
            )
        )

