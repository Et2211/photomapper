import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { updateDisplayName } from "@/lib/profile";
import { createClient } from "@/lib/supabase-server";

const updateSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(50),
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

export const GET = async () => {
  try {
    const { supabase, user } = await getAuthedUser();

    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();

    return NextResponse.json(data ?? null);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch profile" },
      { status: 500 },
    );
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const { supabase, user } = await getAuthedUser();

    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const profile = await updateDisplayName(supabase, user.id, parsed.data.displayName);
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 },
    );
  }
};
