import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/image", () => ({ resizeImage: vi.fn() }));
vi.mock("@/lib/exif", () => ({ extractGpsFromFile: vi.fn() }));

import ImagePicker from "@/components/molecules/ImagePicker";
import { extractGpsFromFile } from "@/lib/exif";
import { resizeImage } from "@/lib/image";

const mockResizeImage = vi.mocked(resizeImage);
const mockExtractGps = vi.mocked(extractGpsFromFile);

const mockFile = new File(["img"], "photo.jpg", { type: "image/jpeg" });

describe("ImagePicker", () => {
  it("renders the select image button", () => {
    render(<ImagePicker preview={null} onImageReady={vi.fn()} />);
    expect(screen.getByRole("button", { name: /select an image/i })).toBeInTheDocument();
  });

  it("shows placeholder text when preview is null", () => {
    render(<ImagePicker preview={null} onImageReady={vi.fn()} />);
    expect(screen.getByText(/click to select an image/i)).toBeInTheDocument();
  });

  it("renders a preview image when preview is a data URL", () => {
    render(<ImagePicker preview="data:image/jpeg;base64,ABC" onImageReady={vi.fn()} />);
    expect(screen.getByRole("img", { name: /preview/i })).toHaveAttribute(
      "src",
      "data:image/jpeg;base64,ABC",
    );
  });

  it("calls onImageReady with (dataUrl, file, gps) on successful file selection", async () => {
    mockResizeImage.mockResolvedValue("data:image/jpeg;base64,RESIZED");
    mockExtractGps.mockResolvedValue({ lat: 34.05, lng: -118.24 });
    const onImageReady = vi.fn();

    render(<ImagePicker preview={null} onImageReady={onImageReady} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, mockFile);

    expect(onImageReady).toHaveBeenCalledWith(
      "data:image/jpeg;base64,RESIZED",
      mockFile,
      { lat: 34.05, lng: -118.24 },
    );
  });

  it("calls onError with the error message when resizeImage rejects", async () => {
    mockResizeImage.mockRejectedValue(new Error("Canvas unavailable"));
    mockExtractGps.mockResolvedValue(null);
    const onError = vi.fn();

    render(<ImagePicker preview={null} onImageReady={vi.fn()} onError={onError} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, mockFile);

    expect(onError).toHaveBeenCalledWith("Canvas unavailable");
  });

  it("passes null gps when GPS extraction returns null", async () => {
    mockResizeImage.mockResolvedValue("data:image/jpeg;base64,RESIZED");
    mockExtractGps.mockResolvedValue(null);
    const onImageReady = vi.fn();

    render(<ImagePicker preview={null} onImageReady={onImageReady} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, mockFile);

    expect(onImageReady).toHaveBeenCalledWith(
      expect.any(String),
      mockFile,
      null,
    );
  });
});
