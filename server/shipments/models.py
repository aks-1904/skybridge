from django.db import models
from accounts.models import User
import uuid
from decimal import Decimal


class RestrictedItem(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50)
    description = models.TextField()
    is_prohibited = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Shipment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('matched', 'Matched'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shipments')
    carrier = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='carried_shipments'
    )

    # Shipment details
    title = models.CharField(max_length=200)
    description = models.TextField()
    weight = models.DecimalField(max_digits=5, decimal_places=2)  # in kg
    dimensions = models.JSONField()  # {"length": 30, "width": 20, "height": 10}
    value = models.DecimalField(max_digits=10, decimal_places=2)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')

    # Location details
    pickup_address = models.TextField()
    pickup_city = models.CharField(max_length=100)
    delivery_address = models.TextField()
    delivery_city = models.CharField(max_length=100)

    # Status and tracking
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    tracking_number = models.CharField(max_length=20, unique=True)

    # Pricing
    offered_price = models.DecimalField(max_digits=8, decimal_places=2)
    final_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)

    # Dates
    pickup_date = models.DateTimeField()
    delivery_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
    # Ensure all decimal fields are proper Python Decimals
        for field_name in ['weight', 'value', 'offered_price', 'final_price']:
            value = getattr(self, field_name, None)
            # If the value came from MongoDB Decimal128, convert it
            if hasattr(value, "to_decimal"):                # Handles Decimal128
                setattr(self, field_name, value.to_decimal())
            elif value is not None and not isinstance(value, Decimal):
                setattr(self, field_name, Decimal(str(value)))

        # Auto-generate tracking number if not set
        if not self.tracking_number:
            self.tracking_number = f"BG{str(self.id)[:8].upper()}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.tracking_number}"


class ShipmentImage(models.Model):
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='shipments/')
    caption = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.shipment.title}"
