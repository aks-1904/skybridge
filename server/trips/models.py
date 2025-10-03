from django.db import models
from accounts.models import User
import uuid

class Trip(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    carrier = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    
    # Flight details
    airline = models.CharField(max_length=100)
    flight_number = models.CharField(max_length=20)
    departure_city = models.CharField(max_length=100)
    arrival_city = models.CharField(max_length=100)
    departure_date = models.DateTimeField()
    arrival_date = models.DateTimeField()
    
    # Baggage capacity
    total_weight_capacity = models.DecimalField(max_digits=5, decimal_places=2)  # in kg
    available_weight = models.DecimalField(max_digits=5, decimal_places=2)
    price_per_kg = models.DecimalField(max_digits=6, decimal_places=2)
    
    # Status
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='upcoming')
    
    # Additional info
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.flight_number} - {self.departure_city} to {self.arrival_city}"

class TripShipment(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='trip_shipments')
    shipment = models.OneToOneField('shipments.Shipment', on_delete=models.CASCADE, related_name='trip_assignment')
    weight_allocated = models.DecimalField(max_digits=5, decimal_places=2)
    price_agreed = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.trip.flight_number} - {self.shipment.tracking_number}"