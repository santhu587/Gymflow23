from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator


class Owner(AbstractUser):
    """Gym owner/admin user model"""
    phone = models.CharField(
        max_length=15,
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")],
        unique=True,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username


class Trainer(models.Model):
    """Trainer working in the gym of an owner"""
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE, related_name='trainers')
    name = models.CharField(max_length=255)
    phone = models.CharField(
        max_length=15,
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")],
        blank=True,
        null=True,
    )
    specialization = models.CharField(max_length=255, blank=True, null=True)
    salary_type = models.CharField(
        max_length=20,
        choices=[('FIXED', 'Fixed'), ('COMMISSION', 'Commission'), ('MIXED', 'Mixed')],
        default='COMMISSION',
    )
    base_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    commission_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Member(models.Model):
    """Gym member model"""
    
    PLAN_TYPE_CHOICES = [
        ('GENERAL', 'General Training'),
        ('PT', 'Personal Training'),
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('EXPIRED', 'Expired'),
        ('FROZEN', 'Frozen'),
    ]
    
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE, related_name='members')
    name = models.CharField(max_length=255)
    phone = models.CharField(
        max_length=15,
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")]
    )
    plan_type = models.CharField(max_length=10, choices=PLAN_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ACTIVE')
    # Keep as simple free-text for existing data; optionally link to Trainer by name
    assigned_trainer = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['owner', 'status']),
            models.Index(fields=['owner', 'plan_type']),
            models.Index(fields=['end_date']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.plan_type})"


class TrainerPayment(models.Model):
    """Payments made to trainers"""

    PAYMENT_MODE_CHOICES = [
        ('Cash', 'Cash'),
        ('UPI', 'UPI'),
        ('Online', 'Online'),
    ]

    trainer = models.ForeignKey(Trainer, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_mode = models.CharField(max_length=10, choices=PAYMENT_MODE_CHOICES)
    payment_date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-payment_date', '-created_at']

    def __str__(self):
        return f"{self.trainer.name} - {self.amount} on {self.payment_date}"


class Gym(models.Model):
    """Gym profile / settings for each owner"""
    owner = models.OneToOneField(Owner, on_delete=models.CASCADE, related_name='gym')
    name = models.CharField(max_length=255)
    phone = models.CharField(
        max_length=15,
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")],
        blank=True,
        null=True,
    )
    address_line1 = models.CharField(max_length=255, blank=True, null=True)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, default='India')
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    opening_hours = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

