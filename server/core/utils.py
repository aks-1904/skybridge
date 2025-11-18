import random
import string
from django.core.mail import send_mail
from django.conf import settings

def generate_tracking_number():
    """Generate unique tracking number"""
    prefix = "BG"
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f"{prefix}{suffix}"

def send_notification_email(user, subject, message):
    """Send email notification to user"""
    if user.email:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=True,
        )

def calculate_shipping_cost(weight, distance, priority='medium'):
    """Calculate shipping cost based on weight, distance and priority"""
    base_rate = 50  # Base rate per kg
    distance_rate = 0.5  # Per km
    
    priority_multipliers = {
        'low': 0.8,
        'medium': 1.0,
        'high': 1.3,
        'urgent': 1.6
    }
    
    cost = (base_rate * weight) + (distance_rate * distance)
    cost *= priority_multipliers.get(priority, 1.0)
    
    return round(cost, 2)