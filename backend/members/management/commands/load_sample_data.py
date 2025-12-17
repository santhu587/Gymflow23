"""
Django management command to load sample data
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from members.models import Owner, Member
from plans.models import Plan
from payments.models import Payment


class Command(BaseCommand):
    help = 'Load sample data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create sample owner
        owner, created = Owner.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@gym.com',
                'phone': '+1234567890',
            }
        )
        if created:
            owner.set_password('admin123')
            owner.save()
            self.stdout.write(self.style.SUCCESS('Created owner: admin / admin123'))

        # Create plans
        general_plan, _ = Plan.objects.get_or_create(
            plan_type='GENERAL',
            defaults={
                'duration_days': 30,
                'price': 2000.00,
                'description': 'General training plan for 30 days'
            }
        )

        pt_plan, _ = Plan.objects.get_or_create(
            plan_type='PT',
            defaults={
                'duration_days': 30,
                'price': 5000.00,
                'description': 'Personal training plan for 30 days'
            }
        )

        self.stdout.write(self.style.SUCCESS('Created plans'))

        # Create sample members
        today = timezone.now().date()
        members_data = [
            {
                'name': 'John Doe',
                'phone': '+1234567891',
                'plan_type': 'GENERAL',
                'start_date': today - timedelta(days=20),
                'end_date': today + timedelta(days=10),
                'status': 'ACTIVE',
            },
            {
                'name': 'Jane Smith',
                'phone': '+1234567892',
                'plan_type': 'PT',
                'start_date': today - timedelta(days=15),
                'end_date': today + timedelta(days=15),
                'status': 'ACTIVE',
                'assigned_trainer': 'Trainer Mike',
            },
            {
                'name': 'Bob Johnson',
                'phone': '+1234567893',
                'plan_type': 'GENERAL',
                'start_date': today - timedelta(days=35),
                'end_date': today - timedelta(days=5),
                'status': 'EXPIRED',
            },
            {
                'name': 'Alice Williams',
                'phone': '+1234567894',
                'plan_type': 'PT',
                'start_date': today - timedelta(days=10),
                'end_date': today + timedelta(days=20),
                'status': 'ACTIVE',
                'assigned_trainer': 'Trainer Sarah',
            },
        ]

        created_members = []
        for member_data in members_data:
            member, created = Member.objects.get_or_create(
                owner=owner,
                phone=member_data['phone'],
                defaults=member_data
            )
            if created:
                created_members.append(member)

        self.stdout.write(self.style.SUCCESS(f'Created {len(created_members)} members'))

        # Create sample payments
        if created_members:
            payment_data = [
                {
                    'member': created_members[0],
                    'amount': 2000.00,
                    'payment_mode': 'Cash',
                    'payment_date': today - timedelta(days=20),
                },
                {
                    'member': created_members[1],
                    'amount': 5000.00,
                    'payment_mode': 'UPI',
                    'payment_date': today - timedelta(days=15),
                },
                {
                    'member': created_members[2],
                    'amount': 2000.00,
                    'payment_mode': 'Online',
                    'payment_date': today - timedelta(days=35),
                },
                {
                    'member': created_members[3],
                    'amount': 3000.00,
                    'payment_mode': 'UPI',
                    'payment_date': today - timedelta(days=10),
                },
            ]

            for payment_info in payment_data:
                Payment.objects.get_or_create(
                    member=payment_info['member'],
                    payment_date=payment_info['payment_date'],
                    defaults=payment_info
                )

            self.stdout.write(self.style.SUCCESS('Created sample payments'))

        self.stdout.write(self.style.SUCCESS('Sample data loaded successfully!'))
        self.stdout.write('Login credentials: admin / admin123')

