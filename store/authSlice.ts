import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  displayName: string | null;
  avatarUrl: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  displayName: null,
  avatarUrl: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isLoading = false;
      if (!action.payload) {
        state.displayName = null;
        state.avatarUrl = null;
      }
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setProfile(state, action: PayloadAction<{ displayName: string | null; avatarUrl: string | null }>) {
      state.displayName = action.payload.displayName;
      state.avatarUrl = action.payload.avatarUrl;
    },
  },
});

export const { setUser, setAuthLoading, setProfile } = authSlice.actions;
export default authSlice.reducer;
