"use client";

import { useEffect } from "react";

import { createClient, isConfigured } from "@/lib/supabase-browser";

import { useAppDispatch } from "./index";
import { setUser } from "./authSlice";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isConfigured) {
      dispatch(setUser(null));
      return;
    }

    const supabase = createClient();

    supabase.auth
      .getUser()
      .then(({ data }) => dispatch(setUser(data.user ?? null)))
      .catch(() => dispatch(setUser(null)));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setUser(session?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
