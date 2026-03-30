import type { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getPhotos, insertPhoto } from "@/lib/photos";
import * as supabaseModule from "@/lib/supabase";
import { createMockSupabaseClient } from "@/tests/helpers/mockSupabase";
import type { Photo } from "@/types";

vi.mock("@/lib/supabase", () => ({
  isConfigured: false,
  supabase: null,
}));

const mockPhoto: Omit<Photo, "id" | "created_at"> = {
  user_id: "user-1",
  username: "testuser",
  photo_name: "Test",
  lat: 34.05,
  lng: -118.24,
  url: "https://example.com/photo.jpg",
};

describe("getPhotos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns MOCK_PHOTOS when Supabase is not configured", async () => {
    vi.mocked(supabaseModule).isConfigured = false;
    vi.mocked(supabaseModule).supabase = null as unknown as typeof supabaseModule.supabase;
    const result = await getPhotos();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("photo_name");
  });

  it("calls Supabase and returns data when configured", async () => {
    const mockClient = createMockSupabaseClient();
    const mockData = [{ ...mockPhoto, id: "1", created_at: new Date().toISOString() }];
    mockClient.from("photos").select("*").order("created_at", { ascending: false });
    // chain returns mockData
    const orderMock = vi.fn().mockResolvedValue({ data: mockData, error: null });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.mocked(supabaseModule).isConfigured = true;
    vi.mocked(supabaseModule).supabase = { from: fromMock } as unknown as typeof supabaseModule.supabase;

    const result = await getPhotos();
    expect(fromMock).toHaveBeenCalledWith("photos");
    expect(result).toEqual(mockData);
  });

  it("returns empty array when Supabase returns null data", async () => {
    const orderMock = vi.fn().mockResolvedValue({ data: null, error: null });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.mocked(supabaseModule).isConfigured = true;
    vi.mocked(supabaseModule).supabase = { from: fromMock } as unknown as typeof supabaseModule.supabase;

    const result = await getPhotos();
    expect(result).toEqual([]);
  });

  it("throws an Error when Supabase returns an error", async () => {
    const orderMock = vi.fn().mockResolvedValue({ data: null, error: { message: "DB error" } });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.mocked(supabaseModule).isConfigured = true;
    vi.mocked(supabaseModule).supabase = { from: fromMock } as unknown as typeof supabaseModule.supabase;

    await expect(getPhotos()).rejects.toThrow("DB error");
  });
});

describe("insertPhoto", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when Supabase is not configured", async () => {
    vi.mocked(supabaseModule).isConfigured = false;
    const mockClient = createMockSupabaseClient();
    await expect(
      insertPhoto(mockPhoto, mockClient as unknown as SupabaseClient),
    ).rejects.toThrow("Supabase is not configured");
  });

  it("inserts and returns the photo on success", async () => {
    vi.mocked(supabaseModule).isConfigured = true;
    const inserted = { ...mockPhoto, id: "new-id", created_at: new Date().toISOString() };
    const singleMock = vi.fn().mockResolvedValue({ data: inserted, error: null });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });
    const fromMock = vi.fn().mockReturnValue({ insert: insertMock });
    const fakeClient = { from: fromMock } as unknown as SupabaseClient;

    const result = await insertPhoto(mockPhoto, fakeClient);
    expect(fromMock).toHaveBeenCalledWith("photos");
    expect(insertMock).toHaveBeenCalledWith([mockPhoto]);
    expect(result).toEqual(inserted);
  });

  it("throws an Error when Supabase returns an error", async () => {
    vi.mocked(supabaseModule).isConfigured = true;
    const singleMock = vi.fn().mockResolvedValue({ data: null, error: { message: "Insert failed" } });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });
    const fromMock = vi.fn().mockReturnValue({ insert: insertMock });
    const fakeClient = { from: fromMock } as unknown as SupabaseClient;

    await expect(insertPhoto(mockPhoto, fakeClient)).rejects.toThrow("Insert failed");
  });
});
