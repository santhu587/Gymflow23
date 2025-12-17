from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Owner, Member, Trainer, TrainerPayment, Gym


@admin.register(Owner)
class OwnerAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'phone', 'is_staff', 'created_at']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone',)}),
    )


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'plan_type', 'status', 'start_date', 'end_date', 'owner', 'assigned_trainer']
    list_filter = ['plan_type', 'status', 'owner']
    search_fields = ['name', 'phone']


@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'specialization', 'salary_type', 'is_active', 'owner']
    list_filter = ['salary_type', 'is_active', 'owner']
    search_fields = ['name', 'phone', 'specialization']


@admin.register(TrainerPayment)
class TrainerPaymentAdmin(admin.ModelAdmin):
    list_display = ['trainer', 'amount', 'payment_mode', 'payment_date', 'created_at']
    list_filter = ['payment_mode', 'payment_date']
    search_fields = ['trainer__name', 'trainer__phone']


@admin.register(Gym)
class GymAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'city', 'state', 'country', 'phone']
    list_filter = ['city', 'state', 'country']
    search_fields = ['name', 'owner__username', 'city', 'state']
