import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import API from "../services/api";

const CreateShipmentForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    weight: "",
    dimensions: JSON.stringify({ length: 10, width: 10, height: 10 }),
    value: "",
    pickup_address: "",
    pickup_city: "", // Ensure these are not empty defaults if you want to avoid errors
    delivery_address: "",
    delivery_city: "",
    pickup_date: "",
    delivery_date: "",
    offered_price: "",
    priority: "medium",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Helper to format date to ISO string (YYYY-MM-DDThh:mm:ss.sssZ)
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      return new Date(dateStr).toISOString();
    };

    // Prepare payload with correct data types
    const payload = {
      ...formData,
      // Convert strings to numbers
      weight: parseFloat(formData.weight),
      value: parseFloat(formData.value),
      offered_price: parseFloat(formData.offered_price),
      // Convert dates to ISO format
      pickup_date: formatDate(formData.pickup_date),
      delivery_date: formatDate(formData.delivery_date),
      // Handle dimensions JSON
      dimensions:
        typeof formData.dimensions === "string"
          ? JSON.parse(formData.dimensions)
          : formData.dimensions,
    };

    const result = await API.shipments.create(payload);
    if (result.success) {
      navigate("/senderDashboard");
    } else {
      alert("Error creating shipment: " + JSON.stringify(result.error));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        showBackButton
        onBack={() => navigate("senderDashboard")}
        title="Create Shipment"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 2.5"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Added Value Input Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipment Value (₹)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Declared value of items"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                required
              />
            </div>

            {/* Addresses and Cities */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Address
                </label>
                <input
                  type="text"
                  value={formData.pickup_address}
                  onChange={(e) =>
                    setFormData({ ...formData, pickup_address: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup City
                </label>
                <input
                  type="text"
                  value={formData.pickup_city}
                  onChange={(e) =>
                    setFormData({ ...formData, pickup_city: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </label>
                <input
                  type="text"
                  value={formData.delivery_address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      delivery_address: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery City
                </label>
                <input
                  type="text"
                  value={formData.delivery_city}
                  onChange={(e) =>
                    setFormData({ ...formData, delivery_city: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={formData.pickup_date}
                  onChange={(e) =>
                    setFormData({ ...formData, pickup_date: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.delivery_date}
                  onChange={(e) =>
                    setFormData({ ...formData, delivery_date: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offered Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.offered_price}
                  onChange={(e) =>
                    setFormData({ ...formData, offered_price: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Create Shipment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateShipmentForm;
