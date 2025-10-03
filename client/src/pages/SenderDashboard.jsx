import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { Edit, Eye, Plus } from "lucide-react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const SenderDashboard = () => {
  const [shipments, setShipments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    API.shipments.getAll().then(setShipments);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "matched":
        return "text-blue-600 bg-blue-100";
      case "in_transit":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="Sender Dashboard" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">My Shipments</h2>
          <button
            onClick={() => navigate("/createShipment")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus size={20} />
            <span>Create Shipment</span>
          </button>
        </div>

        <div className="grid gap-6">
          {shipments.map((shipment) => (
            <div
              key={shipment.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {shipment.title}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Tracking: {shipment.tracking_number}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      shipment.status
                    )}`}
                  >
                    {shipment.status.charAt(0).toUpperCase() +
                      shipment.status.slice(1)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{shipment.offered_price}
                  </p>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() =>
                        navigate("shipmentDetails", { id: shipment.id })
                      }
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SenderDashboard;
