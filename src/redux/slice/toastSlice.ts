import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ToastState = {
  isVisible: boolean;
  message: string | null;
  type: "success" | "error";
};

const initialState: ToastState = {
  isVisible: false,
  message: null,
  type: "success",
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{ message: string; type: "success" | "error" }>) => {
      state.isVisible = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    hideToast(state) {
      state.isVisible = false;
      state.message = null;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;
