import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/store/photosApi", () => ({
  useGetPhotosQuery: vi.fn(),
  useUploadPhotoMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
  photosApi: {
    reducerPath: "photosApi",
    reducer: () => ({}),
    middleware: () => () => () => {},
  },
}));

import PhotoFeed from "@/components/organisms/PhotoFeed";
import { useGetPhotosQuery } from "@/store/photosApi";
import { renderWithProviders } from "@/tests/helpers/renderWithProviders";
import { mockPhotos } from "@/tests/mocks/handlers";

const mockUseGetPhotosQuery = vi.mocked(useGetPhotosQuery);

describe("PhotoFeed", () => {
  it("renders a Spinner while loading", () => {
    mockUseGetPhotosQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof useGetPhotosQuery>);

    renderWithProviders(<PhotoFeed />);
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("shows error message when request fails", () => {
    mockUseGetPhotosQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as unknown as ReturnType<typeof useGetPhotosQuery>);

    renderWithProviders(<PhotoFeed />);
    expect(screen.getByText(/failed to load photos/i)).toBeInTheDocument();
  });

  it("shows 'No photos yet' when photos array is empty", () => {
    mockUseGetPhotosQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useGetPhotosQuery>);

    renderWithProviders(<PhotoFeed />);
    expect(screen.getByText(/no photos yet/i)).toBeInTheDocument();
  });

  it("renders a PhotoCard for each photo", () => {
    mockUseGetPhotosQuery.mockReturnValue({
      data: mockPhotos,
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useGetPhotosQuery>);

    renderWithProviders(<PhotoFeed />);
    expect(screen.getByText(mockPhotos[0].photo_name)).toBeInTheDocument();
    expect(screen.getByText(mockPhotos[1].photo_name)).toBeInTheDocument();
  });
});
