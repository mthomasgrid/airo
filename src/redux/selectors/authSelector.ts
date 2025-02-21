import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const authSelector = (state: RootState) => {
  return state.auth;
};

export const authUserSelector = createSelector(authSelector, (auth) => {
  return auth.user;
});

export const authErrorSelector = createSelector(authSelector, (auth) => {
  
  return auth.error;
});
