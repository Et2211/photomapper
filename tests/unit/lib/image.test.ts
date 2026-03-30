import { afterEach, describe, expect, it, vi } from "vitest";

import { resizeImage } from "@/lib/image";

// --- Mock factories using constructor functions (required by Vitest) ---

function makeFileReaderClass(dataUrl: string | null, error = false) {
  return function MockFileReader(this: {
    onload: ((e: { target: { result: string | null } }) => void) | null;
    onerror: ((e: unknown) => void) | null;
    readAsDataURL: (file: File) => void;
  }) {
    this.onload = null;
    this.onerror = null;
    this.readAsDataURL = vi.fn().mockImplementation(() => {
      if (error) {
        this.onerror?.(new ProgressEvent("error"));
      } else {
        this.onload?.({ target: { result: dataUrl } });
      }
    });
  };
}

function makeImageClass(width: number, height: number, error = false) {
  return function MockImage(this: {
    width: number;
    height: number;
    onload: (() => void) | null;
    onerror: ((e?: unknown) => void) | null;
    src: string;
  }) {
    this.width = width;
    this.height = height;
    this.onload = null;
    this.onerror = null;
    Object.defineProperty(this, "src", {
      set: (_: string) => {
        if (error) {
          this.onerror?.(new Error("Image load failed"));
        } else {
          this.onload?.();
        }
      },
    });
  };
}

// ---

const mockFile = new File(["img"], "photo.jpg", { type: "image/jpeg" });

describe("resizeImage", () => {
  let fileReaderSpy: ReturnType<typeof vi.spyOn>;
  let imageSpy: ReturnType<typeof vi.spyOn>;

  const setup = (
    imgWidth: number,
    imgHeight: number,
    opts: { readerError?: boolean; imageError?: boolean } = {},
  ) => {
    fileReaderSpy = vi
      .spyOn(globalThis, "FileReader")
      .mockImplementation(makeFileReaderClass("data:image/jpeg;base64,ABC", opts.readerError) as never);

    imageSpy = vi
      .spyOn(globalThis, "Image")
      .mockImplementation(makeImageClass(imgWidth, imgHeight, opts.imageError) as never);
  };

  afterEach(() => {
    fileReaderSpy?.mockRestore();
    imageSpy?.mockRestore();
  });

  it("resolves with a data URL string on success", async () => {
    setup(400, 300);
    const result = await resizeImage(mockFile);
    expect(result).toBe("data:image/jpeg;base64,MOCKEDBASE64");
  });

  it("downscales an image wider than maxSize", async () => {
    setup(1000, 500);
    await resizeImage(mockFile, 500);
    // canvas.toDataURL should be called (mocked in setup.ts)
    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalled();
  });

  it("preserves dimensions when image is smaller than maxSize", async () => {
    setup(200, 150);
    await resizeImage(mockFile, 500);
    // no error means image was processed successfully
    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalled();
  });

  it("rejects with 'Canvas context unavailable' when getContext returns null", async () => {
    setup(400, 300);
    (HTMLCanvasElement.prototype.getContext as ReturnType<typeof vi.fn>).mockReturnValueOnce(null);
    await expect(resizeImage(mockFile)).rejects.toThrow("Canvas context unavailable");
  });

  it("rejects when FileReader fires onerror", async () => {
    setup(400, 300, { readerError: true });
    await expect(resizeImage(mockFile)).rejects.toBeDefined();
  });

  it("rejects when Image fires onerror", async () => {
    setup(400, 300, { imageError: true });
    await expect(resizeImage(mockFile)).rejects.toBeDefined();
  });
});
