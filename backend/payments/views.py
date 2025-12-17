from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Q
from django.utils import timezone
from datetime import timedelta

from .models import Payment
from .serializers import PaymentSerializer, PaymentListSerializer
from members.models import Member
from plans.models import Plan


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Superuser can see all payments, regular users see only their own
        if self.request.user.is_superuser:
            return Payment.objects.all()
        return Payment.objects.filter(member__owner=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return PaymentListSerializer
        return PaymentSerializer

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=False, methods=['get'])
    def member_payments(self, request):
        """Get all payments for a specific member"""
        member_id = request.query_params.get('member_id')
        if not member_id:
            return Response(
                {'error': 'member_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if request.user.is_superuser:
                member = Member.objects.get(id=member_id)
            else:
                member = Member.objects.get(id=member_id, owner=request.user)
        except Member.DoesNotExist:
            return Response(
                {'error': 'Member not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        payments = Payment.objects.filter(member=member)
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def outstanding_dues(self, request):
        """Get outstanding dues for a specific member"""
        member_id = request.query_params.get('member_id')
        if not member_id:
            return Response(
                {'error': 'member_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if request.user.is_superuser:
                member = Member.objects.get(id=member_id)
            else:
                member = Member.objects.get(id=member_id, owner=request.user)
        except Member.DoesNotExist:
            return Response(
                {'error': 'Member not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get the plan price
        try:
            plan = Plan.objects.get(plan_type=member.plan_type)
            plan_price = plan.price
        except Plan.DoesNotExist:
            plan_price = 0

        # Calculate total payments
        total_payments = Payment.objects.filter(member=member).aggregate(
            total=Sum('amount')
        )['total'] or 0

        outstanding = max(0, plan_price - total_payments)

        return Response({
            'member_id': member.id,
            'member_name': member.name,
            'plan_price': float(plan_price),
            'total_payments': float(total_payments),
            'outstanding_dues': float(outstanding)
        })

