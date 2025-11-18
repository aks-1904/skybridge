from django.contrib import admin
from accounts.models import User, UserProfile, AadhaarVerification, PhoneVerification
from shipments.models import Shipment, ShipmentImage, RestrictedItem
from trips.models import Trip, TripShipment
from payments.models import Payment
from notifications.models import Notification

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'phone_number', 'role', 'is_verified', 'created_at']
    list_filter = ['role', 'is_verified', 'created_at']
    search_fields = ['username', 'email', 'phone_number']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'full_name', 'city', 'state']
    search_fields = ['full_name', 'user__username']

@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ['tracking_number', 'title', 'sender', 'carrier', 'status', 'weight', 'created_at']
    list_filter = ['status', 'priority', 'created_at']
    search_fields = ['tracking_number', 'title', 'sender__username']

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ['flight_number', 'carrier', 'departure_city', 'arrival_city', 'departure_date', 'status']
    list_filter = ['status', 'departure_date']
    search_fields = ['flight_number', 'carrier__username', 'departure_city', 'arrival_city']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'payer', 'payee', 'amount', 'status', 'created_at']
    list_filter = ['status', 'payment_type', 'created_at']
    search_fields = ['transaction_id', 'payer__username']

@admin.register(RestrictedItem)
class RestrictedItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'is_prohibited']
    list_filter = ['category', 'is_prohibited']
    search_fields = ['name', 'category']

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['title', 'user__username']