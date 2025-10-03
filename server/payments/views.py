from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Payment
from .serializers import PaymentSerializer
import uuid

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Payment.objects.all()
        else:
            return Payment.objects.filter(
                models.Q(payer=user) | models.Q(payee=user)
            )
    
    @action(detail=False, methods=['post'])
    def initiate_payment(self, request):
        shipment_id = request.data.get('shipment_id')
        amount = request.data.get('amount')
        
        try:
            shipment = Shipment.objects.get(id=shipment_id)
            payment = Payment.objects.create(
                payer=request.user,
                payee=shipment.carrier,
                shipment=shipment,
                amount=amount,
                transaction_id=str(uuid.uuid4()),
                status='pending'
            )
            
            # In real implementation, integrate with payment gateway
            # For now, mark as completed
            payment.status = 'completed'
            payment.save()
            
            # Update shipment status
            shipment.status = 'in_transit'
            shipment.save()
            
            return Response({
                'message': 'Payment initiated successfully',
                'payment_id': payment.id,
                'transaction_id': payment.transaction_id
            })
        except Shipment.DoesNotExist:
            return Response({
                'error': 'Shipment not found'
            }, status=status.HTTP_404_NOT_FOUND)