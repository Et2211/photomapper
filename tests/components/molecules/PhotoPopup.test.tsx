import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import PhotoPopup from "@/components/molecules/PhotoPopup";
import type { Photo } from "@/types";

vi.mock("react-map-gl/maplibre");
vi.mock("maplibre-gl");

const mockPhoto: Photo = {
  id: "photo-1",
  user_id: "user-1",
  username: "testuser",
  photo_name: "Griffith Observatory",
  lat: 34.1184,
  lng: -118.3004,
  url: "https://example.com/photo.jpg",
  created_at: new Date().toISOString(),
};

describe("PhotoPopup", () => {
  it("renders inside a popup container", () => {
    render(<PhotoPopup photo={mockPhoto} onClose={vi.fn()} />);
    expect(screen.getByTestId("map-popup")).toBeInTheDocument();
  });

  it("renders photo name and username", () => {
    render(<PhotoPopup photo={mockPhoto} onClose={vi.fn()} />);
    expect(screen.getByText("Griffith Observatory")).toBeInTheDocument();
    expect(screen.getByText("@testuser")).toBeInTheDocument();
  });

  it("shows skeleton while image has not loaded", () => {
    const { container } = render(<PhotoPopup photo={mockPhoto} onClose={vi.fn()} />);
    // Skeleton has animate-pulse class; image should be hidden before load
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    const img = screen.getByRole("img");
    expect(img).toHaveClass("hidden");
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    render(<PhotoPopup photo={mockPhoto} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: /close popup/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
