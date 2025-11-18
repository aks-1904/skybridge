from rest_framework import serializers
from .models import Trip, TripShipment
from shipments.serializers import ShipmentSerializer

class TripSerializer(serializers.ModelSerializer):
    carrier_name = serializers.CharField(source='carrier.profile.full_name', read_only=True)
    
    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ['carrier', 'available_weight']
    
    def create(self, validated_data):
        validated_data['available_weight'] = validated_data['total_weight_capacity']
        return super().create(validated_data)

class TripShipmentSerializer(serializers.ModelSerializer):
    shipment = ShipmentSerializer(read_only=True)
    trip = TripSerializer(read_only=True)
    
    class Meta:
        model = TripShipment
        fields = '__all__'