import API from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Calendar, DollarSign, MapPin, Package, Search } from "lucide-react";
import { useShipmentDetails } from "../hooks/useSkybridge";

const ShipmentDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const shipmentId = location.state?.id; // Get ID from navigation state

  const { shipment, matches, loading, findMatches } =
    useShipmentDetails(shipmentId);

  const handleAssign = async (tripId) => {
    const result = await API.shipments.assignCarrier(shipment.id, tripId);
    if (result.success) {
      alert("Carrier assigned successfully!");
      navigate("/senderDashboard");
    } else {
      alert(result.error?.error || "Assignment failed");
    }
  };

  if (loading || !shipment)
    return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        showBackButton
        onBack={() => navigate("senderDashboard")}
        title="Shipment Details"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">{shipment.title}</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Package className="text-blue-600 mr-3" size={20} />
                    <span>Weight: {shipment.weight}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="text-green-600 mr-3" size={20} />
                    <span>
                      {shipment.pickup_address} → {shipment.delivery_address}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="text-purple-600 mr-3" size={20} />
                    <span>
                      {shipment.pickup_date} - {shipment.delivery_date}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="text-green-600 mr-3" size={20} />
                    <span className="text-xl font-bold">
                      ₹{shipment.offered_price}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-600 mb-6">{shipment.description}</p>
                {shipment.status === "pending" && (
                  <button
                    onClick={findMatches}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Search size={20} />
                    <span>Find Matching Trips</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {matches.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold mb-6">Available Carriers</h3>
              <div className="space-y-4">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <h4 className="font-semibold">{match.carrier_name}</h4>
                      <p className="text-gray-600">
                        {match.departure} → {match.arrival}
                      </p>
                      <p className="text-sm text-gray-500">
                        Date: {match.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ₹{match.price_estimate}
                      </p>
                      <button
                        onClick={() => handleAssign(match.trip.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                      >
                        Assign Carrier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsPage;
