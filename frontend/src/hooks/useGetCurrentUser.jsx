/**
 * useGetCurrentUser Hook - Fetches authenticated user on app load
 *
 * Makes GET /user/me request with credentials
 * Updates Redux userSlice with user data or null
 * Sets authLoading state for loading UI
 * Deduplicates requests within 5 seconds to prevent rate limiting
 */
import axios from 'axios';
import { useEffect } from 'react';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData, setAuthLoading } from '../redux/userSlice';

// Request deduplication cache
const requestCache = new Map();

const dedupedFetch = async (key, fetchFn, cacheDuration = 5000) => {
  const now = Date.now();

  if (requestCache.has(key)) {
    const cached = requestCache.get(key);
    if (now - cached.timestamp < cacheDuration) {
      return cached.promise;
    } else {
      // Clean up expired cache
      requestCache.delete(key);
    }
  }

  const promise = fetchFn();
  requestCache.set(key, { promise, timestamp: now });

  // Auto cleanup after cache duration
  setTimeout(() => {
    requestCache.delete(key);
  }, cacheDuration);

  return promise;
};

function useGetCurrentUser() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        dispatch(setAuthLoading(true));
        const result = await dedupedFetch('user:current', async () => {
          return axios.get(`${serverUrl}/api/user/current`, {
            withCredentials: true,
            signal: controller.signal,
          });
        });
        dispatch(setUserData(result.data));
        clearTimeout(timeoutId);
      } catch (error) {
        if (error.name === 'CanceledError' || error.code === 'ECONNABORTED') {
          console.warn(
            'Authentication request timed out - backend may be unavailable',
          );
        } else if (error.response?.status === 401) {
          // Unauthorized - user not logged in
        } else {
          console.error('Error fetching current user:', error.message);
        }
      } finally {
        clearTimeout(timeoutId);
        dispatch(setAuthLoading(false));
      }
    };
    fetchUser();
  }, [dispatch]);
}

export default useGetCurrentUser;
