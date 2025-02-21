import { createSelector } from 'reselect';
import { RootState } from "../store";

const getIsOnboarding = (state: RootState) => state.isOnboardPopupShown;

export const isOnboardingSelector = createSelector(
          getIsOnboarding,
    (isOnboardPopupShown) => isOnboardPopupShown.value
);
