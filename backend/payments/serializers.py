from rest_framework import serializers
from .models import Payment
from members.serializers import MemberListSerializer


class PaymentSerializer(serializers.ModelSerializer):
    member_details = MemberListSerializer(source='member', read_only=True)
    
    class Meta:
        model = Payment
        fields = (
            'id', 'member', 'member_details', 'amount', 'payment_mode',
            'payment_date', 'notes', 'created_at'
        )
        read_only_fields = ('id', 'created_at')

    def validate(self, attrs):
        member = attrs.get('member')
        request = self.context.get('request')
        if member and request:
            # Superusers can create payments for any member
            if not request.user.is_superuser and member.owner != request.user:
                raise serializers.ValidationError({
                    'member': 'You can only create payments for your own members.'
                })
        return attrs


class PaymentListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    member_name = serializers.CharField(source='member.name', read_only=True)
    member_phone = serializers.CharField(source='member.phone', read_only=True)
    
    class Meta:
        model = Payment
        fields = (
            'id', 'member', 'member_name', 'member_phone', 'amount',
            'payment_mode', 'payment_date', 'created_at'
        )

