import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Device } from "@/types/Types";



const selectedDevice = (state: RootState): Device | null  =>  {
      
       return state.selectedDevice;   
}

export const selectedDeviceSelector= createSelector(selectedDevice,(device) => device);