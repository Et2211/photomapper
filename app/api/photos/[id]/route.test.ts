import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  updatePhotoName: vi.fn(),
  deletePhotoById: vi.fn(),
}));

vi.mock("@/lib/supabase-server", () => ({ createClient: mocks.createClient }));
vi.mock("@/lib/photos", () => ({
  updatePhotoName: mocks.updatePhotoName,
  deletePhotoById: mocks.deletePhotoById,
}));

const { DELETE, PATCH } = await import("./route");

const OWNER = "owner-user-id";
const SOMEONE_ELSE = "other-user-id";
const PHOTO_ID = "photo-1";

/**
 * Stands in for the session-bound Supabase client: reports who is signed in and
 * who owns the photo being asked about.
 */
const signedInAs = (userId: string | null, owner: { user_id: string | null } | null = { user_id: OWNER }) => {
  mocks.createClient.mockResolvedValue({
    auth: { getUser: () => Promise.resolve({ data: { user: userId ? { id: userId } : null } }) },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve(
              owner ? { data: owner, error: null } : { data: null, error: { message: "No rows" } }
            ),
        }),
      }),
    }),
  });
};

const params = Promise.resolve({ id: PHOTO_ID });

const patchRequest = (body: unknown) =>
  new NextRequest(`http://localhost/api/photos/${PHOTO_ID}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

const deleteRequest = () =>
  new NextRequest(`http://localhost/api/photos/${PHOTO_ID}`, { method: "DELETE" });

beforeEach(() => {
  mocks.updatePhotoName.mockResolvedValue({ id: PHOTO_ID, photo_name: "Renamed" });
  mocks.deletePhotoById.mockResolvedValue(undefined);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("PATCH /api/photos/[id]", () => {
  it("turns away a request with no signed-in user", async () => {
    signedInAs(null);

    const response = await PATCH(patchRequest({ photoName: "Renamed" }), { params });

    expect(response.status).toBe(401);
    expect(mocks.updatePhotoName).not.toHaveBeenCalled();
  });

  it("refuses to rename a photo belonging to someone else", async () => {
    signedInAs(SOMEONE_ELSE, { user_id: OWNER });

    const response = await PATCH(patchRequest({ photoName: "Renamed" }), { params });

    expect(response.status).toBe(403);
    expect(mocks.updatePhotoName).not.toHaveBeenCalled();
  });

  it("refuses to rename a photo whose owner has been removed", async () => {
    signedInAs(SOMEONE_ELSE, { user_id: null });

    const response = await PATCH(patchRequest({ photoName: "Renamed" }), { params });

    expect(response.status).toBe(403);
    expect(mocks.updatePhotoName).not.toHaveBeenCalled();
  });

  it("reports a photo that does not exist", async () => {
    signedInAs(OWNER, null);

    const response = await PATCH(patchRequest({ photoName: "Renamed" }), { params });

    expect(response.status).toBe(404);
    expect(mocks.updatePhotoName).not.toHaveBeenCalled();
  });

  it("renames the owner's own photo", async () => {
    signedInAs(OWNER);

    const response = await PATCH(patchRequest({ photoName: "Renamed" }), { params });

    expect(response.status).toBe(200);
    expect(mocks.updatePhotoName).toHaveBeenCalledWith(PHOTO_ID, "Renamed");
  });

  it("rejects an empty name", async () => {
    signedInAs(OWNER);

    const response = await PATCH(patchRequest({ photoName: "" }), { params });

    expect(response.status).toBe(400);
    expect(mocks.updatePhotoName).not.toHaveBeenCalled();
  });

  it("rejects a name longer than the column allows", async () => {
    signedInAs(OWNER);

    const response = await PATCH(patchRequest({ photoName: "x".repeat(101) }), { params });

    expect(response.status).toBe(400);
    expect(mocks.updatePhotoName).not.toHaveBeenCalled();
  });

  it("reports a failure from the database without leaking a stack", async () => {
    signedInAs(OWNER);
    mocks.updatePhotoName.mockRejectedValue(new Error("connection reset"));

    const response = await PATCH(patchRequest({ photoName: "Renamed" }), { params });

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "connection reset" });
  });
});

describe("DELETE /api/photos/[id]", () => {
  it("turns away a request with no signed-in user", async () => {
    signedInAs(null);

    const response = await DELETE(deleteRequest(), { params });

    expect(response.status).toBe(401);
    expect(mocks.deletePhotoById).not.toHaveBeenCalled();
  });

  it("refuses to delete a photo belonging to someone else", async () => {
    signedInAs(SOMEONE_ELSE, { user_id: OWNER });

    const response = await DELETE(deleteRequest(), { params });

    expect(response.status).toBe(403);
    expect(mocks.deletePhotoById).not.toHaveBeenCalled();
  });

  it("reports a photo that does not exist", async () => {
    signedInAs(OWNER, null);

    const response = await DELETE(deleteRequest(), { params });

    expect(response.status).toBe(404);
    expect(mocks.deletePhotoById).not.toHaveBeenCalled();
  });

  it("deletes the owner's own photo", async () => {
    signedInAs(OWNER);

    const response = await DELETE(deleteRequest(), { params });

    expect(response.status).toBe(200);
    expect(mocks.deletePhotoById).toHaveBeenCalledWith(PHOTO_ID);
  });

  it("reports a failure from the database", async () => {
    signedInAs(OWNER);
    mocks.deletePhotoById.mockRejectedValue(new Error("storage unavailable"));

    const response = await DELETE(deleteRequest(), { params });

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "storage unavailable" });
  });
});
