import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UiState {
  focusedPhotoId: string | null;
  mobileTab: "map" | "feed";
  isUploadOpen: boolean;
  isAuthOpen: boolean;
}

const initialState: UiState = {
  focusedPhotoId: null,
  mobileTab: "map",
  isUploadOpen: false,
  isAuthOpen: false,
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
  },
});

export const { setFocusedPhoto, setMobileTab, setUploadOpen, setAuthOpen } =
  uiSlice.actions;
export default uiSlice.reducer;
