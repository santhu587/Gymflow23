from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta

from members.models import Member
from payments.models import Payment
from plans.models import Plan


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics"""
    user = request.user
    
    if user.is_superuser:
        # Platform-wide stats for superuser
        all_members = Member.objects.all()
        all_payments = Payment.objects.all()
        
        total_members = all_members.count()
        active_members = all_members.filter(status='ACTIVE').count()
        expired_members = all_members.filter(status='EXPIRED').count()
        frozen_members = all_members.filter(status='FROZEN').count()
        
        # Monthly revenue
        now = timezone.now()
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_payments = all_payments.filter(
            payment_date__gte=start_of_month.date()
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Revenue breakdown
        pt_payments = all_payments.filter(member__plan_type='PT').aggregate(total=Sum('amount'))['total'] or 0
        general_payments = all_payments.filter(member__plan_type='GENERAL').aggregate(total=Sum('amount'))['total'] or 0
        
        # Recent payments
        recent_payments = all_payments.select_related('member').order_by('-payment_date', '-created_at')[:10]
        recent_payments_data = [
            {
                'id': p.id,
                'member_name': p.member.name,
                'amount': float(p.amount),
                'payment_mode': p.payment_mode,
                'payment_date': p.payment_date.isoformat(),
            }
            for p in recent_payments
        ]
        
        # Members expiring soon
        seven_days_from_now = (timezone.now().date() + timedelta(days=7))
        expiring_soon = all_members.filter(
            end_date__lte=seven_days_from_now,
            end_date__gte=timezone.now().date(),
            status='ACTIVE'
        ).values('id', 'name', 'phone', 'end_date', 'plan_type')
        
        return Response({
            'is_superuser': True,
            'total_members': total_members,
            'active_members': active_members,
            'expired_members': expired_members,
            'frozen_members': frozen_members,
            'monthly_revenue': float(monthly_payments),
            'pt_revenue': float(pt_payments),
            'general_revenue': float(general_payments),
            'recent_payments': recent_payments_data,
            'expiring_soon': list(expiring_soon),
        })
    else:
        # Regular owner stats
        owner = user
        members = Member.objects.filter(owner=owner)
        
        total_members = members.count()
        active_members = members.filter(status='ACTIVE').count()
        expired_members = members.filter(status='EXPIRED').count()
        frozen_members = members.filter(status='FROZEN').count()
        
        # Monthly revenue
        now = timezone.now()
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_payments = Payment.objects.filter(
            member__owner=owner,
            payment_date__gte=start_of_month.date()
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # PT vs General revenue
        pt_payments = Payment.objects.filter(
            member__owner=owner,
            member__plan_type='PT'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        general_payments = Payment.objects.filter(
            member__owner=owner,
            member__plan_type='GENERAL'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Recent payments
        recent_payments = Payment.objects.filter(
            member__owner=owner
        ).select_related('member').order_by('-payment_date', '-created_at')[:10]
        
        recent_payments_data = [
            {
                'id': p.id,
                'member_name': p.member.name,
                'amount': float(p.amount),
                'payment_mode': p.payment_mode,
                'payment_date': p.payment_date.isoformat(),
            }
            for p in recent_payments
        ]
        
        # Members expiring soon
        seven_days_from_now = (timezone.now().date() + timedelta(days=7))
        expiring_soon = members.filter(
            end_date__lte=seven_days_from_now,
            end_date__gte=timezone.now().date(),
            status='ACTIVE'
        ).values('id', 'name', 'phone', 'end_date', 'plan_type')
        
        return Response({
            'is_superuser': False,
            'total_members': total_members,
            'active_members': active_members,
            'expired_members': expired_members,
            'frozen_members': frozen_members,
            'monthly_revenue': float(monthly_payments),
            'pt_revenue': float(pt_payments),
            'general_revenue': float(general_payments),
            'recent_payments': recent_payments_data,
            'expiring_soon': list(expiring_soon),
        })

