import { signIn, signOut } from "@/firebase/firebase.utils";
import { AuthUser } from "@/types/Types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: AuthUser = { user: undefined, error: null };

export const login = createAsyncThunk("login", () => signIn());

export const logout = createAsyncThunk("logout", () => signOut());


export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
      resetError(state){
          state.error = null
      }    
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.error = action.payload.error;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.error;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = undefined;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.error;
    });
  },
});
export const { resetError } = authSlice.actions;
export default authSlice.reducer;
