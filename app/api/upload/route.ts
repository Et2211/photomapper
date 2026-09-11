import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { insertPhoto } from "@/lib/photos";
import { createClient } from "@/lib/supabase-server";

// The photo is always credited to the signed-in user, so a username sent by the
// client is ignored rather than trusted.
const uploadSchema = z.object({
  photoName: z.string().min(1).max(100),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  imageData: z.string().startsWith("data:image/"),
  fileName: z.string().min(1),
});

export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = uploadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { photoName, lat, lng, imageData, fileName } = parsed.data;
    // Matches what the upload form shows the user they are posting as.
    const username = user.email ?? user.id;

    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const safeFileName = fileName.replace(/[^a-z0-9.]/gi, "_");
    const storageKey = `photos/${Date.now()}-${safeFileName}.jpg`;

    const { error: storageError } = await supabase.storage
      .from("photomapper")
      .upload(storageKey, buffer, { contentType: "image/jpeg", upsert: false });

    if (storageError) {
      throw storageError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("photomapper").getPublicUrl(storageKey);

    const photo = await insertPhoto({
      user_id: user.id,
      username,
      photo_name: photoName,
      lat,
      lng,
      url: publicUrl,
    });

    return NextResponse.json(photo);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
};
