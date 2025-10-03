import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { CheckCircle, Package, Plane } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Share Space, Save Money
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect senders who need to ship packages with travelers who have
            extra baggage space. Safe, affordable, and convenient.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("signup")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* How it works section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Package className="text-blue-600 mb-4" size={48} />
            <h3 className="text-2xl font-bold mb-4">For Senders</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-1" size={16} />
                Post your package details
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-1" size={16} />
                Get matched with verified travelers
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-1" size={16} />
                Save up to 70% on shipping costs
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-1" size={16} />
                Track your package in real-time
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Plane className="text-purple-600 mb-4" size={48} />
            <h3 className="text-2xl font-bold mb-4">For Carriers</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-1" size={16} />
                Monetize your extra baggage space
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-1" size={16} />
                Help people save on shipping
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-1" size={16} />
                Earn money while you travel
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-1" size={16} />
                Simple and secure process
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
