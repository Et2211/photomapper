import type { User } from "@supabase/supabase-js";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase-browser", () => ({
  createClient: vi.fn(),
}));

import Header from "@/components/organisms/Header";
import { createClient } from "@/lib/supabase-browser";
import { createMockSupabaseClient } from "@/tests/helpers/mockSupabase";
import { renderWithProviders } from "@/tests/helpers/renderWithProviders";
import { server } from "@/tests/mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockCreateClient = vi.mocked(createClient);

const mockUser = { id: "user-1", email: "test@example.com" } as User;

describe("Header", () => {
  beforeEach(() => {
    mockCreateClient.mockReturnValue(createMockSupabaseClient() as never);
  });

  it("renders 'Photomapper' brand text", () => {
    renderWithProviders(<Header />);
    expect(screen.getByText("Photomapper")).toBeInTheDocument();
  });

  describe("when no user is logged in", () => {
    it("renders 'Log in' button", () => {
      renderWithProviders(<Header />);
      expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    });

    it("'+ Add Photo' dispatches setAuthOpen(true)", async () => {
      const { store } = renderWithProviders(<Header />);
      await userEvent.click(screen.getByRole("button", { name: /\+ add photo/i }));
      expect(store.getState().ui.isAuthOpen).toBe(true);
    });

    it("'Log in' button dispatches setAuthOpen(true)", async () => {
      const { store } = renderWithProviders(<Header />);
      await userEvent.click(screen.getByRole("button", { name: /log in/i }));
      expect(store.getState().ui.isAuthOpen).toBe(true);
    });
  });

  describe("when user is logged in", () => {
    const userState = {
      auth: { user: mockUser, isLoading: false },
    };

    it("renders the user's email", () => {
      renderWithProviders(<Header />, { preloadedState: userState });
      expect(screen.getByText(mockUser.email!)).toBeInTheDocument();
    });

    it("'+ Add Photo' dispatches setUploadOpen(true)", async () => {
      const { store } = renderWithProviders(<Header />, { preloadedState: userState });
      await userEvent.click(screen.getByRole("button", { name: /\+ add photo/i }));
      expect(store.getState().ui.isUploadOpen).toBe(true);
    });

    it("'Sign out' calls supabase.auth.signOut", async () => {
      const mockClient = createMockSupabaseClient();
      mockCreateClient.mockReturnValue(mockClient as never);
      renderWithProviders(<Header />, { preloadedState: userState });
      await userEvent.click(screen.getByRole("button", { name: /sign out/i }));
      expect(mockClient.auth.signOut).toHaveBeenCalledTimes(1);
    });
  });
});
