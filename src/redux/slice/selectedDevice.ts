import { Device } from "@/types/Types";
import { createSlice } from "@reduxjs/toolkit";

const initialState:Device|null = null;

export const selectedDeviceSlice = createSlice({
  name: "selectedDevice",
  initialState,
  reducers: {
    selectDevice(state, action) {
      return action.payload;
    },
  },
});

export const { selectDevice } = selectedDeviceSlice.actions;
export default selectedDeviceSlice.reducer;
