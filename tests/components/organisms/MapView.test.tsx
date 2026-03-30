import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/store/photosApi", () => ({
  useGetPhotosQuery: vi.fn(),
  useUploadPhotoMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
  photosApi: {
    reducerPath: "photosApi",
    reducer: () => ({}),
    middleware: () => (next: (action: unknown) => unknown) => (action: unknown) => next(action),
  },
}));

vi.mock("@/components/molecules/MapCanvas", () => ({
  default: vi.fn(
    ({
      focusTarget,
      onFocusConsumed,
    }: {
      focusTarget: unknown;
      onFocusConsumed?: () => void;
    }) => (
      <div
        data-testid="map-canvas"
        data-focus-lat={focusTarget ? (focusTarget as { lat: number }).lat : ""}
        data-focus-lng={focusTarget ? (focusTarget as { lng: number }).lng : ""}
      >
        <button onClick={onFocusConsumed}>consume focus</button>
      </div>
    ),
  ),
}));

import MapCanvas from "@/components/molecules/MapCanvas";
import MapView from "@/components/organisms/MapView";
import { useGetPhotosQuery } from "@/store/photosApi";
import { renderWithProviders } from "@/tests/helpers/renderWithProviders";
import { mockPhotos } from "@/tests/mocks/handlers";

const MockMapCanvas = vi.mocked(MapCanvas);
const mockUseGetPhotosQuery = vi.mocked(useGetPhotosQuery);

beforeEach(() => {
  mockUseGetPhotosQuery.mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
  } as unknown as ReturnType<typeof useGetPhotosQuery>);
});

afterEach(() => {
  vi.clearAllMocks();
});

// Geolocation mock lives in tests/setup.ts; get a reference to it
const mockGetCurrentPosition = vi.mocked(navigator.geolocation.getCurrentPosition);

describe("MapView", () => {
  it("calls navigator.geolocation.getCurrentPosition on mount", () => {
    renderWithProviders(<MapView />);
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1);
  });

  it("passes geo coordinates to MapCanvas as focusTarget when geolocation succeeds", async () => {
    mockGetCurrentPosition.mockImplementationOnce((successCb) => {
      successCb({
        coords: { latitude: 51.5, longitude: -0.12, accuracy: 10 },
      } as GeolocationPosition);
    });

    renderWithProviders(<MapView />);

    await waitFor(() => {
      const calls = MockMapCanvas.mock.calls;
      const lastProps = calls[calls.length - 1][0];
      expect(lastProps.focusTarget).toMatchObject({ lat: 51.5, lng: -0.12, zoom: 12 });
    });
  });

  it("falls back to photoCenter when geolocation is denied and photos are available", async () => {
    mockUseGetPhotosQuery.mockReturnValue({
      data: mockPhotos,
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useGetPhotosQuery>);

    // Simulate geolocation denied
    mockGetCurrentPosition.mockImplementationOnce((_success, errorCb) => {
      errorCb?.({ code: 1, message: "denied" } as GeolocationPositionError);
    });

    renderWithProviders(<MapView />);

    // Wait for fallback to kick in
    await waitFor(() => {
      const calls = MockMapCanvas.mock.calls;
      const lastProps = calls[calls.length - 1][0];
      expect(lastProps.focusTarget).not.toBeNull();
      expect(lastProps.focusTarget).toHaveProperty("lat");
      expect(lastProps.focusTarget).toHaveProperty("lng");
      expect(lastProps.focusTarget).toHaveProperty("zoom");
    });
  });

  it("dispatches setFocusedPhoto(null) when onFocusConsumed is called", async () => {
    mockGetCurrentPosition.mockImplementationOnce(() => {
      // never resolves — keep geoFocusTarget null
    });

    const { store } = renderWithProviders(<MapView />, {
      preloadedState: {
        ui: {
          focusedPhotoId: "photo-1",
          mobileTab: "map",
          isUploadOpen: false,
          isAuthOpen: false,
        },
      },
    });

    // Wait for MapCanvas to render
    await waitFor(() => expect(screen.getByTestId("map-canvas")).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: "consume focus" }));

    expect(store.getState().ui.focusedPhotoId).toBeNull();
  });

  it("shows no errors on mount with empty photos list", async () => {
    mockGetCurrentPosition.mockImplementationOnce(() => {});
    // Should render without throwing
    renderWithProviders(<MapView />);
    await waitFor(() => expect(MockMapCanvas).toHaveBeenCalled());
  });
});
