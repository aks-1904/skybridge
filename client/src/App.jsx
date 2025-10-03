import React from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import LandingPage from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import OTPVerificationPage from "./pages/OtpVerification";
import SenderDashboard from "./pages/SenderDashboard";
import CreateShipmentForm from "./pages/CreateShipmentForm";
import ShipmentDetailsPage from "./pages/ShipmentDetailsPage";
import CarrierDashboard from "./pages/CarrierDashboard";
import CreateTripForm from "./pages/CreateTripForm";
import TripDetailsPage from "./pages/TripDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationPage";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/otp" element={<OTPVerificationPage />} />
          <Route path="/senderDashboard" element={<SenderDashboard />} />
          <Route path="/createShipment" element={<CreateShipmentForm />} />
          <Route path="/shipmentDetails" element={<ShipmentDetailsPage />} />
          <Route path="/carrierDashboard" element={<CarrierDashboard />} />
          <Route path="/createTrip" element={<CreateTripForm />} />
          <Route path="/tripDetails" element={<TripDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </div>
    </UserProvider>
  );
};

export default App;
