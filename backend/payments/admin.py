from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['member', 'amount', 'payment_mode', 'payment_date', 'created_at']
    list_filter = ['payment_mode', 'payment_date']
    search_fields = ['member__name', 'member__phone']

