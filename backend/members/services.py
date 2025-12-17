"""
Service layer for member-related business logic
"""
from django.utils import timezone
from datetime import timedelta
from .models import Member


def check_and_update_member_status():
    """Check member expiry dates and update status"""
    today = timezone.now().date()
    
    # Update expired members
    Member.objects.filter(
        end_date__lt=today,
        status='ACTIVE'
    ).update(status='EXPIRED')
    
    # Update members that are expiring today
    Member.objects.filter(
        end_date=today,
        status='ACTIVE'
    ).update(status='EXPIRED')


def get_members_expiring_soon(days=7):
    """Get members expiring within specified days"""
    today = timezone.now().date()
    expiry_date = today + timedelta(days=days)
    
    return Member.objects.filter(
        end_date__lte=expiry_date,
        end_date__gte=today,
        status='ACTIVE'
    )

