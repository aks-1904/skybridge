import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navigation from "../components/Navigation";
import { Plane } from "lucide-react";

const CreateTripForm = () => {
  const [formData, setFormData] = useState({
    airline: "",
    flight_number: "",
    departure_city: "",
    arrival_city: "",
    departure_date: "",
    arrival_date: "",
    total_weight_capacity: "",
    price_per_kg: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await API.trips.create(formData);
    if (result.success) {
      navigate("carrierDashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        showBackButton
        onBack={() => navigate("carrierDashboard")}
        title="Create Trip"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Plane className="mx-auto text-purple-600 mb-4" size={48} />
            <h2 className="text-2xl font-bold">Post Your Travel Plans</h2>
            <p className="text-gray-600">
              Share your trip details to help senders
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Airline
                </label>
                <input
                  type="text"
                  placeholder="e.g., Air India"
                  value={formData.airline}
                  onChange={(e) =>
                    setFormData({ ...formData, airline: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flight Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., AI101"
                  value={formData.flight_number}
                  onChange={(e) =>
                    setFormData({ ...formData, flight_number: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From City
                </label>
                <input
                  type="text"
                  placeholder="e.g., Delhi"
                  value={formData.departure_city}
                  onChange={(e) =>
                    setFormData({ ...formData, departure_city: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To City
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mumbai"
                  value={formData.arrival_city}
                  onChange={(e) =>
                    setFormData({ ...formData, arrival_city: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departure Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.departure_date}
                  onChange={(e) =>
                    setFormData({ ...formData, departure_date: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arrival Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.arrival_date}
                  onChange={(e) =>
                    setFormData({ ...formData, arrival_date: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Weight (kg)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 15"
                  value={formData.total_weight_capacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_weight_capacity: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Kg (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 200"
                  value={formData.price_per_kg}
                  onChange={(e) =>
                    setFormData({ ...formData, price_per_kg: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Create Trip
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTripForm;
