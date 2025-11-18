import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { CheckCircle, User } from "lucide-react";
import { UserContext } from "../context/UserContext";

const ProfilePage = () => {
  const { user } = useContext(UserContext);

  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: "user@example.com",
    phone_number: "+91 9876543210",
    full_name: "",
    date_of_birth: "",
    address: "",
    aadhaar_verified: false,
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Updating profile:", profile);
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        showBackButton
        onBack={() => navigate("/" + user.role + "Dashboard")}
        title="Profile"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold">{profile.username}</h2>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
              {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) =>
                    setProfile({ ...profile, username: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex">
                <input
                  type="tel"
                  value={profile.phone_number}
                  onChange={(e) =>
                    setProfile({ ...profile, phone_number: e.target.value })
                  }
                  className="flex-1 p-3 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex items-center px-4 bg-green-100 border border-l-0 rounded-r-lg">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Aadhaar Verification</h3>
                {profile.aadhaar_verified ? (
                  <span className="flex items-center text-green-600">
                    <UserCheck size={16} className="mr-1" />
                    Verified
                  </span>
                ) : (
                  <span className="text-orange-600">Not Verified</span>
                )}
              </div>
              {!profile.aadhaar_verified && (
                <button
                  type="button"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Verify Aadhaar
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
