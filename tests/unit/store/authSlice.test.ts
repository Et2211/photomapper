import type { User } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import reducer, { setAuthLoading, setUser } from "@/store/authSlice";

const mockUser = { id: "user-1", email: "test@example.com" } as User;

describe("authSlice", () => {
  describe("initial state", () => {
    it("has null user and isLoading true", () => {
      const state = reducer(undefined, { type: "@@INIT" });
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(true);
    });
  });

  describe("setUser", () => {
    it("sets the user and clears isLoading", () => {
      const state = reducer(undefined, setUser(mockUser));
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
    });

    it("clears user and clears isLoading when payload is null", () => {
      const withUser = reducer(undefined, setUser(mockUser));
      const state = reducer(withUser, setUser(null));
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });

  describe("setAuthLoading", () => {
    it("sets isLoading to true", () => {
      const initial = reducer(undefined, setUser(mockUser)); // isLoading = false
      const state = reducer(initial, setAuthLoading(true));
      expect(state.isLoading).toBe(true);
    });

    it("sets isLoading to false", () => {
      const state = reducer(undefined, setAuthLoading(false));
      expect(state.isLoading).toBe(false);
    });
  });
});
