"use client";

import { useCallback, useRef } from "react";

import { resizeImage } from "@/lib/image";

interface ImagePickerProps {
  preview: string | null;
  onImageReady: (dataUrl: string, file: File) => void;
  onError?: (message: string) => void;
}

const ImagePicker = ({ preview, onImageReady, onError }: ImagePickerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        const resized = await resizeImage(file);
        onImageReady(resized, file);
      } catch (err) {
        onError?.(
          err instanceof Error ? err.message : "Failed to process image.",
        );
      }
    },
    [onImageReady, onError],
  );

  return (
    <div>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        aria-label="Select an image"
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg mx-auto"
          />
        ) : (
          <p className="text-gray-400 text-sm py-4">Click to select an image</p>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImagePicker;
