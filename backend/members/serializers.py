from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Owner, Member, Trainer, TrainerPayment, Gym


class OwnerRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Owner
        fields = ('username', 'email', 'password', 'password2', 'phone')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = Owner.objects.create_user(**validated_data)
        return user


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = ('id', 'username', 'email', 'phone', 'created_at', 'is_active', 'is_superuser')
        read_only_fields = ('id', 'created_at', 'is_superuser')


class MemberSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Member
        fields = (
            'id', 'name', 'phone', 'plan_type', 'start_date',
            'end_date', 'status', 'assigned_trainer', 'created_at', 'updated_at', 'owner'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'owner')

    def validate(self, attrs):
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        
        if start_date and end_date and end_date <= start_date:
            raise serializers.ValidationError({
                'end_date': 'End date must be after start date.'
            })
        
        return attrs


class MemberListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    class Meta:
        model = Member
        fields = (
            'id', 'name', 'phone', 'plan_type', 'start_date',
            'end_date', 'status', 'assigned_trainer', 'created_at'
        )


class TrainerSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Trainer
        fields = (
            'id', 'owner', 'name', 'phone', 'specialization',
            'salary_type', 'base_salary', 'commission_percent',
            'is_active', 'created_at',
        )
        read_only_fields = ('id', 'owner', 'created_at')


class TrainerListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = (
            'id', 'name', 'phone', 'specialization', 'is_active', 'created_at',
        )


class TrainerPaymentSerializer(serializers.ModelSerializer):
    trainer_name = serializers.CharField(source='trainer.name', read_only=True)

    class Meta:
        model = TrainerPayment
        fields = (
            'id', 'trainer', 'trainer_name', 'amount',
            'payment_mode', 'payment_date', 'notes', 'created_at',
        )
        read_only_fields = ('id', 'created_at')

    def validate(self, attrs):
        trainer = attrs.get('trainer')
        request = self.context.get('request')
        if trainer and request and trainer.owner != request.user:
            raise serializers.ValidationError(
                {'trainer': 'You can only pay your own trainers.'}
            )
        return attrs


class GymSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Gym
        fields = (
            'id',
            'owner',
            'name',
            'phone',
            'address_line1',
            'address_line2',
            'city',
            'state',
            'country',
            'postal_code',
            'description',
            'opening_hours',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at')

