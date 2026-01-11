/**
 * Owner Redux Slice - Restaurant owner's shop & menu state
 * 
 * State: myShopData (shop details, items, orders)
 * Actions: setMyShopData for shop CRUD operations
 * Used by owner dashboard to manage restaurant
 */
import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    myShopData: null,
  },
  reducers: {
    setMyShopData: (state, action) => {
      state.myShopData = action.payload;
    },
  },
});

export const { setMyShopData } = ownerSlice.actions;
export default ownerSlice.reducer;
