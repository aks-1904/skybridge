from django.db.models import Q
from trips.models import Trip
from shipments.models import Shipment
from datetime import datetime, timedelta
from decimal import Decimal # Keep this import

class ShipmentMatcher:
    def __init__(self):
        self.weight_tolerance = 2.0  # kg
        self.time_tolerance = 24    # hours
    
    def find_matching_trips(self, shipment):
        """Find trips that can accommodate the shipment"""
        base_query = Trip.objects.filter(
            status='upcoming',
            available_weight__gte=shipment.weight, 
            departure_city__iexact=shipment.pickup_city,
            arrival_city__iexact=shipment.delivery_city
        )
        
        pickup_date_start = shipment.pickup_date - timedelta(hours=self.time_tolerance)
        pickup_date_end = shipment.pickup_date + timedelta(hours=self.time_tolerance)
        
        matching_trips = base_query.filter(
            departure_date__gte=pickup_date_start,
            departure_date__lte=pickup_date_end
        )
        
        scored_trips = []
        for trip in matching_trips:
            score = self.calculate_match_score(shipment, trip)
            scored_trips.append({
                'trip': trip,
                'score': score,
                'carrier_name': trip.carrier.profile.full_name,
                # THE FIX: Convert to string, then Decimal, then float
                'price_estimate': float(Decimal(str(trip.price_per_kg)) * Decimal(str(shipment.weight)))
            })
        
        scored_trips.sort(key=lambda x: x['score'], reverse=True)
        
        return scored_trips[:10]
    
    def calculate_match_score(self, shipment, trip):
        """Calculate compatibility score between shipment and trip"""
        score = 0
        
        time_diff = abs((shipment.pickup_date - trip.departure_date).total_seconds() / 3600)
        time_score = max(0, 30 - (time_diff / self.time_tolerance * 30))
        score += time_score
        
        # THE FIX: Convert to string first
        weight_ratio = Decimal(str(shipment.weight)) / Decimal(str(trip.available_weight))
        if weight_ratio <= 0.5:
            weight_score = 25
        elif weight_ratio <= 0.8:
            weight_score = 20
        else:
            weight_score = 15
        score += weight_score
        
        # THE FIX: Convert to string first
        estimated_price = Decimal(str(trip.price_per_kg)) * Decimal(str(shipment.weight))
        if estimated_price <= Decimal(str(shipment.offered_price)):
            price_score = 25
        elif estimated_price <= (Decimal(str(shipment.offered_price)) * Decimal('1.2')):
            price_score = 15
        else:
            price_score = 5
        score += price_score
        
        priority_scores = {'low': 0, 'medium': 3, 'high': 7, 'urgent': 10}
        score += priority_scores.get(shipment.priority, 0)
        
        score += 8
        
        return score