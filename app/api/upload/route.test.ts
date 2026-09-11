import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  insertPhoto: vi.fn(),
  upload: vi.fn(),
}));

vi.mock("@/lib/supabase-server", () => ({ createClient: mocks.createClient }));
vi.mock("@/lib/photos", () => ({ insertPhoto: mocks.insertPhoto }));

const { POST } = await import("./route");

const USER = { id: "user-1", email: "owner@example.com" };
const PUBLIC_URL = "https://storage.example.com/object/public/photomapper/photos/1-a.jpg.jpg";

const pngData = (contents = "png-bytes") =>
  `data:image/png;base64,${Buffer.from(contents).toString("base64")}`;

const validBody = (overrides: Record<string, unknown> = {}) => ({
  username: USER.email,
  photoName: "Sunset",
  lat: 51.5,
  lng: -0.12,
  imageData: pngData(),
  fileName: "sunset.png",
  ...overrides,
});

const signedInAs = (user: typeof USER | null) => {
  mocks.createClient.mockResolvedValue({
    auth: { getUser: () => Promise.resolve({ data: { user } }) },
    storage: {
      from: () => ({
        upload: mocks.upload,
        getPublicUrl: () => ({ data: { publicUrl: PUBLIC_URL } }),
      }),
    },
  });
};

const post = (body: unknown) =>
  POST(
    new NextRequest("http://localhost/api/upload", {
      method: "POST",
      body: JSON.stringify(body),
    })
  );

/** The storage key the route asked for, e.g. "photos/1738-sunset.png.jpg". */
const storageKeyUsed = () => mocks.upload.mock.calls[0][0] as string;
const bytesUploaded = () => mocks.upload.mock.calls[0][1] as Buffer;

beforeEach(() => {
  mocks.upload.mockResolvedValue({ error: null });
  mocks.insertPhoto.mockImplementation((photo) =>
    Promise.resolve({ ...photo, id: "photo-1", created_at: "2026-03-27T21:50:33.964441+00:00" })
  );
  signedInAs(USER);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/upload", () => {
  it("says the service is unavailable when Supabase is not set up", async () => {
    mocks.createClient.mockResolvedValue(null);

    const response = await post(validBody());

    expect(response.status).toBe(503);
    expect(mocks.insertPhoto).not.toHaveBeenCalled();
  });

  it("turns away a request with no signed-in user", async () => {
    signedInAs(null);

    const response = await post(validBody());

    expect(response.status).toBe(401);
    expect(mocks.upload).not.toHaveBeenCalled();
    expect(mocks.insertPhoto).not.toHaveBeenCalled();
  });

  it.each([
    ["a latitude off the globe", { lat: 91 }],
    ["a longitude off the globe", { lng: -181 }],
    ["an empty photo name", { photoName: "" }],
    ["a photo name longer than the column allows", { photoName: "x".repeat(101) }],
    ["a payload that is not an image", { imageData: "data:text/html;base64,PHNjcmlwdD4=" }],
    ["a missing file name", { fileName: "" }],
  ])("rejects %s", async (_label, overrides) => {
    const response = await post(validBody(overrides));

    expect(response.status).toBe(400);
    expect(mocks.upload).not.toHaveBeenCalled();
    expect(mocks.insertPhoto).not.toHaveBeenCalled();
  });

  it("stores the photo under the signed-in user, not the name in the request", async () => {
    await post(validBody({ username: "someone.else@example.com" }));

    expect(mocks.insertPhoto).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: USER.id, username: USER.email })
    );
  });

  it("keeps a crafted file name inside the photos folder", async () => {
    await post(validBody({ fileName: "../../etc/passwd" }));

    const key = storageKeyUsed();
    expect(key.startsWith("photos/")).toBe(true);
    expect(key.slice("photos/".length)).not.toContain("/");
  });

  it("decodes the image before handing it to storage", async () => {
    await post(validBody({ imageData: pngData("hello") }));

    expect(bytesUploaded().equals(Buffer.from("hello"))).toBe(true);
  });

  it("records the photo at the position it was taken", async () => {
    await post(validBody({ lat: -33.87, lng: 151.21 }));

    expect(mocks.insertPhoto).toHaveBeenCalledWith(
      expect.objectContaining({ lat: -33.87, lng: 151.21, url: PUBLIC_URL })
    );
  });

  it("returns the saved photo", async () => {
    const response = await post(validBody());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      id: "photo-1",
      photo_name: "Sunset",
      url: PUBLIC_URL,
    });
  });

  it("reports a storage failure instead of saving a photo with no image", async () => {
    mocks.upload.mockResolvedValue({ error: new Error("bucket full") });

    const response = await post(validBody());

    expect(response.status).toBe(500);
    expect(mocks.insertPhoto).not.toHaveBeenCalled();
  });
});
