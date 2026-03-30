import { describe, expect, it } from "vitest";

import reducer, {
  setAuthOpen,
  setFocusedPhoto,
  setMobileTab,
  setUploadOpen,
} from "@/store/uiSlice";

describe("uiSlice", () => {
  describe("initial state", () => {
    it("has correct defaults", () => {
      const state = reducer(undefined, { type: "@@INIT" });
      expect(state.focusedPhotoId).toBeNull();
      expect(state.mobileTab).toBe("map");
      expect(state.isUploadOpen).toBe(false);
      expect(state.isAuthOpen).toBe(false);
    });
  });

  describe("setFocusedPhoto", () => {
    it("sets focusedPhotoId to a string", () => {
      const state = reducer(undefined, setFocusedPhoto("photo-123"));
      expect(state.focusedPhotoId).toBe("photo-123");
    });

    it("clears focusedPhotoId when null is passed", () => {
      const withFocus = reducer(undefined, setFocusedPhoto("photo-123"));
      const state = reducer(withFocus, setFocusedPhoto(null));
      expect(state.focusedPhotoId).toBeNull();
    });
  });

  describe("setMobileTab", () => {
    it("sets mobileTab to feed", () => {
      const state = reducer(undefined, setMobileTab("feed"));
      expect(state.mobileTab).toBe("feed");
    });

    it("sets mobileTab to map", () => {
      const withFeed = reducer(undefined, setMobileTab("feed"));
      const state = reducer(withFeed, setMobileTab("map"));
      expect(state.mobileTab).toBe("map");
    });
  });

  describe("setUploadOpen", () => {
    it("opens the upload modal", () => {
      const state = reducer(undefined, setUploadOpen(true));
      expect(state.isUploadOpen).toBe(true);
    });

    it("closes the upload modal", () => {
      const open = reducer(undefined, setUploadOpen(true));
      const state = reducer(open, setUploadOpen(false));
      expect(state.isUploadOpen).toBe(false);
    });
  });

  describe("setAuthOpen", () => {
    it("opens the auth modal", () => {
      const state = reducer(undefined, setAuthOpen(true));
      expect(state.isAuthOpen).toBe(true);
    });

    it("closes the auth modal", () => {
      const open = reducer(undefined, setAuthOpen(true));
      const state = reducer(open, setAuthOpen(false));
      expect(state.isAuthOpen).toBe(false);
    });
  });
});
