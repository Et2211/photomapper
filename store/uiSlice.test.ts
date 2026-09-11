import { describe, expect, it } from "vitest";

import reducer, {
  setAuthOpen,
  setFocusedPhoto,
  setMobileTab,
  setProfileView,
  setUploadOpen,
} from "./uiSlice";

const initial = () => reducer(undefined, { type: "@@INIT" });

describe("uiSlice", () => {
  it("opens on the map with nothing focused and no dialogs", () => {
    expect(initial()).toEqual({
      focusedPhotoId: null,
      mobileTab: "map",
      isUploadOpen: false,
      isAuthOpen: false,
      profileView: "list",
    });
  });

  it("focuses a photo and lets go of it again", () => {
    const focused = reducer(initial(), setFocusedPhoto("photo-1"));
    expect(focused.focusedPhotoId).toBe("photo-1");

    // The map clears the focus once it has moved, so null has to be accepted.
    expect(reducer(focused, setFocusedPhoto(null)).focusedPhotoId).toBeNull();
  });

  it("switches between the map and the feed on a phone", () => {
    const onFeed = reducer(initial(), setMobileTab("feed"));

    expect(onFeed.mobileTab).toBe("feed");
    expect(reducer(onFeed, setMobileTab("map")).mobileTab).toBe("map");
  });

  it("remembers which profile view was chosen", () => {
    const asGrid = reducer(initial(), setProfileView("grid"));

    expect(asGrid.profileView).toBe("grid");
    expect(reducer(asGrid, setProfileView("map")).profileView).toBe("map");
  });

  it("opens and closes each dialog on its own", () => {
    const uploading = reducer(initial(), setUploadOpen(true));

    expect(uploading).toMatchObject({ isUploadOpen: true, isAuthOpen: false });
    expect(reducer(uploading, setAuthOpen(true))).toMatchObject({
      isUploadOpen: true,
      isAuthOpen: true,
    });
  });

  it("leaves the rest of the state alone when one thing changes", () => {
    const busy = reducer(reducer(initial(), setMobileTab("feed")), setProfileView("grid"));
    const after = reducer(busy, setUploadOpen(true));

    expect(after.mobileTab).toBe("feed");
    expect(after.profileView).toBe("grid");
  });
});
