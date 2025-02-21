import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";



export const isAddDevicePanel = (state:RootState) => {
       return state.isAddDevicePanel;   
}

export const isAddDevicePanelSelector=
 createSelector(isAddDevicePanel,(isAddDevicePanelShown) => isAddDevicePanelShown.value);