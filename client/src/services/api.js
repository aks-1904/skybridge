import axiosInstance from "./axiosInstance";

const API = {
  auth: {
    register: async (data) => {
      try {
        const response = await axiosInstance.post("/auth/auth/register/", data);
        console.log(response.data);
        return { success: true, ...response.data };
      } catch (error) {
        console.error("Registration error:", error.response?.data);
        return { success: false, error: error.response?.data };
      }
    },
    verifyPhone: async (otp, userId) => {
      try {
        const response = await axiosInstance.post("/auth/auth/verify_phone/", {
          otp,
          user_id: userId,
        });
        return { success: true, ...response.data };
      } catch (error) {
        return { success: false, error: error.response?.data };
      }
    },
    login: async (credentials) => {
      try {
        const response = await axiosInstance.post(
          "/auth/auth/login/",
          credentials
        );
        // The backend returns { token: '...', user: {...} }
        const userData = {
          ...response.data.user,
          token: response.data.token,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        return { success: true, user: userData };
      } catch (error) {
        console.error("Login error:", error.response?.data);
        return { success: false, error: error.response?.data };
      }
    },
    updateUser: async (id, data) => {
      try {
        const response = await axiosInstance.patch(`/auth/users/${id}/`, data);
        return { success: true, user: response.data };
      } catch (error) {
        return { success: false, error: error.response?.data };
      }
    },
  },
  shipments: {
    getAll: async () => {
      const response = await axiosInstance.get("/shipments/");
      // FIX: Check for pagination 'results' or fallback to data
      return response.data.results || response.data;
    },
    create: async (data) => {
      try {
        const response = await axiosInstance.post("/shipments/", data);
        return { success: true, data: response.data };
      } catch (error) {
        return { success: false, error: error.response?.data };
      }
    },
    getById: async (id) => {
      const response = await axiosInstance.get(`/shipments/${id}/`);
      return response.data;
    },
    findMatches: async (id) => {
      // Based on ShipmentViewSet.find_matches action
      const response = await axiosInstance.post(
        `/shipments/${id}/find_matches/`
      );
      return response.data.matches;
    },
    assignCarrier: async (shipmentId, tripId) => {
      try {
        const response = await axiosInstance.post(
          `/shipments/${shipmentId}/assign_carrier/`,
          {
            trip_id: tripId,
          }
        );
        return { success: true, data: response.data };
      } catch (error) {
        return { success: false, error: error.response?.data };
      }
    },
  },
  trips: {
    getAll: async () => {
      const response = await axiosInstance.get("/trips/");
      // FIX: Check for pagination 'results'
      return response.data.results || response.data;
    },
    create: async (data) => {
      try {
        const response = await axiosInstance.post("/trips/", data);
        return { success: true, data: response.data };
      } catch (error) {
        return { success: false, error: error.response?.data };
      }
    },
    getDetails: async (id) => {
      const response = await axiosInstance.get(`/trips/${id}/`);
      return response.data;
    },
    getShipments: async (id) => {
      const response = await axiosInstance.get(`/trips/${id}/shipments/`);
      return response.data;
    },
  },
  notifications: {
    getAll: async () => {
      const response = await axiosInstance.get("/notifications/");
      // FIX: Check for pagination 'results'
      return response.data.results || response.data;
    },
    markRead: async (id) => {
      await axiosInstance.post(`/notifications/${id}/mark_read/`);
    },
    markAllRead: async () => {
      await axiosInstance.post("/notifications/mark_all_read/");
    },
  },
};

export default API;
