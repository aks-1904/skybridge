import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Calendar, Edit, Eye, Plane, Plus, Truck } from "lucide-react";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";

const CarrierDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [carriedShipments, setCarriedShipments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    API.trips.getAll().then(setTrips);
    API.shipments
      .getAll()
      .then((data) =>
        setCarriedShipments(data.filter((s) => s.status === "matched"))
      );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="Carrier Dashboard" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Trips Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">My Trips</h2>
              <button
                onClick={() => navigate("/createTrip")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus size={20} />
                <span>Add Trip</span>
              </button>
            </div>

            <div className="space-y-4">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {trip.flight_number}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Plane className="mr-2" size={16} />
                        <span>
                          {trip.departure_city} → {trip.arrival_city}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="mr-2" size={16} />
                        <span>{trip.departure_date}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate("/tripDetails", { id: trip.id })}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carried Shipments Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Carrying Shipments
            </h2>
            <div className="space-y-4">
              {carriedShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {shipment.title}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        Tracking: {shipment.tracking_number}
                      </p>
                      <div className="flex items-center">
                        <Truck className="text-blue-600 mr-2" size={16} />
                        <span className="text-blue-600 font-medium">
                          In Transit
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        ₹{shipment.offered_price}
                      </p>
                      <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded transition-colors mt-2">
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrierDashboard;
