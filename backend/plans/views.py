from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Plan
from .serializers import PlanSerializer


class PlanViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only viewset for plans"""
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    permission_classes = [IsAuthenticated]

