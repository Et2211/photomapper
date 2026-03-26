"use client";

import { useEffect } from "react";

import { createClient } from "@/lib/supabase-browser";

import { useAppDispatch } from "./index";
import { setUser } from "./authSlice";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      dispatch(setUser(data.user ?? null));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setUser(session?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, [dispatch, supabase.auth]);

  return <>{children}</>;
};

export default AuthProvider;
