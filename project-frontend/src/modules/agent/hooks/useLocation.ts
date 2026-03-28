// hooks/useLocation.ts
import { useState, useEffect } from 'react';
import type { Location } from '../types/agent.types';

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<PermissionState | null>(null);

  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          setLocation(newLocation);
          setLoading(false);
          resolve(newLocation);
        },
        (err) => {
          const errorMessage = err.message;
          setError(errorMessage);
          setLoading(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const checkGeofence = (targetLocation: { latitude: number; longitude: number; radius: number }): boolean => {
    if (!location) return false;
    
    const R = 6371e3; // Earth's radius in meters
    const φ1 = location.latitude * Math.PI / 180;
    const φ2 = targetLocation.latitude * Math.PI / 180;
    const Δφ = (targetLocation.latitude - location.latitude) * Math.PI / 180;
    const Δλ = (targetLocation.longitude - location.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance <= targetLocation.radius;
  };

  const requestPermission = async () => {
    if (!navigator.permissions) {
      setPermission('prompt');
      return;
    }

    try {
      const status = await navigator.permissions.query({ name: 'geolocation' });
      setPermission(status.state);
      
      status.onchange = () => {
        setPermission(status.state);
      };
    } catch (err) {
      console.error('Error checking permission:', err);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return {
    location,
    loading,
    error,
    permission,
    getCurrentLocation,
    checkGeofence,
    isWithinGeofence: (center: { latitude: number; longitude: number; radius: number }) => 
      checkGeofence(center)
  };
};