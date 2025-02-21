import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Device } from "@/types/Types";

interface DevicesState {
  devices: Device[];
}

const initialState: DevicesState = {
  devices: [],
};

const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    setDevices: (state, action: PayloadAction<Device[]>) => {
      state.devices = action.payload;
    },
    addDevice: (state, action: PayloadAction<Device>) => {
         
      state.devices.push(action.payload);
    },
    updateDevice: (state, action: PayloadAction<Device>) => {
      const index = state.devices.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.devices[index] = action.payload;
      }
    },
    deleteDevice: (state, action: PayloadAction<string>) => {
      state.devices = state.devices.filter((device) => device.id !== action.payload);
    },
  },
});

export const { setDevices, addDevice, updateDevice, deleteDevice } = devicesSlice.actions;
export default devicesSlice.reducer;
