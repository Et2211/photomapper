"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import ImagePicker from "@/components/molecules/ImagePicker";
import LocationPicker from "@/components/molecules/LocationPicker";
import ModalShell from "@/components/molecules/ModalShell";
import { useAppDispatch, useAppSelector } from "@/store";
import { useUploadPhotoMutation } from "@/store/photosApi";
import { setUploadOpen } from "@/store/uiSlice";

const schema = z.object({
  photoName: z.string().min(1, "Photo name is required").max(100),
});

type FormData = z.infer<typeof schema>;

interface UploadModalProps {
  isOpen: boolean;
}

const UploadModal = ({ isOpen }: UploadModalProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [uploadPhoto, { isLoading }] = useUploadPhotoMutation();
  const [pickedLocation, setPickedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [exifLocation, setExifLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    reset();
    setPickedLocation(null);
    setExifLocation(null);
    setImageData(null);
    setImagePreview(null);
    setImageFile(null);
    setSubmitError(null);
    dispatch(setUploadOpen(false));
  };

  const handleImageReady = (dataUrl: string, file: File, gps: { lat: number; lng: number } | null) => {
    setImageData(dataUrl);
    setImagePreview(dataUrl);
    setImageFile(file);
    if (gps && !pickedLocation) {
      setPickedLocation(gps);
      setExifLocation(gps);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      setSubmitError("You must be logged in to upload photos.");
      return;
    }

    if (!pickedLocation) {
      setSubmitError("Please click the map to select a location.");
      return;
    }

    if (!imageData || !imageFile) {
      setSubmitError("Please select an image.");
      return;
    }

    setSubmitError(null);

    try {
      await uploadPhoto({
        username: user.email ?? user.id,
        photoName: data.photoName,
        lat: pickedLocation.lat,
        lng: pickedLocation.lng,
        imageData,
        fileName: imageFile.name,
      }).unwrap();
      handleClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    }
  };

  return (
    <ModalShell title="Add Photo" onClose={handleClose} maxWidth="lg" scrollable>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-4">
        {user && (
          <p className="text-sm text-gray-500">
            Uploading as <span className="font-medium text-gray-700">{user.email}</span>
          </p>
        )}

        <FormField label="Photo Name" htmlFor="photo-name" error={errors.photoName?.message}>
          <Input {...register("photoName")} id="photo-name" placeholder="What's this a photo of?" />
        </FormField>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
          <ImagePicker
            preview={imagePreview}
            onImageReady={handleImageReady}
            onError={(msg) => setSubmitError(msg)}
          />
        </div>

        <LocationPicker
          pickedLocation={pickedLocation}
          onLocationPick={(lat, lng) => setPickedLocation({ lat, lng })}
          focusLocation={exifLocation}
        />

        {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

        <Button type="submit" variant="primary" size="md" disabled={isLoading || !user} className="w-full">
          {isLoading ? "Uploading..." : "Upload Photo"}
        </Button>
      </form>
    </ModalShell>
  );
};

export default UploadModal;
