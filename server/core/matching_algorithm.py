from django.db import connection
from trips.models import Trip
from shipments.models import Shipment
from datetime import datetime, timedelta
from decimal import Decimal
from bson.decimal128 import Decimal128 
from bson import ObjectId
from django.conf import settings
import pymongo

class ShipmentMatcher:
    def __init__(self):
        self.weight_tolerance = 2.0  # kg
        self.time_tolerance = 24    # hours
    
    def find_matching_trips(self, shipment):
        """Find trips that can accommodate the shipment using raw MongoDB queries"""

        # Convert shipment weight to Decimal for calculations
        shipment_weight_decimal = shipment.weight
        if isinstance(shipment_weight_decimal, Decimal128):
            shipment_weight_decimal = shipment_weight_decimal.to_decimal()
        elif not isinstance(shipment_weight_decimal, Decimal):
            shipment_weight_decimal = Decimal(str(shipment_weight_decimal))
        
        # Convert to Decimal128 for MongoDB query
        shipment_weight_d128 = Decimal128(shipment_weight_decimal)
        
        # Calculate date range
        pickup_date_start = shipment.pickup_date - timedelta(hours=self.time_tolerance)
        pickup_date_end = shipment.pickup_date + timedelta(hours=self.time_tolerance)
        
        # Use raw MongoDB query to bypass Djongo's Decimal conversion issues
        # Access MongoDB client through Djongo's connection
        client = pymongo.MongoClient(settings.DATABASES['default']['CLIENT']['host'])
        db = client[settings.DATABASES['default']['NAME']]
        trips_collection = db['trips_trip']
        
        # Build MongoDB query
        mongo_query = {
            'status': 'upcoming',
            'available_weight': {'$gte': shipment_weight_d128},
            'departure_city': {'$regex': f'^{shipment.pickup_city}$', '$options': 'i'},
            'arrival_city': {'$regex': f'^{shipment.delivery_city}$', '$options': 'i'},
            'departure_date': {
                '$gte': pickup_date_start,
                '$lte': pickup_date_end
            }
        }
        
        # Execute raw MongoDB query
        cursor = trips_collection.find(mongo_query)
        
        # Convert MongoDB documents to Django model instances
        matching_trips = []
        trip_ids = []
        for doc in cursor:
            # MongoDB stores the ID in 'id' field for Djongo models with UUIDField
            # Try both 'id' and '_id' to be safe
            trip_id = doc.get('id') or doc.get('_id')
            if trip_id:
                trip_ids.append(trip_id)
        
        # Fetch Trip objects using the IDs (this preserves relationships)
        if trip_ids:
            matching_trips = list(Trip.objects.filter(id__in=trip_ids))
        
        # Score and sort trips
        scored_trips = []
        for trip in matching_trips:
            score = self.calculate_match_score(shipment, trip, shipment_weight_decimal) 
            
            # Convert trip price_per_kg
            trip_price_per_kg_dec = trip.price_per_kg
            if hasattr(trip_price_per_kg_dec, "to_decimal"):
                trip_price_per_kg_dec = trip_price_per_kg_dec.to_decimal()
            else:
                trip_price_per_kg_dec = Decimal(str(trip_price_per_kg_dec))
            
            # Convert trip available_weight
            trip_available_weight = trip.available_weight
            if hasattr(trip_available_weight, "to_decimal"):
                trip_available_weight_dec = trip_available_weight.to_decimal()
            else:
                trip_available_weight_dec = Decimal(str(trip_available_weight))

            # Get carrier name safely - handle missing profile
            try:
                carrier_name = trip.carrier.profile.full_name
            except:
                # Fallback to username or email if profile doesn't exist
                carrier_name = trip.carrier.username or trip.carrier.email or "Unknown Carrier"

            scored_trips.append({
                'trip_id': str(trip.id),
                'airline': trip.airline,
                'flight_number': trip.flight_number,
                'departure_city': trip.departure_city,
                'arrival_city': trip.arrival_city,
                'departure_date': trip.departure_date.isoformat() if trip.departure_date else None,
                'arrival_date': trip.arrival_date.isoformat() if trip.arrival_date else None,
                'available_weight': float(trip_available_weight_dec),
                'price_per_kg': float(trip_price_per_kg_dec),
                'status': trip.status,
                'carrier_id': str(trip.carrier.id),
                'carrier_name': carrier_name,
                'score': score,
                'price_estimate': float(trip_price_per_kg_dec * shipment_weight_decimal)
            })
        
        scored_trips.sort(key=lambda x: x['score'], reverse=True)
        
        return scored_trips[:10]
    
    def calculate_match_score(self, shipment, trip, shipment_weight_decimal=None):
        """Calculate compatibility score between shipment and trip"""
        score = 0
        
        time_diff = abs((shipment.pickup_date - trip.departure_date).total_seconds() / 3600)
        time_score = max(0, 30 - (time_diff / self.time_tolerance * 30))
        score += time_score
        
        if shipment_weight_decimal is None:
            if isinstance(shipment.weight, Decimal128):
                shipment_weight_decimal = shipment.weight.to_decimal()
            else:
                shipment_weight_decimal = Decimal(str(shipment.weight))
        
        trip_available_weight_dec = trip.available_weight
        if hasattr(trip_available_weight_dec, "to_decimal"):
            trip_available_weight_dec = trip_available_weight_dec.to_decimal()
        else:
            trip_available_weight_dec = Decimal(str(trip_available_weight_dec))

        if trip_available_weight_dec == 0:
            return 0 

        weight_ratio = shipment_weight_decimal / trip_available_weight_dec

        if weight_ratio <= 0.5:
            weight_score = 25
        elif weight_ratio <= 0.8:
            weight_score = 20
        else:
            weight_score = 15
        score += weight_score
        
        shipment_offered_price_dec = shipment.offered_price
        if hasattr(shipment_offered_price_dec, "to_decimal"):
            shipment_offered_price_dec = shipment_offered_price_dec.to_decimal()
        else:
            shipment_offered_price_dec = Decimal(str(shipment_offered_price_dec))

        trip_price_per_kg_dec = trip.price_per_kg
        if hasattr(trip_price_per_kg_dec, "to_decimal"):
            trip_price_per_kg_dec = trip_price_per_kg_dec.to_decimal()
        else:
            trip_price_per_kg_dec = Decimal(str(trip_price_per_kg_dec))

        estimated_price = trip_price_per_kg_dec * shipment_weight_decimal
        
        if estimated_price <= shipment_offered_price_dec:
            price_score = 25
        elif estimated_price <= (shipment_offered_price_dec * Decimal('1.2')):
            price_score = 15
        else:
            price_score = 5
        score += price_score
        
        priority_scores = {'low': 0, 'medium': 3, 'high': 7, 'urgent': 10}
        score += priority_scores.get(shipment.priority, 0)
        
        score += 8
        
        return score