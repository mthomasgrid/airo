import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: false };
export const isPanelOpenSlice = createSlice({
  name: "isPanelOpen",
  initialState,
  reducers: {
    showPanel(state, action) {
      state.value = action.payload;
    },
  },
});

export const { showPanel } = isPanelOpenSlice.actions;
export default isPanelOpenSlice.reducer;
