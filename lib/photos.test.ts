import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `lib/photos` reads its client once at import, so the stub is swapped through
 * a live binding rather than by re-importing the module for every case.
 */
const harness = vi.hoisted(() => ({
  isConfigured: true,
  client: null as Record<string, unknown> | null,
}));

vi.mock("./supabase", () => ({
  get isConfigured() {
    return harness.isConfigured;
  },
  get supabase() {
    return harness.client;
  },
}));

const {
  deletePhotoById,
  getPhotos,
  getPhotosByUsername,
  insertPhoto,
  updatePhotoName,
} = await import("./photos");

const succeeds = (data: unknown) => ({ data, error: null });
const fails = (message: string) => ({ data: null, error: { message } });

/** Client for the two read paths: with and without a username filter. */
const readingClient = (result: { data: unknown; error: unknown }) => ({
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      order: vi.fn(() => Promise.resolve(result)),
      eq: vi.fn(() => ({ order: vi.fn(() => Promise.resolve(result)) })),
    })),
  })),
});

const NEW_PHOTO = {
  user_id: "user-1",
  username: "owner@example.com",
  photo_name: "Sunset",
  lat: 51.5,
  lng: -0.12,
  url: "https://storage.example.com/object/public/photomapper/photos/1-a.jpg",
};

beforeEach(() => {
  harness.isConfigured = true;
  harness.client = null;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("with no Supabase project configured", () => {
  beforeEach(() => {
    harness.isConfigured = false;
    harness.client = null;
  });

  it("shows sample photos so the map is not empty", async () => {
    const photos = await getPhotos();

    expect(photos.length).toBeGreaterThan(0);
    expect(photos.every((photo) => photo.lat >= -90 && photo.lat <= 90)).toBe(true);
  });

  it("filters the sample photos by username", async () => {
    const photos = await getPhotosByUsername("demo_user");

    expect(photos).not.toHaveLength(0);
    expect(photos.every((photo) => photo.username === "demo_user")).toBe(true);
  });

  it("has no sample photos for an unknown username", async () => {
    await expect(getPhotosByUsername("nobody")).resolves.toEqual([]);
  });

  it.each([
    ["insertPhoto", () => insertPhoto(NEW_PHOTO)],
    ["updatePhotoName", () => updatePhotoName("photo-1", "Renamed")],
    ["deletePhotoById", () => deletePhotoById("photo-1")],
  ])("refuses to pretend %s worked", async (_label, call) => {
    await expect(call()).rejects.toThrow("Supabase is not configured");
  });
});

describe("getPhotos", () => {
  it("passes the rows straight through", async () => {
    harness.client = readingClient(succeeds([{ id: "photo-1" }]));

    await expect(getPhotos()).resolves.toEqual([{ id: "photo-1" }]);
  });

  it("returns nothing rather than null when the table is empty", async () => {
    harness.client = readingClient(succeeds(null));

    await expect(getPhotos()).resolves.toEqual([]);
  });

  it("raises the database's own message", async () => {
    harness.client = readingClient(fails("relation photos does not exist"));

    await expect(getPhotos()).rejects.toThrow("relation photos does not exist");
  });
});

describe("getPhotosByUsername", () => {
  it("raises the database's own message", async () => {
    harness.client = readingClient(fails("permission denied"));

    await expect(getPhotosByUsername("owner@example.com")).rejects.toThrow("permission denied");
  });
});

describe("insertPhoto", () => {
  it("returns the saved row", async () => {
    const saved = { ...NEW_PHOTO, id: "photo-1", created_at: "2026-03-27T21:50:33Z" };
    harness.client = {
      from: vi.fn(() => ({
        insert: vi.fn(() => ({ select: () => ({ single: () => Promise.resolve(succeeds(saved)) }) })),
      })),
    };

    await expect(insertPhoto(NEW_PHOTO)).resolves.toEqual(saved);
  });

  it("raises a row-level security refusal rather than returning nothing", async () => {
    harness.client = {
      from: vi.fn(() => ({
        insert: vi.fn(() => ({
          select: () => ({ single: () => Promise.resolve(fails("new row violates row-level security policy")) }),
        })),
      })),
    };

    await expect(insertPhoto(NEW_PHOTO)).rejects.toThrow("row-level security");
  });
});

describe("updatePhotoName", () => {
  it("writes the new name against that photo alone", async () => {
    const eq = vi.fn(() => ({ select: () => ({ single: () => Promise.resolve(succeeds({ id: "photo-1" })) }) }));
    const update = vi.fn(() => ({ eq }));
    harness.client = { from: vi.fn(() => ({ update })) };

    await updatePhotoName("photo-1", "Renamed");

    expect(update).toHaveBeenCalledWith({ photo_name: "Renamed" });
    expect(eq).toHaveBeenCalledWith("id", "photo-1");
  });

  it("raises the database's own message", async () => {
    harness.client = {
      from: vi.fn(() => ({
        update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve(fails("no rows")) }) }) }),
      })),
    };

    await expect(updatePhotoName("photo-1", "Renamed")).rejects.toThrow("no rows");
  });
});

describe("deletePhotoById", () => {
  /** Tracks which storage objects were removed alongside the row. */
  const deletingClient = (
    lookup: { data: unknown; error: unknown },
    rowDelete: { error: unknown } = { error: null }
  ) => {
    const remove = vi.fn(() => Promise.resolve({ error: null }));
    const deleteEq = vi.fn(() => Promise.resolve(rowDelete));

    return {
      remove,
      deleteEq,
      client: {
        from: vi.fn(() => ({
          select: () => ({ eq: () => ({ single: () => Promise.resolve(lookup) }) }),
          delete: () => ({ eq: deleteEq }),
        })),
        storage: { from: vi.fn(() => ({ remove })) },
      },
    };
  };

  it("removes the stored image as well as the row", async () => {
    const stub = deletingClient(
      succeeds({
        url: "https://acv.supabase.co/storage/v1/object/public/photomapper/photos/1774-a.jpg",
      })
    );
    harness.client = stub.client;

    await deletePhotoById("photo-1");

    expect(stub.remove).toHaveBeenCalledWith(["photos/1774-a.jpg"]);
    expect(stub.deleteEq).toHaveBeenCalledWith("id", "photo-1");
  });

  // Photos added before the app stored its own images, or pointed at another
  // host, have no object to remove; the row still has to go.
  it("still removes the row when the image lives somewhere else", async () => {
    const stub = deletingClient(succeeds({ url: "https://picsum.photos/seed/venice/400/400" }));
    harness.client = stub.client;

    await deletePhotoById("photo-1");

    expect(stub.remove).not.toHaveBeenCalled();
    expect(stub.deleteEq).toHaveBeenCalledWith("id", "photo-1");
  });

  it("stops when the photo cannot be found", async () => {
    const stub = deletingClient(fails("no rows returned"));
    harness.client = stub.client;

    await expect(deletePhotoById("photo-1")).rejects.toThrow("no rows returned");
    expect(stub.deleteEq).not.toHaveBeenCalled();
  });

  it("raises a refusal to delete the row", async () => {
    const stub = deletingClient(succeeds({ url: "https://picsum.photos/seed/venice/400/400" }), {
      error: { message: "permission denied" },
    });
    harness.client = stub.client;

    await expect(deletePhotoById("photo-1")).rejects.toThrow("permission denied");
  });
});
