import type { User } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import reducer, { setAuthLoading, setUser } from "./authSlice";

const initial = () => reducer(undefined, { type: "@@INIT" });

const someone = { id: "user-1", email: "owner@example.com" } as User;

describe("authSlice", () => {
  // Starting as loading keeps the app from flashing a signed-out header before
  // the session has been read back.
  it("starts out not knowing who is signed in", () => {
    expect(initial()).toEqual({ user: null, isLoading: true });
  });

  it("stops loading once a user is known", () => {
    const signedIn = reducer(initial(), setUser(someone));

    expect(signedIn.user).toEqual(someone);
    expect(signedIn.isLoading).toBe(false);
  });

  it("stops loading once it knows nobody is signed in", () => {
    const signedOut = reducer(initial(), setUser(null));

    expect(signedOut.user).toBeNull();
    expect(signedOut.isLoading).toBe(false);
  });

  it("forgets the user on sign-out", () => {
    const signedIn = reducer(initial(), setUser(someone));

    expect(reducer(signedIn, setUser(null)).user).toBeNull();
  });

  it("can be put back into loading while a session is refreshed", () => {
    const signedIn = reducer(initial(), setUser(someone));
    const refreshing = reducer(signedIn, setAuthLoading(true));

    expect(refreshing.isLoading).toBe(true);
    expect(refreshing.user).toEqual(someone);
  });
});
