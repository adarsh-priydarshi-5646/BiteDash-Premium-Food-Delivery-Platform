/**
 * Map Redux Slice - Geolocation & delivery address state
 * 
 * State: location (lat/lon), currentCity, currentState, currentAddress
 * Actions: setLocation, setCurrentCity, setCurrentAddress, setCurrentState
 * Used for city-based filtering and delivery tracking
 */
import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
  name: "user",
  initialState: {
    location: {
      lat: null,
      lon: null,
    },
    address: null,
  },
  reducers: {
    setLocation: (state, action) => {
      const { lat, lon } = action.payload;
      state.location.lat = lat;
      state.location.lon = lon;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const { setAddress, setLocation } = mapSlice.actions;
export default mapSlice.reducer;
