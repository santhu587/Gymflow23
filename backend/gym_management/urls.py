"""
URL configuration for gym_management project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenRefreshView

def root_view(request):
    """Root endpoint that returns API information"""
    return JsonResponse({
        'message': 'GymFlow API',
        'version': '1.0',
        'endpoints': {
            'auth': '/api/auth/',
            'members': '/api/members/',
            'plans': '/api/plans/',
            'payments': '/api/payments/',
            'dashboard': '/api/dashboard/',
            'admin': '/admin/',
        }
    })

urlpatterns = [
    path('', root_view, name='root'),
    path('api/', root_view, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('members.urls')),
    path('api/members/', include('members.urls')),
    path('api/plans/', include('plans.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/dashboard/', include('dashboard.urls')),
]

