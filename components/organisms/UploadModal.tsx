"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useReducer } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/components/atoms/Button";
import ErrorMessage from "@/components/atoms/ErrorMessage";
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

type Location = { lat: number; lng: number };

interface UploadState {
  pickedLocation: Location | null;
  exifLocation: Location | null;
  imageData: string | null;
  imagePreview: string | null;
  imageFile: File | null;
  submitError: string | null;
}

type UploadAction =
  | { type: "SET_IMAGE"; dataUrl: string; file: File }
  | { type: "SET_LOCATION"; location: Location; isExif?: boolean }
  | { type: "SET_ERROR"; message: string | null }
  | { type: "RESET" };

const initialState: UploadState = {
  pickedLocation: null,
  exifLocation: null,
  imageData: null,
  imagePreview: null,
  imageFile: null,
  submitError: null,
};

function uploadReducer(state: UploadState, action: UploadAction): UploadState {
  switch (action.type) {
    case "SET_IMAGE":
      return {
        ...state,
        imageData: action.dataUrl,
        imagePreview: action.dataUrl,
        imageFile: action.file,
      };
    case "SET_LOCATION":
      return {
        ...state,
        pickedLocation: action.location,
        ...(action.isExif ? { exifLocation: action.location } : {}),
      };
    case "SET_ERROR":
      return { ...state, submitError: action.message };
    case "RESET":
      return initialState;
  }
}

const UploadModal = ({ isOpen }: UploadModalProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [uploadPhoto, { isLoading }] = useUploadPhotoMutation();
  const [state, dispatchUpload] = useReducer(uploadReducer, initialState);
  const { pickedLocation, exifLocation, imageData, imagePreview, imageFile, submitError } = state;

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
    dispatchUpload({ type: "RESET" });
    dispatch(setUploadOpen(false));
  };

  const handleImageReady = (dataUrl: string, file: File, gps: Location | null) => {
    dispatchUpload({ type: "SET_IMAGE", dataUrl, file });
    if (gps && !pickedLocation) {
      dispatchUpload({ type: "SET_LOCATION", location: gps, isExif: true });
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      dispatchUpload({ type: "SET_ERROR", message: "You must be logged in to upload photos." });
      return;
    }

    if (!pickedLocation) {
      dispatchUpload({ type: "SET_ERROR", message: "Please click the map to select a location." });
      return;
    }

    if (!imageData || !imageFile) {
      dispatchUpload({ type: "SET_ERROR", message: "Please select an image." });
      return;
    }

    dispatchUpload({ type: "SET_ERROR", message: null });

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
      dispatchUpload({
        type: "SET_ERROR",
        message: err instanceof Error ? err.message : "Upload failed. Please try again.",
      });
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
            onError={(msg) => dispatchUpload({ type: "SET_ERROR", message: msg })}
          />
        </div>

        <LocationPicker
          pickedLocation={pickedLocation}
          onLocationPick={(lat, lng) => dispatchUpload({ type: "SET_LOCATION", location: { lat, lng } })}
          focusLocation={exifLocation}
        />

        <ErrorMessage message={submitError} />

        <Button type="submit" variant="primary" size="md" disabled={isLoading || !user} className="w-full">
          {isLoading ? "Uploading..." : "Upload Photo"}
        </Button>
      </form>
    </ModalShell>
  );
};

export default UploadModal;
