import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = { value: true as boolean };

const isOnboardingSlice = createSlice({
  name: 'isOnboarding',
  initialState,
  reducers: {
    toggleOnboardPopup(state, action: PayloadAction<boolean>) {
      state.value = action.payload;
    },
  },
});

export const { toggleOnboardPopup } = isOnboardingSlice.actions;
export default isOnboardingSlice.reducer;
