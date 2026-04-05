"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect } from "react";


import { upsertProfile } from "@/lib/profile";
import { createClient, isConfigured } from "@/lib/supabase-browser";

import { setProfile, setUser } from "./authSlice";

import { useAppDispatch } from "./index";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isConfigured) {
      dispatch(setUser(null));
      return;
    }

    const supabase = createClient();

    const handleUser = async (user: User | null) => {
      dispatch(setUser(user));
      if (user) {
        const profile = await upsertProfile(supabase, user.id, user.user_metadata as Record<string, string>);
        dispatch(setProfile({ displayName: profile?.display_name ?? null, avatarUrl: profile?.avatar_url ?? null }));
      }
    };

    supabase.auth
      .getUser()
      .then(({ data }) => handleUser(data.user ?? null))
      .catch(() => dispatch(setUser(null)));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
