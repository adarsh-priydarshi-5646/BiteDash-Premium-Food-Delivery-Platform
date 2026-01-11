/**
 * useUpdateLocation Hook - Real-time location tracking for delivery
 *
 * Uses browser Geolocation API with watchPosition for continuous updates
 * Sends location to server via PUT /user/update-location
 * Emits Socket.IO 'updateLocation' event for real-time tracking
 */
import axios from 'axios';
import React, { useEffect } from 'react';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
  setUserData,
} from '../redux/userSlice';
import { setAddress, setLocation } from '../redux/mapSlice';

function useUpdateLocation() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;

    let lastUpdate = 0;
    const updateInterval = 60000; // Update server every 60 seconds at most

    const updateLocation = async (lat, lon) => {
      const now = Date.now();
      if (now - lastUpdate < updateInterval) return;

      try {
        await axios.post(
          `${serverUrl}/api/user/update-location`,
          { lat, lon },
          { withCredentials: true }
        );
        lastUpdate = now;
      } catch (err) {}
    };

    let watchId;
    const startWatching = () => {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            updateLocation(pos.coords.latitude, pos.coords.longitude);
          },
          (err) => {},
          { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 }
        );
      }
    };

    const handleFirstInteraction = () => {
      startWatching();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          startWatching();
        } else {
          window.addEventListener('click', handleFirstInteraction);
          window.addEventListener('touchstart', handleFirstInteraction);
        }
      });
    } else {
      window.addEventListener('click', handleFirstInteraction);
      window.addEventListener('touchstart', handleFirstInteraction);
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [userData?._id]);
}

export default useUpdateLocation;
