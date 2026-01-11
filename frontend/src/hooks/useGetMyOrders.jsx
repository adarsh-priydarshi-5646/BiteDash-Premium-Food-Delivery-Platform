/**
 * useGetMyOrders Hook - Fetches orders based on user role
 * 
 * Makes GET /order/my-orders for all authenticated users
 * Returns different data based on role: user orders, owner orders, delivery assignments
 * Updates userSlice.myOrders with order history
 */
import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders, setUserData } from "../redux/userSlice";
import { setMyShopData } from "../redux/ownerSlice";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/order/my-orders`, {
          withCredentials: true,
        });

        dispatch(setMyOrders(result.data));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    if (userData) {
      fetchOrders();
    }
  }, [userData]);
  
  return null;
}

export default useGetMyOrders;
