import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getPhotos: vi.fn(),
  getPhotosByUsername: vi.fn(),
}));

vi.mock("@/lib/photos", () => ({
  getPhotos: mocks.getPhotos,
  getPhotosByUsername: mocks.getPhotosByUsername,
}));

const { GET } = await import("./route");

const get = (query = "") => GET(new NextRequest(`http://localhost/api/photos${query}`));

afterEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/photos", () => {
  it("returns every photo when no user is named", async () => {
    mocks.getPhotos.mockResolvedValue([{ id: "photo-1" }]);

    const response = await get();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([{ id: "photo-1" }]);
    expect(mocks.getPhotosByUsername).not.toHaveBeenCalled();
  });

  it("returns only that user's photos when one is named", async () => {
    mocks.getPhotosByUsername.mockResolvedValue([{ id: "photo-2" }]);

    const response = await get("?username=someone@example.com");

    expect(response.status).toBe(200);
    expect(mocks.getPhotosByUsername).toHaveBeenCalledWith("someone@example.com");
    expect(mocks.getPhotos).not.toHaveBeenCalled();
  });

  it("reads a username that had to be escaped in the query string", async () => {
    mocks.getPhotosByUsername.mockResolvedValue([]);

    await get(`?username=${encodeURIComponent("a+b@example.com")}`);

    expect(mocks.getPhotosByUsername).toHaveBeenCalledWith("a+b@example.com");
  });

  it("treats an empty username as asking for everything", async () => {
    mocks.getPhotos.mockResolvedValue([]);

    await get("?username=");

    expect(mocks.getPhotos).toHaveBeenCalled();
    expect(mocks.getPhotosByUsername).not.toHaveBeenCalled();
  });

  it("reports a failure to read the photos", async () => {
    mocks.getPhotos.mockRejectedValue(new Error("database unreachable"));

    const response = await get();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "database unreachable" });
  });
});
