import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import PhotoMarker from "@/components/molecules/PhotoMarker";
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

describe("PhotoMarker", () => {
  it("renders inside a map marker container", () => {
    render(<PhotoMarker photo={mockPhoto} onClick={vi.fn()} />);
    expect(screen.getByTestId("map-marker")).toBeInTheDocument();
  });

  it("passes correct lat/lng to the Marker", () => {
    render(<PhotoMarker photo={mockPhoto} onClick={vi.fn()} />);
    const marker = screen.getByTestId("map-marker");
    expect(marker).toHaveAttribute("data-lat", "34.1184");
    expect(marker).toHaveAttribute("data-lng", "-118.3004");
  });

  it("renders the photo thumbnail with correct src and alt", () => {
    render(<PhotoMarker photo={mockPhoto} onClick={vi.fn()} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", mockPhoto.url);
    expect(img).toHaveAttribute("alt", mockPhoto.photo_name);
  });

  it("calls onClick when the marker is clicked", async () => {
    const onClick = vi.fn();
    render(<PhotoMarker photo={mockPhoto} onClick={onClick} />);
    await userEvent.click(screen.getByTestId("map-marker"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
