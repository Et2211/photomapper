import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { deletePhotoById, updatePhotoName } from "@/lib/photos";
import { createClient } from "@/lib/supabase-server";

const updateSchema = z.object({
  photoName: z.string().min(1, "Photo name is required").max(100),
});

const getAuthedUser = async () => {
  const supabase = await createClient();

  if (!supabase) {
    return { supabase: null, user: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
};

export const PATCH = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { user } = await getAuthedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const photo = await updatePhotoName(id, parsed.data.photoName);
    return NextResponse.json(photo);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
};

export const DELETE = async (_request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { user } = await getAuthedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await deletePhotoById(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 }
    );
  }
};
