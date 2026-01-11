/**
 * Redux Store - Centralized state management with 3 slices
 * 
 * Slices: userSlice (auth, cart, orders), ownerSlice (shop), mapSlice (location)
 * Middleware: Serializable check disabled for Socket.IO instance
 * Configured with Redux Toolkit for simplified setup
 */
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import ownerSlice from "./ownerSlice";
import mapSlice from "./mapSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    owner: ownerSlice,
    map: mapSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        
        ignoredActions: ['user/setSocket'],
        ignoredPaths: ['user.socket'],
      },
    }),
});
