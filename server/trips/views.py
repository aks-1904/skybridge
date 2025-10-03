from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Trip, TripShipment
from .serializers import TripSerializer, TripShipmentSerializer

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Trip.objects.all()
        elif user.role == 'carrier':
            return Trip.objects.filter(carrier=user)
        else:  # sender
            return Trip.objects.filter(status='upcoming', available_weight__gt=0)
    
    def perform_create(self, serializer):
        serializer.save(carrier=self.request.user)
    
    @action(detail=True, methods=['get'])
    def shipments(self, request, pk=None):
        trip = self.get_object()
        trip_shipments = TripShipment.objects.filter(trip=trip)
        serializer = TripShipmentSerializer(trip_shipments, many=True)
        return Response(serializer.data)
