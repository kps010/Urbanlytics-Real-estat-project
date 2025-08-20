from django.db import models

class User(models.Model):
    id = models.AutoField(primary_key=True)   # Default PK
    email = models.EmailField(unique=True)   # Email as PK
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=128)  # Store hashed passwords ideally
    phone_no = models.CharField(max_length=15, unique=True)
    loggedIn = models.BooleanField(default=False)  # New column

    def __str__(self):
        return self.email

from django.db import models
from .models import User   # Import your custom User model


class Subscription(models.Model):
    PLAN_CHOICES = [
        ('basic', 'Basic'),
        ('premium', 'Premium'),
        ('elite', 'Elite'),
    ]

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="subscriptions")
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)  # e.g., Card / UPI
    created_at = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateField()

    def __str__(self):
        return f"{self.user.email} - {self.plan}"
