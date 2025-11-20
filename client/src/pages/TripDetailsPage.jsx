import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Calendar, Eye, MapPin, Package, Plane, Weight } from "lucide-react";

const TripDetailsPage = () => {
  const [trip, setTrip] = useState(null);
  const [assignedShipments, setAssignedShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const tripId = location.state?.id;

  useEffect(() => {
    if (tripId) {
      Promise.all([
        API.trips.getDetails(tripId),
        API.trips.getShipments(tripId),
      ]).then(([tripData, shipmentsData]) => {
        setTrip(tripData);
        setAssignedShipments(shipmentsData); // This returns TripShipment objects
        setLoading(false);
      });
    }
  }, [tripId]);

  if (loading || !trip)
    return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        showBackButton
        onBack={() => navigate("/carrierDashboard")}
        title="Trip Details"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {trip.flight_number}
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Plane className="text-purple-600 mr-3" size={20} />
                    <span>{trip.airline}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="text-blue-600 mr-3" size={20} />
                    <span>
                      {trip.departure_city} → {trip.arrival_city}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="text-green-600 mr-3" size={20} />
                    <span>{trip.departure_date}</span>
                  </div>
                  <div className="flex items-center">
                    <Weight className="text-orange-600 mr-3" size={20} />
                    <span>{trip.total_weight_capacity}kg available</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    Earning Potential
                  </h3>
                  <p className="text-3xl font-bold text-purple-600">
                    ₹{trip.price_per_kg}/kg
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Max earnings: ₹
                    {trip.total_weight_capacity * trip.price_per_kg}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6">Assigned Shipments</h3>
            {assignedShipments.length > 0 ? (
              <div className="space-y-4">
                {assignedShipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold">{shipment.title}</h4>
                      <p className="text-gray-600">Weight: {shipment.weight}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ₹{shipment.price}
                      </p>
                      <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded transition-colors mt-2">
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package size={48} className="mx-auto mb-4 opacity-50" />
                <p>No shipments assigned yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;
