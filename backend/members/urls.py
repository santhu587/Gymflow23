from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OwnerRegistrationView,
    CustomTokenObtainPairView,
    MemberViewSet,
    TrainerViewSet,
    TrainerPaymentViewSet,
    GymViewSet,
)

router = DefaultRouter()
router.register(r'register', OwnerRegistrationView, basename='register')
router.register(r'trainers', TrainerViewSet, basename='trainers')
router.register(r'trainer-payments', TrainerPaymentViewSet, basename='trainer-payments')
router.register(r'gyms', GymViewSet, basename='gyms')
router.register(r'', MemberViewSet, basename='members')

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('', include(router.urls)),
]

