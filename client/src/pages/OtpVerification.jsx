import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Phone } from "lucide-react";

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await API.auth.verifyPhone(otp);
    if (result.success) {
      navigate("login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        showBackButton
        onBack={() => navigate("signup")}
        title="Verify Phone"
      />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <Phone className="mx-auto text-blue-600 mb-4" size={48} />
            <h2 className="text-2xl font-bold mb-2">Verify Your Phone</h2>
            <p className="text-gray-600">
              Enter the OTP sent to your phone number
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength="6"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
