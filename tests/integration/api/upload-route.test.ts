import type { User } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase-server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/photos", () => ({
  insertPhoto: vi.fn(),
}));

import { POST } from "@/app/api/upload/route";
import { insertPhoto } from "@/lib/photos";
import { createClient } from "@/lib/supabase-server";

const mockCreateClient = vi.mocked(createClient);
const mockInsertPhoto = vi.mocked(insertPhoto);

const mockUser: Partial<User> = { id: "user-1", email: "test@example.com" };

const validBody = {
  username: "testuser",
  photoName: "My Photo",
  lat: 34.05,
  lng: -118.24,
  imageData: "data:image/jpeg;base64,ABC123",
  fileName: "photo.jpg",
};

const makeRequest = (body: unknown) =>
  new NextRequest("http://localhost/api/upload", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

const makeSupabaseClient = (overrides: Record<string, unknown> = {}) => ({
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
    ...((overrides.auth as object) ?? {}),
  },
  storage: {
    from: vi.fn().mockReturnValue({
      upload: vi.fn().mockResolvedValue({ error: null }),
      getPublicUrl: vi.fn().mockReturnValue({
        data: { publicUrl: "https://example.com/photos/photo.jpg" },
      }),
    }),
  },
  ...overrides,
});

describe("POST /api/upload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const inserted = { ...validBody, id: "new-id", url: "https://example.com/photos/photo.jpg", created_at: new Date().toISOString() };
    mockInsertPhoto.mockResolvedValue(inserted as never);
  });

  it("returns 503 when createClient returns null (Supabase not configured)", async () => {
    mockCreateClient.mockResolvedValue(null as never);
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toMatch(/not configured/i);
  });

  it("returns 401 when no authenticated user", async () => {
    const client = makeSupabaseClient({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    });
    mockCreateClient.mockResolvedValue(client as never);
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 400 when required fields are missing", async () => {
    mockCreateClient.mockResolvedValue(makeSupabaseClient() as never);
    const res = await POST(makeRequest({ username: "u" })); // missing most fields
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid request");
    expect(body.details).toBeDefined();
  });

  it("returns 400 when lat is out of range", async () => {
    mockCreateClient.mockResolvedValue(makeSupabaseClient() as never);
    const res = await POST(makeRequest({ ...validBody, lat: 91 }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when lng is out of range", async () => {
    mockCreateClient.mockResolvedValue(makeSupabaseClient() as never);
    const res = await POST(makeRequest({ ...validBody, lng: 181 }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when imageData does not start with data:image/", async () => {
    mockCreateClient.mockResolvedValue(makeSupabaseClient() as never);
    const res = await POST(makeRequest({ ...validBody, imageData: "notanimage" }));
    expect(res.status).toBe(400);
  });

  it("returns 500 when storage upload fails", async () => {
    const client = makeSupabaseClient();
    (client.storage.from as ReturnType<typeof vi.fn>).mockReturnValue({
      upload: vi.fn().mockResolvedValue({ error: new Error("Storage error") }),
      getPublicUrl: vi.fn(),
    });
    mockCreateClient.mockResolvedValue(client as never);
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
  });

  it("returns 200 with photo data on success", async () => {
    mockCreateClient.mockResolvedValue(makeSupabaseClient() as never);
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("username");
  });

  it("calls insertPhoto with correct photo shape", async () => {
    mockCreateClient.mockResolvedValue(makeSupabaseClient() as never);
    await POST(makeRequest(validBody));
    expect(mockInsertPhoto).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: mockUser.id,
        username: validBody.username,
        photo_name: validBody.photoName,
        lat: validBody.lat,
        lng: validBody.lng,
      }),
      expect.anything(),
    );
  });
});
