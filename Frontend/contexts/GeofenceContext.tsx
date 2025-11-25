import * as Location from 'expo-location';
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

export interface Geofence {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  type: 'office' | 'branch' | 'field';
  createdAt: Date;
  address?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
}

export interface GeofenceEvent {
  geofenceId: string;
  eventType: 'entry' | 'exit';
  timestamp: Date;
  location: LocationData;
  accuracy: number | null;
}

interface GeofenceContextType {
  geofences: Geofence[];
  currentLocation: LocationData | null;
  activeGeofence: Geofence | null;
  isInsideGeofence: boolean;
  geofenceEvents: GeofenceEvent[];
  locationPermission: boolean;
  isTracking: boolean;
  addGeofence: (geofence: Geofence) => void;
  removeGeofence: (id: string) => void;
  updateGeofence: (id: string, updates: Partial<Geofence>) => void;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  setActiveGeofence: (geofence: Geofence | null) => void;
  getGeofenceStatus: (geofence: Geofence, location: LocationData) => boolean;
}

const GeofenceContext = React.createContext<GeofenceContextType | undefined>(undefined);

export const useGeofence = () => {
  const context = React.useContext(GeofenceContext);
  if (!context) {
    throw new Error('useGeofence must be used within a GeofenceProvider');
  }
  return context;
};

// Mock geofences for demo purposes
const MOCK_GEOFENCES: Geofence[] = [
  {
    id: 'office-main',
    name: 'Main Office',
    latitude: 21.355897,
    longitude: 78.980604,
    radius: 500,
    type: 'office',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    address: 'Main Office Building, Central District'
  },
  {
    id: 'office-branch1',
    name: 'Branch Office - West',
    latitude: 21.315897,
    longitude: 78.940604,
    radius: 400,
    type: 'branch',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    address: 'West Branch Building'
  },
  {
    id: 'office-branch2',
    name: 'Branch Office - East',
    latitude: 21.375897,
    longitude: 79.020604,
    radius: 350,
    type: 'branch',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    address: 'East Branch Building'
  }
];

interface GeofenceProviderProps {
  children: ReactNode;
}

export const GeofenceProvider: React.FC<GeofenceProviderProps> = ({ children }) => {
  const [geofences, setGeofences] = useState<Geofence[]>(MOCK_GEOFENCES);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [activeGeofence, setActiveGeofence] = useState<Geofence | null>(null);
  const [isInsideGeofence, setIsInsideGeofence] = useState(false);
  const [geofenceEvents, setGeofenceEvents] = useState<GeofenceEvent[]>([]);
  const [locationPermission, setLocationPermission] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Check if location is inside geofence
  const getGeofenceStatus = useCallback((geofence: Geofence, location: LocationData): boolean => {
    const distance = calculateDistance(
      geofence.latitude,
      geofence.longitude,
      location.latitude,
      location.longitude
    );
    return distance <= geofence.radius;
  }, []);

  // Handle location updates
  const handleLocationUpdate = useCallback((location: LocationData) => {
    setCurrentLocation(location);

    if (activeGeofence) {
      const isInside = getGeofenceStatus(activeGeofence, location);
      const wasInside = isInsideGeofence;

      // Detect entry/exit
      if (isInside && !wasInside) {
        const event: GeofenceEvent = {
          geofenceId: activeGeofence.id,
          eventType: 'entry',
          timestamp: new Date(),
          location,
          accuracy: location.accuracy
        };
        setGeofenceEvents(prev => [event, ...prev]);
        setIsInsideGeofence(true);
      } else if (!isInside && wasInside) {
        const event: GeofenceEvent = {
          geofenceId: activeGeofence.id,
          eventType: 'exit',
          timestamp: new Date(),
          location,
          accuracy: location.accuracy
        };
        setGeofenceEvents((prev: GeofenceEvent[]) => [event, ...prev]);
      }
    }
  }, [activeGeofence, isInsideGeofence, getGeofenceStatus]);

  // Request location permissions
  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setLocationPermission(granted);
      return granted;
    } catch (error) {
      console.error('Failed to request location permission:', error);
      return false;
    }
  }, []);

  // Start continuous location tracking
  const startTracking = useCallback(async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.error('Location permission not granted');
        return;
      }

      // Enable background location tracking
      await Location.startLocationUpdatesAsync('location-tracking', {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 2000, // Update every 2 seconds
        distanceInterval: 5, // Or every 5 meters
        showsBackgroundLocationIndicator: true,
      });

      // Also set up real-time listener
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (location) => {
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp,
            altitude: location.coords.altitude,
            speed: location.coords.speed,
            heading: location.coords.heading,
          };
          handleLocationUpdate(locationData);
        }
      );

      locationSubscription.current = subscription;
      setIsTracking(true);
    } catch (error) {
      console.error('Failed to start tracking:', error);
    }
  }, [requestLocationPermission, handleLocationUpdate]);

  // Stop location tracking
  const stopTracking = useCallback(() => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    setIsTracking(false);
  }, []);

  // Add geofence
  const addGeofence = useCallback((geofence: Geofence) => {
    setGeofences((prev: Geofence[]) => [...prev, geofence]);
  }, []);

  // Remove geofence
  const removeGeofence = useCallback((id: string) => {
    setGeofences((prev: Geofence[]) => prev.filter((g: Geofence) => g.id !== id));
    if (activeGeofence?.id === id) {
      setActiveGeofence(null);
    }
  }, [activeGeofence]);

  // Update geofence
  const updateGeofence = useCallback((id: string, updates: Partial<Geofence>) => {
    setGeofences((prev: Geofence[]) =>
      prev.map((g: Geofence) => g.id === id ? { ...g, ...updates } : g)
    );
    if (activeGeofence?.id === id) {
      setActiveGeofence((prev: Geofence | null) => prev ? { ...prev, ...updates } : null);
    }
  }, [activeGeofence]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  const value: GeofenceContextType = {
    geofences,
    currentLocation,
    activeGeofence,
    isInsideGeofence,
    geofenceEvents,
    locationPermission,
    isTracking,
    addGeofence,
    removeGeofence,
    updateGeofence,
    startTracking,
    stopTracking,
    setActiveGeofence,
    getGeofenceStatus,
  };

  return (
    <GeofenceContext.Provider value={value}>
      {children}
    </GeofenceContext.Provider>
  );
};
