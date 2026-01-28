/**
 * useGetMyOrders Hook - Fetches orders based on user role
 *
 * Makes GET /order/my-orders for all authenticated users
 * Returns different data based on role: user orders, owner orders, delivery assignments
 * Updates userSlice.myOrders with order history
 * Deduplicates requests within 10 seconds to prevent rate limiting
 */
import axios from 'axios';
import { useEffect } from 'react';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setMyOrders } from '../redux/userSlice';

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

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await dedupedFetch('order:my', async () => {
          return axios.get(`${serverUrl}/api/order/my-orders`, {
            withCredentials: true,
          });
        });

        dispatch(setMyOrders(result.data));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    if (userData) {
      fetchOrders();
    }
  }, [userData, dispatch]);

  return null;
}

export default useGetMyOrders;
