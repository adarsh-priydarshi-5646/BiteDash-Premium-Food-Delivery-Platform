/**
 * useGetItemsByCity Hook - Fetches food items in user's city
 *
 * Makes GET /item/city/:city when city is available
 * Updates userSlice.itemsInMyCity for food listing
 * Re-fetches when currentCity changes
 * Deduplicates requests within 10 seconds to prevent rate limiting
 */
import axios from 'axios';
import { useEffect } from 'react';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setItemsInMyCity } from '../redux/userSlice';

// Request deduplication cache
const requestCache = new Map();

const dedupedFetch = async (key, fetchFn, cacheDuration = 10000) => {
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

function useGetItemsByCity() {
  const dispatch = useDispatch();
  const { currentCity, userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (!currentCity) return;
        const result = await dedupedFetch(
          `item:city:${currentCity}`,
          async () => {
            return axios.get(
              `${serverUrl}/api/item/get-by-city/${currentCity}`,
              {
                withCredentials: true,
              },
            );
          },
        );
        dispatch(setItemsInMyCity(result.data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchItems();
  }, [currentCity, userData, dispatch]);
}

export default useGetItemsByCity;
