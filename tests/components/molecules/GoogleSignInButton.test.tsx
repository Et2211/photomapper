import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase-browser", () => ({
  createClient: vi.fn(),
}));

import GoogleSignInButton from "@/components/molecules/GoogleSignInButton";
import { createClient } from "@/lib/supabase-browser";
import { createMockSupabaseClient } from "@/tests/helpers/mockSupabase";

const mockCreateClient = vi.mocked(createClient);

describe("GoogleSignInButton", () => {
  it("renders 'Continue with Google' text", () => {
    const mockClient = createMockSupabaseClient();
    mockCreateClient.mockReturnValue(mockClient as never);
    render(<GoogleSignInButton />);
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
  });

  it("calls signInWithOAuth with provider 'google' on click", async () => {
    const mockClient = createMockSupabaseClient();
    mockCreateClient.mockReturnValue(mockClient as never);
    render(<GoogleSignInButton />);
    await userEvent.click(screen.getByRole("button", { name: /continue with google/i }));
    expect(mockClient.auth.signInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({ provider: "google" }),
    );
  });

  it("does not show error text initially", () => {
    const mockClient = createMockSupabaseClient();
    mockCreateClient.mockReturnValue(mockClient as never);
    render(<GoogleSignInButton />);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("shows error text when signInWithOAuth returns an error", async () => {
    const mockClient = createMockSupabaseClient();
    mockClient.auth.signInWithOAuth.mockResolvedValue({
      data: {} as never,
      error: { message: "OAuth failed" } as never,
    });
    mockCreateClient.mockReturnValue(mockClient as never);
    render(<GoogleSignInButton />);
    await userEvent.click(screen.getByRole("button", { name: /continue with google/i }));
    expect(await screen.findByText("OAuth failed")).toBeInTheDocument();
  });
});
