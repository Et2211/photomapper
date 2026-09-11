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

type AuthedClient = NonNullable<Awaited<ReturnType<typeof createClient>>>;

/**
 * Anyone may read photos, so being signed in is not enough to change one: the
 * database grants update and delete to the owner alone, and the route has to
 * say the same thing rather than relying on that policy to catch it.
 *
 * Returns the refusal to send back, or null when the photo is the user's own.
 */
const refuseUnlessOwned = async (supabase: AuthedClient, id: string, userId: string) => {
  const { data, error } = await supabase.from("photos").select("user_id").eq("id", id).single();

  if (error || !data) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  // A photo whose owner has since been removed belongs to nobody, so it is not
  // this user's to change either.
  if (data.user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
};

export const PATCH = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { supabase, user } = await getAuthedUser();

    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const refusal = await refuseUnlessOwned(supabase, id, user.id);

    if (refusal) {
      return refusal;
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
    const { supabase, user } = await getAuthedUser();

    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const refusal = await refuseUnlessOwned(supabase, id, user.id);

    if (refusal) {
      return refusal;
    }

    await deletePhotoById(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 }
    );
  }
};
