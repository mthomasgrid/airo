import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: false };
export const isEditPanelOpenSlice = createSlice({
  name: "isEditPanelOpen",
  initialState,
  reducers: {
    showEditPanel(state, action) {
      state.value = action.payload;
    },
  },
});

export const { showEditPanel } = isEditPanelOpenSlice.actions;
export default isEditPanelOpenSlice.reducer;
