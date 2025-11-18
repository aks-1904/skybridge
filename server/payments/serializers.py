from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    payer_name = serializers.CharField(source='payer.profile.full_name', read_only=True)
    payee_name = serializers.CharField(source='payee.profile.full_name', read_only=True)
    shipment_title = serializers.CharField(source='shipment.title', read_only=True)
    
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['payer', 'transaction_id', 'created_at', 'updated_at']