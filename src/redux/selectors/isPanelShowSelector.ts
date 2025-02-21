import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";



const isPanel = (state:RootState) => {
       return state.isPanelOpen;   
}

export const isPanelShowSelector= createSelector(isPanel,(isPanelShown) => isPanelShown.value);