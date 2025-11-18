import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import API from "../services/api";

const CreateShipmentForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    weight: "",
    dimensions: "",
    value: "",
    pickup_address: "",
    delivery_address: "",
    pickup_date: "",
    delivery_date: "",
    offered_price: "",
    priority: "normal",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await API.shipments.create(formData);
    if (result.success) {
      navigate("senderDashboard");
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
                  Weight
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2kg"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
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
