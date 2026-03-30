import exifr from "exifr";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { extractGpsFromFile } from "@/lib/exif";

vi.mock("exifr", () => ({
  default: { gps: vi.fn() },
}));

const mockGps = vi.mocked(exifr.gps);
const mockFile = new File([""], "photo.jpg", { type: "image/jpeg" });

describe("extractGpsFromFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns { lat, lng } when GPS data is present", async () => {
    mockGps.mockResolvedValue({ latitude: 34.05, longitude: -118.24 });
    const result = await extractGpsFromFile(mockFile);
    expect(result).toEqual({ lat: 34.05, lng: -118.24 });
  });

  it("calls exifr.gps with the provided file", async () => {
    mockGps.mockResolvedValue({ latitude: 1, longitude: 2 });
    await extractGpsFromFile(mockFile);
    expect(mockGps).toHaveBeenCalledWith(mockFile);
  });

  it("returns null when latitude is missing", async () => {
    mockGps.mockResolvedValue({ latitude: undefined, longitude: -118.24 } as never);
    const result = await extractGpsFromFile(mockFile);
    expect(result).toBeNull();
  });

  it("returns null when longitude is missing", async () => {
    mockGps.mockResolvedValue({ latitude: 34.05, longitude: undefined } as never);
    const result = await extractGpsFromFile(mockFile);
    expect(result).toBeNull();
  });

  it("returns null when gps resolves to null", async () => {
    mockGps.mockResolvedValue(null as never);
    const result = await extractGpsFromFile(mockFile);
    expect(result).toBeNull();
  });

  it("returns null (does not throw) when exifr.gps rejects", async () => {
    mockGps.mockRejectedValue(new Error("EXIF parse error"));
    const result = await extractGpsFromFile(mockFile);
    expect(result).toBeNull();
  });
});
