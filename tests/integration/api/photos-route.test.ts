import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/photos", () => ({
  getPhotos: vi.fn(),
}));

import { GET } from "@/app/api/photos/route";
import { getPhotos } from "@/lib/photos";

const mockGetPhotos = vi.mocked(getPhotos);

const mockPhotos = [
  {
    id: "1",
    user_id: null,
    username: "testuser",
    photo_name: "Test Photo",
    lat: 34.05,
    lng: -118.24,
    url: "https://example.com/photo.jpg",
    created_at: new Date().toISOString(),
  },
];

describe("GET /api/photos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with photos array on success", async () => {
    mockGetPhotos.mockResolvedValue(mockPhotos);
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(mockPhotos);
  });

  it("returns 500 with error message when getPhotos throws an Error", async () => {
    mockGetPhotos.mockRejectedValue(new Error("DB connection failed"));
    const res = await GET();
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("DB connection failed");
  });

  it("returns 500 with generic message when getPhotos throws a non-Error", async () => {
    mockGetPhotos.mockRejectedValue("unexpected");
    const res = await GET();
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Failed to fetch photos");
  });
});
