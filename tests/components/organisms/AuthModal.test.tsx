import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase-browser", () => ({
  createClient: vi.fn(),
}));

import AuthModal from "@/components/organisms/AuthModal";
import { createClient } from "@/lib/supabase-browser";
import { createMockSupabaseClient } from "@/tests/helpers/mockSupabase";
import { renderWithProviders } from "@/tests/helpers/renderWithProviders";

const mockCreateClient = vi.mocked(createClient);

describe("AuthModal", () => {
  it("renders nothing when isOpen is false", () => {
    renderWithProviders(<AuthModal isOpen={false} />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  describe("when isOpen is true", () => {
    let mockClient: ReturnType<typeof createMockSupabaseClient>;

    beforeEach(() => {
      mockClient = createMockSupabaseClient();
      mockCreateClient.mockReturnValue(mockClient as never);
    });

    it("renders login form by default", () => {
      renderWithProviders(<AuthModal isOpen={true} />);
      expect(screen.getByRole("heading", { name: /log in/i })).toBeInTheDocument();
    });

    it("renders email and password inputs", () => {
      renderWithProviders(<AuthModal isOpen={true} />);
      expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    });

    it("renders GoogleSignInButton", () => {
      renderWithProviders(<AuthModal isOpen={true} />);
      expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
    });

    it("shows email validation error on submit with invalid email", async () => {
      renderWithProviders(<AuthModal isOpen={true} />);
      const emailInput = screen.getByPlaceholderText("you@example.com");
      fireEvent.change(emailInput, { target: { value: "notanemail" } });
      fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "password123" } });
      fireEvent.submit(emailInput.closest("form")!);
      expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    });

    it("shows password validation error on submit with short password", async () => {
      renderWithProviders(<AuthModal isOpen={true} />);
      const emailInput = screen.getByPlaceholderText("you@example.com");
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "abc" } });
      fireEvent.submit(emailInput.closest("form")!);
      expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument();
    });

    it("calls signInWithPassword on valid login submit", async () => {
      mockClient.auth.signInWithPassword.mockResolvedValue({ data: {} as never, error: null });
      const { store } = renderWithProviders(<AuthModal isOpen={true} />);
      await userEvent.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
      await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
      await userEvent.click(screen.getByRole("button", { name: /^log in$/i }));
      await waitFor(() => {
        expect(mockClient.auth.signInWithPassword).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
        });
      });
      expect(store.getState().ui.isAuthOpen).toBe(false);
    });

    it("shows error message when signInWithPassword returns an error", async () => {
      mockClient.auth.signInWithPassword.mockResolvedValue({
        data: {} as never,
        error: new Error("Invalid credentials") as never,
      });
      renderWithProviders(<AuthModal isOpen={true} />);
      await userEvent.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
      await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
      await userEvent.click(screen.getByRole("button", { name: /^log in$/i }));
      expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
    });

    it("switches to signup mode when toggle link is clicked", async () => {
      renderWithProviders(<AuthModal isOpen={true} />);
      await userEvent.click(screen.getByRole("button", { name: /sign up/i }));
      expect(screen.getByRole("heading", { name: /create account/i })).toBeInTheDocument();
    });

    describe("signup mode", () => {
      beforeEach(async () => {
        renderWithProviders(<AuthModal isOpen={true} />);
        await userEvent.click(screen.getByRole("button", { name: /sign up/i }));
      });

      it("calls signUp on valid signup submit", async () => {
        mockClient.auth.signUp.mockResolvedValue({ data: {} as never, error: null });
        await userEvent.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
        await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
        await userEvent.click(screen.getByRole("button", { name: /create account/i }));
        await waitFor(() => {
          expect(mockClient.auth.signUp).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "password123",
          });
        });
      });

      it("shows success message after successful signup", async () => {
        mockClient.auth.signUp.mockResolvedValue({ data: {} as never, error: null });
        await userEvent.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
        await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
        await userEvent.click(screen.getByRole("button", { name: /create account/i }));
        expect(await screen.findByText(/check your email/i)).toBeInTheDocument();
      });

      it("shows error when signUp fails", async () => {
        mockClient.auth.signUp.mockResolvedValue({
          data: {} as never,
          error: new Error("Email already in use") as never,
        });
        await userEvent.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
        await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
        await userEvent.click(screen.getByRole("button", { name: /create account/i }));
        expect(await screen.findByText("Email already in use")).toBeInTheDocument();
      });
    });

    it("closes modal when × button is clicked", async () => {
      const { store } = renderWithProviders(<AuthModal isOpen={true} />);
      // The × button in ModalShell
      const closeButtons = screen.getAllByRole("button");
      const closeBtn = closeButtons.find((btn) => btn.textContent === "×");
      await userEvent.click(closeBtn!);
      expect(store.getState().ui.isAuthOpen).toBe(false);
    });
  });
});
