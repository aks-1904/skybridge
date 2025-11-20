import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { useNotifications } from "../hooks/useSkybridge";
import { UserContext } from "../context/UserContext";
import API from "../services/api";

const NotificationPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { notifications, refetch } = useNotifications();

  const handleMarkRead = async (id) => {
    await API.notifications.markRead(id);
    refetch(); // Refresh list
  };

  const handleMarkAllRead = async () => {
    await API.notifications.markAllRead();
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        showBackButton
        onBack={() => navigate(-1)}
        title="Notifications"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
            {notifications.some((n) => !n.is_read) && (
              <button
                onClick={handleMarkAllRead}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors text-sm"
              >
                Mark All Read
              </button>
            )}
          </div>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                    notification.is_read
                      ? "border-gray-300"
                      : "border-blue-500 bg-blue-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkRead(notification.id)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm transition-colors"
                        >
                          Mark Read
                        </button>
                      )}
                      <div
                        className={`w-3 h-3 rounded-full ${
                          notification.is_read ? "bg-gray-300" : "bg-blue-500"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
