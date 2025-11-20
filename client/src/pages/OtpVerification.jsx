import { useState } from "react";
import API from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Phone } from "lucide-react";

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {}; // Get userId passed from SignUp

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("User ID missing. Please sign up again.");
      return;
    }

    const result = await API.auth.verifyPhone(otp, userId);
    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error?.error || "Verification failed");
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

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
