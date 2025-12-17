from django.contrib import admin
from .models import Plan


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ['plan_type', 'duration_days', 'price', 'created_at']
    list_filter = ['plan_type']

