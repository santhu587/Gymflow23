"""
Reminder service for member expiry notifications
"""
from datetime import timedelta
from django.utils import timezone
from .services import get_members_expiring_soon


def send_expiry_reminder(member):
    """
    Mock function to send expiry reminder via WhatsApp/SMS
    In production, integrate with Twilio, WhatsApp Business API, etc.
    """
    message = f"""
    Hi {member.name},
    
    Your {member.get_plan_type_display()} membership at the gym is expiring on {member.end_date}.
    Please renew your membership to continue enjoying our services.
    
    Thank you!
    """
    
    # Mock implementation - in production, call actual SMS/WhatsApp API
    print(f"[MOCK] Sending reminder to {member.name} ({member.phone}):")
    print(message)
    print("-" * 50)
    
    # Return True to indicate success (in production, check API response)
    return True


def send_daily_expiry_reminders():
    """
    Daily cron job function to send reminders to members expiring in 7 days
    """
    members_expiring = get_members_expiring_soon(days=7)
    
    results = {
        'total_members': members_expiring.count(),
        'successful': 0,
        'failed': 0,
        'members_notified': []
    }
    
    for member in members_expiring:
        try:
            success = send_expiry_reminder(member)
            if success:
                results['successful'] += 1
                results['members_notified'].append({
                    'id': member.id,
                    'name': member.name,
                    'phone': member.phone,
                    'expiry_date': member.end_date.isoformat()
                })
            else:
                results['failed'] += 1
        except Exception as e:
            print(f"Error sending reminder to {member.name}: {str(e)}")
            results['failed'] += 1
    
    return results

