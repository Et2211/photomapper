import type { User } from "@supabase/supabase-js";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import UploadModal from "@/components/organisms/UploadModal";
import { renderWithProviders } from "@/tests/helpers/renderWithProviders";
import { server } from "@/tests/mocks/server";

// Mock LocationPicker (uses react-map-gl) and ImagePicker (uses File APIs)
vi.mock("@/components/molecules/LocationPicker", () => ({
  default: ({ onLocationPick }: { onLocationPick: (lat: number, lng: number) => void }) => (
    <button data-testid="location-picker" onClick={() => onLocationPick(34.05, -118.24)}>
      Pick Location
    </button>
  ),
}));

vi.mock("@/components/molecules/ImagePicker", () => ({
  default: ({
    onImageReady,
  }: {
    onImageReady: (dataUrl: string, file: File, gps: null) => void;
    preview: string | null;
    onError?: (msg: string) => void;
  }) => (
    <button
      data-testid="image-picker"
      onClick={() =>
        onImageReady(
          "data:image/jpeg;base64,ABC",
          new File(["img"], "photo.jpg", { type: "image/jpeg" }),
          null,
        )
      }
    >
      Select Image
    </button>
  ),
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockUser = { id: "user-1", email: "test@example.com" } as User;
const loggedInState = { auth: { user: mockUser, isLoading: false } };

describe("UploadModal", () => {
  it("renders nothing when isOpen is false", () => {
    renderWithProviders(<UploadModal isOpen={false} />, { preloadedState: loggedInState });
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  describe("when isOpen is true", () => {
    it("shows form fields", () => {
      renderWithProviders(<UploadModal isOpen={true} />, { preloadedState: loggedInState });
      expect(screen.getByPlaceholderText(/what's this a photo of/i)).toBeInTheDocument();
    });

    it("shows error when photo name is empty on submit", async () => {
      renderWithProviders(<UploadModal isOpen={true} />, { preloadedState: loggedInState });
      await userEvent.click(screen.getByRole("button", { name: /upload photo/i }));
      expect(await screen.findByText(/photo name is required/i)).toBeInTheDocument();
    });

    it("shows error when no location is selected", async () => {
      renderWithProviders(<UploadModal isOpen={true} />, { preloadedState: loggedInState });
      await userEvent.type(screen.getByPlaceholderText(/what's this a photo of/i), "My Photo");
      await userEvent.click(screen.getByRole("button", { name: /upload photo/i }));
      expect(await screen.findByText(/select a location/i)).toBeInTheDocument();
    });

    it("shows error when no image is selected", async () => {
      renderWithProviders(<UploadModal isOpen={true} />, { preloadedState: loggedInState });
      await userEvent.type(screen.getByPlaceholderText(/what's this a photo of/i), "My Photo");
      await userEvent.click(screen.getByTestId("location-picker")); // picks location
      await userEvent.click(screen.getByRole("button", { name: /upload photo/i }));
      expect(await screen.findByText(/select an image/i)).toBeInTheDocument();
    });

    it("upload button is disabled when no user is logged in", () => {
      renderWithProviders(<UploadModal isOpen={true} />);
      expect(screen.getByRole("button", { name: /upload photo/i })).toBeDisabled();
    });

    it("calls upload mutation and closes modal on successful submit", async () => {
      server.use(
        http.post("http://localhost/api/upload", () =>
          HttpResponse.json({
            id: "new-id",
            username: "test@example.com",
            photo_name: "My Photo",
            lat: 34.05,
            lng: -118.24,
            url: "https://example.com/photo.jpg",
            created_at: new Date().toISOString(),
            user_id: "user-1",
          }),
        ),
      );
      const { store } = renderWithProviders(<UploadModal isOpen={true} />, {
        preloadedState: loggedInState,
      });
      await userEvent.type(screen.getByPlaceholderText(/what's this a photo of/i), "My Photo");
      await userEvent.click(screen.getByTestId("location-picker"));
      await userEvent.click(screen.getByTestId("image-picker"));
      await userEvent.click(screen.getByRole("button", { name: /upload photo/i }));
      await waitFor(() => {
        expect(store.getState().ui.isUploadOpen).toBe(false);
      });
    });
  });
});
