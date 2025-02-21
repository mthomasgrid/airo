import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./slice/toastSlice";
import authReducer from "./slice/authSlice"
import isPanelShowReducer from "./slice/isPanelOpen";
import selectedDeviceReducer from "./slice/selectedDevice";
import isAddDevicePanelReducer from './slice/isAddDevicePanelSlice';
import isEditPanelOpenReducer from "./slice/EditDevice";
import devicesReducer from "./slice/deviceSlice";
import isOnboardingReducer from "./slice/isOnBoarding";
export const store = configureStore({
          reducer:{
                    auth:authReducer,
                    isPanelOpen:isPanelShowReducer,
                    toast: toastReducer,
                    selectedDevice:selectedDeviceReducer,
                    isAddDevicePanel: isAddDevicePanelReducer,
                    isEditPanel:isEditPanelOpenReducer,
                    devices: devicesReducer,
                    isOnboardPopupShown: isOnboardingReducer,
          }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;