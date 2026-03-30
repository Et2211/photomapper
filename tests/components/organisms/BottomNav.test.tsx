import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import BottomNav from "@/components/organisms/BottomNav";
import { renderWithProviders } from "@/tests/helpers/renderWithProviders";

describe("BottomNav", () => {
  it("renders Map and Feed tabs", () => {
    renderWithProviders(<BottomNav />);
    expect(screen.getByText("Map")).toBeInTheDocument();
    expect(screen.getByText("Feed")).toBeInTheDocument();
  });

  it("Map tab has active styling when mobileTab is 'map'", () => {
    renderWithProviders(<BottomNav />, { preloadedState: { ui: { mobileTab: "map", focusedPhotoId: null, isUploadOpen: false, isAuthOpen: false } } });
    const mapButton = screen.getByRole("button", { name: /map/i });
    expect(mapButton).toHaveClass("text-blue-400");
  });

  it("Feed tab has active styling when mobileTab is 'feed'", () => {
    renderWithProviders(<BottomNav />, { preloadedState: { ui: { mobileTab: "feed", focusedPhotoId: null, isUploadOpen: false, isAuthOpen: false } } });
    const feedButton = screen.getByRole("button", { name: /feed/i });
    expect(feedButton).toHaveClass("text-blue-400");
  });

  it("clicking Map tab dispatches setMobileTab('map')", async () => {
    const { store } = renderWithProviders(<BottomNav />, { preloadedState: { ui: { mobileTab: "feed", focusedPhotoId: null, isUploadOpen: false, isAuthOpen: false } } });
    await userEvent.click(screen.getByRole("button", { name: /map/i }));
    expect(store.getState().ui.mobileTab).toBe("map");
  });

  it("clicking Feed tab dispatches setMobileTab('feed')", async () => {
    const { store } = renderWithProviders(<BottomNav />);
    await userEvent.click(screen.getByRole("button", { name: /feed/i }));
    expect(store.getState().ui.mobileTab).toBe("feed");
  });
});
