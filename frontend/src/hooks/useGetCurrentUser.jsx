/**
 * useGetCurrentUser Hook - Fetches authenticated user on app load
 *
 * Makes GET /user/me request with credentials
 * Updates Redux userSlice with user data or null
 * Sets authLoading state for loading UI
 */
import axios from 'axios';
import React, { useEffect } from 'react';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData, setAuthLoading } from '../redux/userSlice';

function useGetCurrentUser() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        dispatch(setAuthLoading(true));
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
          signal: controller.signal,
        });
        dispatch(setUserData(result.data));
        clearTimeout(timeoutId);
      } catch (error) {
        if (error.name === 'CanceledError' || error.code === 'ECONNABORTED') {
          console.warn('Authentication request timed out - backend may be unavailable');
        } else if (error.response?.status === 401) {
        } else {
          console.error('Error fetching current user:', error.message);
        }
      } finally {
        clearTimeout(timeoutId);
        dispatch(setAuthLoading(false));
      }
    };
    fetchUser();
  }, []);
}

export default useGetCurrentUser;
