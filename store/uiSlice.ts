import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

type ProfileView = "list" | "grid" | "map";

interface UiState {
  focusedPhotoId: string | null;
  mobileTab: "map" | "feed";
  isUploadOpen: boolean;
  isAuthOpen: boolean;
  profileView: ProfileView;
}

const initialState: UiState = {
  focusedPhotoId: null,
  mobileTab: "map",
  isUploadOpen: false,
  isAuthOpen: false,
  profileView: "list",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setFocusedPhoto(state, action: PayloadAction<string | null>) {
      state.focusedPhotoId = action.payload;
    },
    setMobileTab(state, action: PayloadAction<"map" | "feed">) {
      state.mobileTab = action.payload;
    },
    setUploadOpen(state, action: PayloadAction<boolean>) {
      state.isUploadOpen = action.payload;
    },
    setAuthOpen(state, action: PayloadAction<boolean>) {
      state.isAuthOpen = action.payload;
    },
    setProfileView(state, action: PayloadAction<ProfileView>) {
      state.profileView = action.payload;
    },
  },
});

export const { setFocusedPhoto, setMobileTab, setUploadOpen, setAuthOpen, setProfileView } =
  uiSlice.actions;
export default uiSlice.reducer;
