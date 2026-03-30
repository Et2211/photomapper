import { describe, expect, it } from "vitest";

import { photoCenter } from "@/lib/mapUtils";
import type { Photo } from "@/types";

const makePhoto = (id: string, lat: number, lng: number): Photo => ({
  id,
  user_id: null,
  username: "user",
  photo_name: "Photo",
  lat,
  lng,
  url: "https://example.com/photo.jpg",
  created_at: new Date().toISOString(),
});

describe("photoCenter", () => {
  it("returns null for an empty array", () => {
    expect(photoCenter([])).toBeNull();
  });

  it("returns zoom 13 when all photos are at the same point", () => {
    const photos = [makePhoto("1", 34.05, -118.24)];
    const result = photoCenter(photos);
    expect(result?.zoom).toBe(13);
    expect(result?.lat).toBe(34.05);
    expect(result?.lng).toBe(-118.24);
  });

  it("returns the midpoint lat/lng of the bounding box", () => {
    const photos = [
      makePhoto("1", 30, -120),
      makePhoto("2", 40, -110),
    ];
    const result = photoCenter(photos);
    expect(result?.lat).toBe(35);
    expect(result?.lng).toBe(-115);
  });

  it("uses only the last 5 photos", () => {
    const photos = [
      makePhoto("old", 90, 0),   // should be excluded
      makePhoto("1", 10, 10),
      makePhoto("2", 10, 10),
      makePhoto("3", 10, 10),
      makePhoto("4", 10, 10),
      makePhoto("5", 10, 10),
    ];
    const result = photoCenter(photos);
    // If "old" were included, lat would be much higher
    expect(result?.lat).toBe(10);
  });

  it("returns lower zoom for widely spaced photos", () => {
    const tightPhotos = [makePhoto("1", 34, -118), makePhoto("2", 34.01, -118.01)];
    const widePhotos = [makePhoto("1", 0, -90), makePhoto("2", 60, 90)];
    const tight = photoCenter(tightPhotos);
    const wide = photoCenter(widePhotos);
    expect(tight!.zoom).toBeGreaterThan(wide!.zoom);
  });

  it("clamps zoom to minimum 2", () => {
    // span of 180 degrees -> log2(180/180) = 0, clamped to 2
    const photos = [makePhoto("1", -89, -179), makePhoto("2", 89, 179)];
    const result = photoCenter(photos);
    expect(result?.zoom).toBe(2);
  });

  it("clamps zoom to maximum 13", () => {
    // Very small span -> very high zoom, clamped to 13
    const photos = [makePhoto("1", 34.0, -118.0), makePhoto("2", 34.00001, -118.00001)];
    const result = photoCenter(photos);
    expect(result?.zoom).toBe(13);
  });
});
