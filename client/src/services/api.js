const API = {
  auth: {
    register: async (data) => {
      console.log("Registering:", data);
      return { success: true, message: "OTP sent to phone" };
    },
    verifyPhone: async (otp) => {
      console.log("Verifying OTP:", otp);
      return { success: true, message: "Phone verified" };
    },
    login: async (credentials) => {
      console.log("Logging in:", credentials);
      // Mock successful login
      const mockUser = {
        id: 1,
        username: credentials.username,
        role: "sender", // or 'carrier'
        token: "mock-jwt-token",
      };
      localStorage.setItem("user", JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    },
  },
  shipments: {
    getAll: async () => [
      {
        id: 1,
        title: "Documents to Mumbai",
        tracking_number: "BS001",
        status: "pending",
        offered_price: 500,
      },
      {
        id: 2,
        title: "Gift Package",
        tracking_number: "BS002",
        status: "matched",
        offered_price: 800,
      },
    ],
    create: async (data) => {
      console.log("Creating shipment:", data);
      return { success: true, id: Math.random() };
    },
    getById: async (id) => ({
      id,
      title: "Documents to Mumbai",
      description: "Important business documents",
      weight: "2kg",
      dimensions: "30x20x5cm",
      value: 5000,
      pickup_address: "Delhi",
      delivery_address: "Mumbai",
      pickup_date: "2025-10-01",
      delivery_date: "2025-10-03",
      offered_price: 500,
      status: "pending",
    }),
    findMatches: async (id) => [
      {
        id: 1,
        carrier_name: "John Doe",
        price_estimate: 450,
        departure: "Delhi",
        arrival: "Mumbai",
        date: "2025-10-02",
      },
      {
        id: 2,
        carrier_name: "Jane Smith",
        price_estimate: 400,
        departure: "Delhi",
        arrival: "Mumbai",
        date: "2025-10-01",
      },
    ],
  },
  trips: {
    getAll: async () => [
      {
        id: 1,
        flight_number: "AI101",
        departure_city: "Delhi",
        arrival_city: "Mumbai",
        departure_date: "2025-10-01",
      },
      {
        id: 2,
        flight_number: "SG205",
        departure_city: "Mumbai",
        arrival_city: "Bangalore",
        departure_date: "2025-10-05",
      },
    ],
    create: async (data) => {
      console.log("Creating trip:", data);
      return { success: true, id: Math.random() };
    },
  },
  notifications: {
    getAll: async () => [
      {
        id: 1,
        title: "Shipment Matched",
        message: "Your package has been matched with a carrier",
        read: false,
      },
      {
        id: 2,
        title: "Payment Received",
        message: "Payment has been processed successfully",
        read: true,
      },
    ],
  },
};

export default API;
