import { createSlice } from "@reduxjs/toolkit";


const initialState = { value: false };
export const isAddDeviceOpenSlice = createSlice({
  name: "isAddDeviceOpen",
  initialState,
  reducers: {
    showAddDevicePanel(state, action) {
      state.value = action.payload;
    },
  },
});

export const { showAddDevicePanel } = isAddDeviceOpenSlice.actions;
export default isAddDeviceOpenSlice.reducer;
