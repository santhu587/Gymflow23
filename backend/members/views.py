from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q

from .models import Member, Trainer, TrainerPayment, Gym
from .serializers import (
    OwnerRegistrationSerializer,
    OwnerSerializer,
    MemberSerializer,
    MemberListSerializer,
    TrainerSerializer,
    TrainerListSerializer,
    TrainerPaymentSerializer,
    GymSerializer,
)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class OwnerRegistrationView(viewsets.ModelViewSet):
    queryset = None
    serializer_class = OwnerRegistrationSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post']

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Return minimal response for faster registration
        return Response({
            'message': 'Owner registered successfully',
            'username': user.username
        }, status=status.HTTP_201_CREATED)


class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['plan_type', 'status']
    search_fields = ['name', 'phone']
    ordering_fields = ['created_at', 'name', 'end_date']
    ordering = ['-created_at']

    def get_queryset(self):
        # Superuser can see all members, regular users see only their own
        if self.request.user.is_superuser:
            return Member.objects.all()
        return Member.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return MemberListSerializer
        return MemberSerializer

    def perform_create(self, serializer):
        # All users create members for themselves
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Enhanced search endpoint"""
        query = request.query_params.get('q', '')
        plan_type = request.query_params.get('plan_type', '')
        status_filter = request.query_params.get('status', '')

        queryset = self.get_queryset()

        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) | Q(phone__icontains=query)
            )

        if plan_type:
            queryset = queryset.filter(plan_type=plan_type)

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class TrainerViewSet(viewsets.ModelViewSet):
    """Manage trainers for the logged-in owner"""
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'phone', 'specialization']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        # Owners see only their trainers; superuser sees all trainers
        if self.request.user.is_superuser:
            return Trainer.objects.all()
        return Trainer.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return TrainerListSerializer
        return TrainerSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TrainerPaymentViewSet(viewsets.ModelViewSet):
    """Record and view payments made to trainers"""
    permission_classes = [IsAuthenticated]
    serializer_class = TrainerPaymentSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ['payment_date', 'created_at']
    ordering = ['-payment_date', '-created_at']

    def get_queryset(self):
        # Superuser sees all trainer payments; owner sees only their trainers' payments
        if self.request.user.is_superuser:
            return TrainerPayment.objects.all()
        return TrainerPayment.objects.filter(trainer__owner=self.request.user)


class GymViewSet(viewsets.ModelViewSet):
    """Manage gym profile for each owner (one gym per owner)"""
    serializer_class = GymSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Superuser sees all gyms, owners see only their own gym
        if self.request.user.is_superuser:
       	 return Gym.objects.all()
        return Gym.objects.filter(owner=self.request.user)

    def list(self, request, *args, **kwargs):
        """
        For normal owners, return at most one gym (their own).
        """
        queryset = self.get_queryset()
        # For owners, this will already be filtered to their gym
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        # Ensure each owner has only one gym profile
        if Gym.objects.filter(owner=self.request.user).exists():
            gym = Gym.objects.get(owner=self.request.user)
            # Update existing instead of creating a second one
            for attr, value in serializer.validated_data.items():
                setattr(gym, attr, value)
            gym.save()
        else:
            serializer.save(owner=self.request.user)



