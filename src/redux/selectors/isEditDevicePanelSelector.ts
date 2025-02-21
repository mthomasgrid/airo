import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";



const isEditDevicePanel = (state:RootState) => {
       return state.isEditPanel;   
}

export const isEditDevicePanelShowSelector= createSelector(isEditDevicePanel,(isEditPanel) => isEditPanel.value);