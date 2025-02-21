import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const devicesSliceSelector = (state: RootState) => state.devices;


export const allDevicesSelector = createSelector(devicesSliceSelector, (devicesState) => {
  return devicesState.devices;
});