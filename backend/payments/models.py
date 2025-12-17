from django.db import models
from members.models import Member


class Payment(models.Model):
    """Payment model"""
    
    PAYMENT_MODE_CHOICES = [
        ('Cash', 'Cash'),
        ('UPI', 'UPI'),
        ('Online', 'Online'),
    ]
    
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_mode = models.CharField(max_length=10, choices=PAYMENT_MODE_CHOICES)
    payment_date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-payment_date', '-created_at']
        indexes = [
            models.Index(fields=['member', 'payment_date']),
        ]
    
    def __str__(self):
        return f"{self.member.name} - ₹{self.amount} - {self.payment_date}"

