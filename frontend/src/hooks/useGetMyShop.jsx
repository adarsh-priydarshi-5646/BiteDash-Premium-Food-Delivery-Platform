/**
 * useGetMyShop Hook - Fetches owner's restaurant data
 *
 * Makes GET /shop/my-shop for authenticated owners
 * Updates ownerSlice with shop details and menu items
 * Runs when userData changes (login/logout)
 * Deduplicates requests within 5 seconds to prevent rate limiting
 */
import axios from 'axios';
import { useEffect } from 'react';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

// Request deduplication cache
const requestCache = new Map();

const dedupedFetch = async (key, fetchFn, cacheDuration = 5000) => {
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

function useGetMyshop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await dedupedFetch('shop:my', async () => {
          return axios.get(`${serverUrl}/api/shop/get-my`, {
            withCredentials: true,
          });
        });
        dispatch(setMyShopData(result.data));
      } catch (error) {
        console.error(error);
      }
    };
    if (userData) {
      fetchShop();
    }
  }, [userData, dispatch]);
}

export default useGetMyshop;
