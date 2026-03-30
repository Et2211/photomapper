import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import PhotoCard from "@/components/molecules/PhotoCard";
import { renderWithProviders } from "@/tests/helpers/renderWithProviders";
import type { Photo } from "@/types";

const mockPhoto: Photo = {
  id: "photo-1",
  user_id: "user-1",
  username: "testuser",
  photo_name: "Griffith Observatory",
  lat: 34.1184,
  lng: -118.3004,
  url: "https://picsum.photos/seed/test/400/400",
  created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
};

describe("PhotoCard", () => {
  it("renders the photo name", () => {
    renderWithProviders(<PhotoCard photo={mockPhoto} />);
    expect(screen.getByText("Griffith Observatory")).toBeInTheDocument();
  });

  it("renders @username", () => {
    renderWithProviders(<PhotoCard photo={mockPhoto} />);
    expect(screen.getByText("@testuser")).toBeInTheDocument();
  });

  it("renders the photo image with correct src and alt", () => {
    renderWithProviders(<PhotoCard photo={mockPhoto} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", mockPhoto.url);
    expect(img).toHaveAttribute("alt", mockPhoto.photo_name);
  });

  it("renders a 'Show on map' button", () => {
    renderWithProviders(<PhotoCard photo={mockPhoto} />);
    expect(screen.getByRole("button", { name: /show on map/i })).toBeInTheDocument();
  });

  it("dispatches setFocusedPhoto and setMobileTab when 'Show on map' is clicked", async () => {
    const { store } = renderWithProviders(<PhotoCard photo={mockPhoto} />);
    await userEvent.click(screen.getByRole("button", { name: /show on map/i }));
    const state = store.getState();
    expect(state.ui.focusedPhotoId).toBe("photo-1");
    expect(state.ui.mobileTab).toBe("map");
  });

  it("displays a relative timestamp", () => {
    renderWithProviders(<PhotoCard photo={mockPhoto} />);
    expect(screen.getByText(/ago/)).toBeInTheDocument();
  });
});
