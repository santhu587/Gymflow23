from django.db import models


class Plan(models.Model):
    """Gym plan model"""
    
    PLAN_TYPE_CHOICES = [
        ('GENERAL', 'General Training'),
        ('PT', 'Personal Training'),
    ]
    
    plan_type = models.CharField(max_length=10, choices=PLAN_TYPE_CHOICES, unique=True)
    duration_days = models.IntegerField(help_text="Duration in days")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['plan_type']
    
    def __str__(self):
        return f"{self.get_plan_type_display()} - {self.duration_days} days - ₹{self.price}"

