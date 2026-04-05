import type { SupabaseClient } from "@supabase/supabase-js";

import type { Profile } from "@/types";

/**
 * Upserts a profile row on login. On first login the row is inserted with
 * display_name + avatar_url from user_metadata (populated by Google OAuth).
 * On repeat logins the insert is a no-op (conflict on id), so any
 * user-edited display_name is never overwritten.
 */
export const upsertProfile = async (
  supabase: SupabaseClient,
  userId: string,
  userMetadata: Record<string, string>,
): Promise<Profile | null> => {
  // Attempt insert — silently ignored if the user already has a profile row
  await supabase.from("profiles").insert({
    id: userId,
    display_name: userMetadata["full_name"] ?? null,
    avatar_url: userMetadata["picture"] ?? null,
  });

  // Always fetch the current row (covers both new insert and existing)
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();

  return data as Profile | null;
};

/**
 * Updates only the display_name for the authenticated user's profile.
 */
export const updateDisplayName = async (
  supabase: SupabaseClient,
  userId: string,
  displayName: string,
): Promise<Profile | null> => {
  const { data } = await supabase
    .from("profiles")
    .update({ display_name: displayName, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  return data as Profile | null;
};
