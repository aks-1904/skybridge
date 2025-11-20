import { useState, useEffect, useCallback } from "react";
import API from "../services/api";

// Hook for fetching Shipments
export const useShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShipments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await API.shipments.getAll();
      setShipments(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  return { shipments, loading, error, refetch: fetchShipments };
};

// Hook for fetching Trips
export const useTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      const data = await API.trips.getAll();
      setTrips(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return { trips, loading, error, refetch: fetchTrips };
};

// Hook for Notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await API.notifications.getAll();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Optional: Set up polling interval
    // const interval = setInterval(fetchNotifications, 30000);
    // return () => clearInterval(interval);
  }, [fetchNotifications]);

  return { notifications, refetch: fetchNotifications };
};

// Hook for a single Shipment details + Matching
export const useShipmentDetails = (id) => {
  const [shipment, setShipment] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    API.shipments.getById(id).then((data) => {
      setShipment(data);
      setLoading(false);
    });
  }, [id]);

  const findMatches = async () => {
    setLoading(true);
    const results = await API.shipments.findMatches(id);
    setMatches(results);
    setLoading(false);
  };

  return { shipment, matches, loading, findMatches };
};
