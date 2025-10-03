from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Shipment, RestrictedItem
from .serializers import ShipmentSerializer, RestrictedItemSerializer
from trips.models import Trip, TripShipment
from core.matching_algorithm import ShipmentMatcher
from notifications.models import Notification
from decimal import Decimal
from bson.decimal128 import Decimal128

class ShipmentViewSet(viewsets.ModelViewSet):
    serializer_class = ShipmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Shipment.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Shipment.objects.all()
        elif user.role == 'sender':
            return Shipment.objects.filter(sender=user)
        else:  # carrier
            return Shipment.objects.filter(
                Q(carrier=user) | Q(status='pending')
            )

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=True, methods=['post'])
    def find_matches(self, request, pk=None):
        shipment = self.get_object()
        matcher = ShipmentMatcher()
        matches = matcher.find_matching_trips(shipment)

        return Response({
            'matches': matches,
            'count': len(matches)
        })

    @action(detail=True, methods=['post'])
    def assign_carrier(self, request, pk=None):
        shipment = self.get_object()

        # THE FIX: Add this check to prevent duplicate assignments
        if shipment.status != 'pending':
            return Response({
                'error': 'This shipment has already been matched with a carrier.'
            }, status=status.HTTP_400_BAD_REQUEST)

        trip_id = request.data.get('trip_id')

        try:
            trip = Trip.objects.get(id=trip_id)

            # --- Conversion helper ---
            def to_decimal(value):
                if isinstance(value, Decimal128):
                    return value.to_decimal()
                return Decimal(str(value))

            # Convert both sides to standard Decimals
            available_weight_dec = to_decimal(trip.available_weight)
            shipment_weight_dec = to_decimal(shipment.weight)

            if available_weight_dec >= shipment_weight_dec:
                shipment.carrier = trip.carrier
                shipment.status = 'matched'
                shipment.save()

                # Convert offered price too (avoid Decimal128 issue)
                price_agreed = to_decimal(shipment.offered_price)

                # Create trip-shipment assignment
                TripShipment.objects.create(
                    trip=trip,
                    shipment=shipment,
                    weight_allocated=shipment_weight_dec,
                    price_agreed=price_agreed
                )

                # Update trip available weight safely
                trip.available_weight = available_weight_dec - shipment_weight_dec
                trip.save()

                # Create notifications
                Notification.objects.create(
                    user=shipment.sender,
                    title='Shipment Matched',
                    message=f'Your shipment {shipment.tracking_number} has been matched with carrier.',
                    notification_type='success'
                )

                return Response({'message': 'Carrier assigned successfully'})
            else:
                return Response({
                    'error': 'Insufficient weight capacity'
                }, status=status.HTTP_400_BAD_REQUEST)

        except Trip.DoesNotExist:
            return Response({
                'error': 'Trip not found'
            }, status=status.HTTP_404_NOT_FOUND)


class RestrictedItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RestrictedItem.objects.all()
    serializer_class = RestrictedItemSerializer
    permission_classes = [permissions.IsAuthenticated]