import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MapLayerMouseEvent } from "maplibre-gl";
import { Map as MockMap, Marker as MockMarker } from "react-map-gl/maplibre";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MapCanvas from "@/components/molecules/MapCanvas";
import type { Photo } from "@/types";

// These vi.mock calls activate the manual mocks in __mocks__/
vi.mock("react-map-gl/maplibre");
vi.mock("maplibre-gl");

const mockPhotos: Photo[] = [
  {
    id: "photo-1",
    user_id: null,
    username: "testuser",
    photo_name: "Test Photo",
    lat: 34.05,
    lng: -118.24,
    url: "https://example.com/photo.jpg",
    created_at: new Date().toISOString(),
  },
];

const getLastMapProps = () =>
  vi.mocked(MockMap).mock.calls[vi.mocked(MockMap).mock.calls.length - 1][0] as Record<string, unknown>;

describe("MapCanvas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the map", () => {
    render(<MapCanvas photos={[]} />);
    expect(screen.getByTestId("react-map")).toBeInTheDocument();
  });

  it("renders a PhotoMarker for each photo", () => {
    render(<MapCanvas photos={mockPhotos} />);
    expect(screen.getAllByTestId("map-marker").length).toBeGreaterThan(0);
  });

  it("renders a picked location marker when pickedLocation is set", () => {
    render(<MapCanvas photos={[]} pickedLocation={{ lat: 34.05, lng: -118.24 }} />);
    // pickedLocation marker is rendered as a Marker
    expect(vi.mocked(MockMarker)).toHaveBeenCalled();
  });

  it("calls onLocationPick when map is clicked in picking mode", () => {
    const onLocationPick = vi.fn();
    render(<MapCanvas photos={[]} pickingLocation onLocationPick={onLocationPick} />);

    const props = getLastMapProps();
    const fakeEvent = { lngLat: { lat: 34.05, lng: -118.24 } } as unknown as MapLayerMouseEvent;
    (props.onClick as (e: MapLayerMouseEvent) => void)(fakeEvent);

    expect(onLocationPick).toHaveBeenCalledWith(34.05, -118.24);
  });

  it("does not call onLocationPick when not in picking mode", () => {
    const onLocationPick = vi.fn();
    render(<MapCanvas photos={[]} pickingLocation={false} onLocationPick={onLocationPick} />);

    const props = getLastMapProps();
    const fakeEvent = { lngLat: { lat: 34.05, lng: -118.24 } } as unknown as MapLayerMouseEvent;
    (props.onClick as (e: MapLayerMouseEvent) => void)(fakeEvent);

    expect(onLocationPick).not.toHaveBeenCalled();
  });

  it("calls onFocusConsumed when focusTarget is set", () => {
    const onFocusConsumed = vi.fn();
    render(
      <MapCanvas
        photos={[]}
        focusTarget={{ lat: 34.05, lng: -118.24, zoom: 13 }}
        onFocusConsumed={onFocusConsumed}
      />,
    );
    expect(onFocusConsumed).toHaveBeenCalledTimes(1);
  });

  it("does not call onFocusConsumed when focusTarget is null", () => {
    const onFocusConsumed = vi.fn();
    render(<MapCanvas photos={[]} focusTarget={null} onFocusConsumed={onFocusConsumed} />);
    expect(onFocusConsumed).not.toHaveBeenCalled();
  });

  it("shows popup when a photo marker is clicked", async () => {
    render(<MapCanvas photos={mockPhotos} />);
    // Click the marker rendered in the mock
    const markerEl = screen.getByTestId("map-marker");
    await userEvent.click(markerEl);
    // After clicking a marker, the popup should appear
    expect(await screen.findByTestId("map-popup")).toBeInTheDocument();
  });

  it("closes popup when popup onClose is called", async () => {
    render(<MapCanvas photos={mockPhotos} />);
    const markerEl = screen.getByTestId("map-marker");
    await userEvent.click(markerEl);
    // Click the "Close popup" button from the Popup mock
    await userEvent.click(await screen.findByText("Close popup"));
    expect(screen.queryByTestId("map-popup")).not.toBeInTheDocument();
  });
});
