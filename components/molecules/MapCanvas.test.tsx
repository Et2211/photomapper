// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { averageCoordinate } from "@/lib/geo";
import type { Photo } from "@/types";

/**
 * Stands in for the real MapLibre map: records the camera props it is handed,
 * answers the zoom question with a known number, and reports itself loaded.
 */
const harness = vi.hoisted(() => ({
  cameraProps: null as Record<string, unknown> | null,
  boundsAskedFor: null as unknown,
  fittedZoomCalls: 0,
}));

vi.mock("maplibre-gl", () => ({ setWorkerUrl: () => undefined }));

vi.mock("react-map-gl/maplibre", async () => {
  const { createElement, forwardRef, useEffect, useImperativeHandle } = await import("react");

  const FakeMap = forwardRef(function FakeMap(
    props: Record<string, unknown> & { children?: unknown; onLoad?: () => void },
    ref
  ) {
    useEffect(() => {
      harness.cameraProps = props;
    });

    useImperativeHandle(
      ref,
      () => ({
        getContainer: () => ({ clientWidth: 800, clientHeight: 600 }),
        cameraForBounds: (bounds: unknown) => {
          harness.boundsAskedFor = bounds;
          harness.fittedZoomCalls += 1;
          return { zoom: FITTED_ZOOM };
        },
      }),
      []
    );

    useEffect(() => {
      props.onLoad?.();
    }, []);

    return createElement("div", null, props.children as never);
  });

  const passthrough = (props: { children?: unknown }) =>
    createElement("div", null, props.children as never);

  return { default: FakeMap, Marker: passthrough, Popup: passthrough };
});

const { default: MapCanvas } = await import("./MapCanvas");

/** Whatever MapLibre's own camera maths would answer; the value is arbitrary. */
const FITTED_ZOOM = 5;
/** Matches the constant in MapCanvas for a single photo with no spread to fit. */
const SINGLE_LOCATION_ZOOM = 14;

const photo = (id: string, lat: number, lng: number): Photo => ({
  id,
  user_id: null,
  username: "someone@example.com",
  photo_name: id,
  lat,
  lng,
  url: `https://example.com/${id}.jpg`,
  created_at: "2026-03-27T21:50:33.964441+00:00",
});

const BRISTOL = photo("bristol", 51.505375, -2.621922);
const DEVON = photo("devon", 50.627953, -3.310718);
const CROATIA = photo("croatia", 42.976739, 17.224572);

const currentCamera = () => {
  const props = harness.cameraProps!;
  return {
    lat: props.latitude as number,
    lng: props.longitude as number,
    zoom: props.zoom as number,
  };
};

const pan = (to: { lat: number; lng: number; zoom: number }) => {
  const onMove = harness.cameraProps!.onMove as (event: unknown) => void;
  act(() => {
    onMove({
      viewState: { latitude: to.lat, longitude: to.lng, zoom: to.zoom },
      originalEvent: new MouseEvent("mousedown"),
    });
  });
};

beforeEach(() => {
  harness.cameraProps = null;
  harness.boundsAskedFor = null;
  harness.fittedZoomCalls = 0;
});

afterEach(cleanup);

describe("MapCanvas opening view", () => {
  it("centres on the average position once the photos arrive", () => {
    const { rerender } = render(<MapCanvas photos={[]} />);
    const beforePhotos = currentCamera();

    rerender(<MapCanvas photos={[BRISTOL, DEVON, CROATIA]} />);

    const expected = averageCoordinate([BRISTOL, DEVON, CROATIA])!;
    expect(currentCamera().lat).toBeCloseTo(expected.lat, 9);
    expect(currentCamera().lng).toBeCloseTo(expected.lng, 9);
    expect(currentCamera().lat).not.toBeCloseTo(beforePhotos.lat, 3);
  });

  it("zooms out far enough to show the spread of the photos", () => {
    render(<MapCanvas photos={[BRISTOL, DEVON, CROATIA]} />);

    expect(currentCamera().zoom).toBe(FITTED_ZOOM);
    expect(harness.boundsAskedFor).not.toBeNull();
  });

  it("opens close in when every photo is in one place", () => {
    render(<MapCanvas photos={[BRISTOL]} />);

    expect(currentCamera().zoom).toBe(SINGLE_LOCATION_ZOOM);
    expect(harness.fittedZoomCalls).toBe(0);
  });

  it("stays put when the photos are fetched again", () => {
    const { rerender } = render(<MapCanvas photos={[BRISTOL, DEVON]} />);
    const opening = currentCamera();

    // A refetch hands over a new array, and a new photo lands in it.
    rerender(<MapCanvas photos={[BRISTOL, DEVON, CROATIA]} />);

    expect(currentCamera().lat).toBeCloseTo(opening.lat, 9);
    expect(currentCamera().lng).toBeCloseTo(opening.lng, 9);
  });

  it("does not pull the map back after someone has moved it", () => {
    const { rerender } = render(<MapCanvas photos={[]} />);

    pan({ lat: 10, lng: 20, zoom: 7 });
    rerender(<MapCanvas photos={[BRISTOL, DEVON, CROATIA]} />);

    expect(currentCamera()).toEqual({ lat: 10, lng: 20, zoom: 7 });
  });

  it("goes to a photo the user asked to see instead of the average", () => {
    const focusTarget = { lat: CROATIA.lat, lng: CROATIA.lng, zoom: 15, photo: CROATIA };

    render(
      <MapCanvas photos={[BRISTOL, DEVON, CROATIA]} focusTarget={focusTarget} onFocusConsumed={() => {}} />
    );

    expect(currentCamera()).toEqual({ lat: CROATIA.lat, lng: CROATIA.lng, zoom: 15 });
  });
});
