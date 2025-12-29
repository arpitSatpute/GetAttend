import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';

export interface INSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

// Helper to convert meters to degrees (approximate, for small distances)
function metersToLatLng(meters: number, bearing: number, lat: number, lng: number) {
  const R = 6378137; // Earth radius in meters
  const dLat = meters * Math.cos(bearing) / R;
  const dLng = meters * Math.sin(bearing) / (R * Math.cos((lat * Math.PI) / 180));
  return {
    latitude: lat + (dLat * 180) / Math.PI,
    longitude: lng + (dLng * 180) / Math.PI,
  };
}

export function useInertialNavigation(lastKnown: INSLocation | null) {
  const [location, setLocation] = useState<INSLocation | null>(lastKnown);
  const velocity = useRef({ x: 0, y: 0, z: 0 });
  const lastTimestamp = useRef<number | null>(null);
  const bearing = useRef(0); // radians

  useEffect(() => {
    let accelSub: any, gyroSub: any, magSub: any;
    let current = lastKnown;

    accelSub = Accelerometer.addListener(accel => {
      const now = Date.now();
      if (lastTimestamp.current) {
        const dt = (now - lastTimestamp.current) / 1000;
        velocity.current.x += accel.x * 9.81 * dt;
        velocity.current.y += accel.y * 9.81 * dt;
        // Only horizontal movement for simplicity
        const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
        const dist = speed * dt;
        if (current) {
          const { latitude, longitude } = metersToLatLng(dist, bearing.current, current.latitude, current.longitude);
          current = {
            latitude,
            longitude,
            accuracy: (current.accuracy || 10) + 2, // degrade accuracy
            timestamp: now,
          };
          setLocation(current);
        }
      }
      lastTimestamp.current = now;
    });

    gyroSub = Gyroscope.addListener(gyro => {
      // Integrate gyro.z for heading (bearing)
      bearing.current += gyro.z * 0.01; // dt ~0.01s
    });

    magSub = Magnetometer.addListener(mag => {
      // Optionally use magnetometer for heading correction
    });

    return () => {
      accelSub && accelSub.remove();
      gyroSub && gyroSub.remove();
      magSub && magSub.remove();
    };
  }, [lastKnown]);

  return location;
}
