/**
 * useGetShopByCity Hook - Fetches restaurants in user's city
 *
 * Makes GET /shop/city/:city when city is available
 * Updates userSlice.shopsInMyCity for restaurant listing
 * Re-fetches when currentCity changes
 * Deduplicates requests within 10 seconds to prevent rate limiting
 */
import axios from 'axios';
import { useEffect } from 'react';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setShopsInMyCity } from '../redux/userSlice';

// Request deduplication cache
const requestCache = new Map();

const dedupedFetch = async (key, fetchFn, cacheDuration = 10000) => {
  const now = Date.now();

  if (requestCache.has(key)) {
    const cached = requestCache.get(key);
    if (now - cached.timestamp < cacheDuration) {
      return cached.promise;
    }
  }

  const promise = fetchFn();
  requestCache.set(key, { promise, timestamp: now });
  return promise;
};

function useGetShopByCity() {
  const dispatch = useDispatch();
  const { currentCity, userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchShops = async () => {
      try {
        if (!currentCity) return;
        const result = await dedupedFetch(
          `shop:city:${currentCity}`,
          async () => {
            return axios.get(
              `${serverUrl}/api/shop/get-by-city/${currentCity}`,
              {
                withCredentials: true,
              },
            );
          },
        );
        dispatch(setShopsInMyCity(result.data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchShops();
  }, [currentCity, userData, dispatch]);
}

export default useGetShopByCity;
