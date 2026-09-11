import { describe, expect, it } from "vitest";

import { averageCoordinate, boundsAround } from "./geo";

const BRISTOL = { lat: 51.505375, lng: -2.621922 };
const DEVON = { lat: 50.627953, lng: -3.310718 };
const CROATIA = { lat: 42.976739, lng: 17.224572 };

describe("averageCoordinate", () => {
  it("has no answer for no photos", () => {
    expect(averageCoordinate([])).toBeNull();
  });

  it("returns the only photo's own position", () => {
    expect(averageCoordinate([BRISTOL])).toEqual(BRISTOL);
  });

  it("lands between two photos", () => {
    const centre = averageCoordinate([BRISTOL, DEVON]);

    expect(centre!.lat).toBeGreaterThan(DEVON.lat);
    expect(centre!.lat).toBeLessThan(BRISTOL.lat);
    expect(centre!.lng).toBeGreaterThan(DEVON.lng);
    expect(centre!.lng).toBeLessThan(BRISTOL.lng);
  });

  it("does not depend on the order photos arrive in", () => {
    const forwards = averageCoordinate([BRISTOL, DEVON, CROATIA])!;
    const backwards = averageCoordinate([CROATIA, DEVON, BRISTOL])!;

    expect(forwards.lat).toBeCloseTo(backwards.lat, 9);
    expect(forwards.lng).toBeCloseTo(backwards.lng, 9);
  });

  it("treats photos with the same position as one place", () => {
    const centre = averageCoordinate([BRISTOL, { ...BRISTOL }, { ...BRISTOL }])!;

    expect(centre.lat).toBeCloseTo(BRISTOL.lat, 9);
    expect(centre.lng).toBeCloseTo(BRISTOL.lng, 9);
  });

  // The reason for averaging on the sphere rather than averaging the numbers:
  // a plain mean of -179 and 179 is 0, which is the far side of the planet.
  it("averages across the antimeridian instead of jumping to the far side", () => {
    const centre = averageCoordinate([
      { lat: 0, lng: 179 },
      { lat: 0, lng: -179 },
    ])!;

    expect(centre.lat).toBeCloseTo(0, 6);
    expect(Math.abs(centre.lng)).toBeCloseTo(180, 6);
  });

  it("falls back to a real photo when positions cancel out", () => {
    const centre = averageCoordinate([
      { lat: 0, lng: 0 },
      { lat: 0, lng: 90 },
      { lat: 0, lng: 180 },
      { lat: 0, lng: -90 },
    ])!;

    expect(centre).toEqual({ lat: 0, lng: 0 });
  });
});

describe("boundsAround", () => {
  // The box is the tightest one that fits, so the outermost photos land exactly
  // on an edge and rounding can put them a fraction outside it. The tolerance is
  // about five nanometres of ground distance.
  const EDGE_TOLERANCE = 1e-9;

  const contains = (
    bounds: [[number, number], [number, number]],
    point: { lat: number; lng: number }
  ) => {
    const [[west, south], [east, north]] = bounds;
    return (
      point.lat >= south - EDGE_TOLERANCE &&
      point.lat <= north + EDGE_TOLERANCE &&
      point.lng >= west - EDGE_TOLERANCE &&
      point.lng <= east + EDGE_TOLERANCE
    );
  };

  it("has no box when every photo is in the same spot", () => {
    expect(boundsAround(BRISTOL, [BRISTOL, { ...BRISTOL }])).toBeNull();
  });

  it("contains every photo", () => {
    const photos = [BRISTOL, DEVON, CROATIA];
    const bounds = boundsAround(averageCoordinate(photos)!, photos)!;

    for (const photo of photos) {
      expect(contains(bounds, photo)).toBe(true);
    }
  });

  it("stays centred on the average so the map does not drift off it", () => {
    const photos = [BRISTOL, DEVON, CROATIA];
    const centre = averageCoordinate(photos)!;
    const [[west, south], [east, north]] = boundsAround(centre, photos)!;

    expect((south + north) / 2).toBeCloseTo(centre.lat, 9);
    expect((west + east) / 2).toBeCloseTo(centre.lng, 9);
  });

  it("grows to the furthest photo on either side", () => {
    // The near photo sits 1 degree east of centre, the far one 5 degrees west,
    // so a box centred on 0 has to reach 5 degrees both ways.
    const centre = { lat: 0, lng: 0 };
    const bounds = boundsAround(centre, [
      { lat: 0, lng: 1 },
      { lat: 0, lng: -5 },
    ])!;

    expect(bounds[0][0]).toBeCloseTo(-5, 9);
    expect(bounds[1][0]).toBeCloseTo(5, 9);
  });

  it("measures width the short way round the antimeridian", () => {
    const photos = [
      { lat: 0, lng: 179 },
      { lat: 0, lng: -179 },
    ];
    const [[west, south], [east, north]] = boundsAround({ lat: 0, lng: 180 }, photos)!;

    // Two degrees wide, not the 358 a plain subtraction would give.
    expect(east - west).toBeCloseTo(2, 6);
    expect(north - south).toBeCloseTo(0, 6);
  });

  it("never asks for more than the whole world", () => {
    const photos = [
      { lat: -33.9, lng: 151.2 },
      { lat: 64.1, lng: -21.9 },
      { lat: -23.5, lng: -46.6 },
    ];
    const [[west], [east]] = boundsAround(averageCoordinate(photos)!, photos)!;

    expect(east - west).toBeLessThanOrEqual(360);
  });

  it("stops at the edge of the projection near the poles", () => {
    const photos = [
      { lat: 84, lng: 0 },
      { lat: 60, lng: 0 },
    ];
    const [[, south], [, north]] = boundsAround({ lat: 72, lng: 0 }, photos)!;

    expect(north).toBeLessThanOrEqual(85);
    expect(south).toBeGreaterThanOrEqual(-85);
  });
});
