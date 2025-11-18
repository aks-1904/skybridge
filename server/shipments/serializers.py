from rest_framework import serializers
from .models import Shipment, ShipmentImage, RestrictedItem
from trips.models import TripShipment

class ShipmentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShipmentImage
        fields = ['id', 'image', 'caption', 'uploaded_at']

class ShipmentSerializer(serializers.ModelSerializer):
    images = ShipmentImageSerializer(many=True, read_only=True)
    sender_name = serializers.CharField(source='sender.profile.full_name', read_only=True)
    carrier_name = serializers.CharField(source='carrier.profile.full_name', read_only=True)
    
    class Meta:
        model = Shipment
        fields = '__all__'
        read_only_fields = ['sender', 'tracking_number', 'status', 'carrier']

class RestrictedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestrictedItem
        fields = '__all__'