import type { Photo } from "@/types";

import { isConfigured, supabase } from "./supabase";


const MOCK_PHOTOS: Photo[] = [
  {
    id: "mock-1",
    user_id: null,
    username: "demo_user",
    photo_name: "Griffith Observatory",
    lat: 34.1184,
    lng: -118.3004,
    url: "https://picsum.photos/seed/griffith/400/400",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "mock-2",
    user_id: null,
    username: "photo_walker",
    photo_name: "Santa Monica Pier",
    lat: 34.0082,
    lng: -118.4974,
    url: "https://picsum.photos/seed/santamonica/400/400",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "mock-3",
    user_id: null,
    username: "la_explorer",
    photo_name: "Venice Beach",
    lat: 33.985,
    lng: -118.4695,
    url: "https://picsum.photos/seed/venice/400/400",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "mock-4",
    user_id: null,
    username: "cityshots",
    photo_name: "Downtown LA",
    lat: 34.0534,
    lng: -118.2427,
    url: "https://picsum.photos/seed/downtown/400/400",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

export const getPhotos = async (): Promise<Photo[]> => {
  if (!isConfigured || !supabase) {
    return MOCK_PHOTOS;
  }

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const getPhotosByUsername = async (username: string): Promise<Photo[]> => {
  if (!isConfigured || !supabase) {
    return MOCK_PHOTOS.filter((photo) => photo.username === username);
  }

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("username", username)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const insertPhoto = async (
  photo: Omit<Photo, "id" | "created_at">
): Promise<Photo> => {
  if (!isConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase.from("photos").insert([photo]).select().single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updatePhotoName = async (id: string, photoName: string): Promise<Photo> => {
  if (!isConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase
    .from("photos")
    .update({ photo_name: photoName })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deletePhotoById = async (id: string): Promise<void> => {
  if (!isConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  // Fetch the photo first to get the storage URL
  const { data: photo, error: fetchError } = await supabase
    .from("photos")
    .select("url")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  // Extract the storage path from the URL and delete from storage
  if (photo?.url) {
    const url = new URL(photo.url);
    const pathParts = url.pathname.split("/object/public/photomapper/");

    if (pathParts.length === 2) {
      await supabase.storage.from("photomapper").remove([pathParts[1]]);
    }
  }

  const { error } = await supabase.from("photos").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};
