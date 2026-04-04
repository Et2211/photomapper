"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import ModalShell from "@/components/molecules/ModalShell";
import { useUpdatePhotoMutation } from "@/store/photosApi";
import type { Photo } from "@/types";

const schema = z.object({
  photoName: z.string().min(1, "Photo name is required").max(100),
});

type FormData = z.infer<typeof schema>;

interface EditPhotoModalProps {
  isOpen: boolean;
  photo: Photo | null;
  onClose: () => void;
}

const EditPhotoModal = ({ isOpen, photo, onClose }: EditPhotoModalProps) => {
  const [updatePhoto, { isLoading }] = useUpdatePhotoMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (photo) {
      reset({ photoName: photo.photo_name });
    }
  }, [photo, reset]);

  if (!isOpen || !photo) {
    return null;
  }

  const onSubmit = async (data: FormData) => {
    await updatePhoto({ id: photo.id, photoName: data.photoName, username: photo.username });
    onClose();
  };

  return (
    <ModalShell title="Edit Photo" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-4">
        <FormField label="Photo Name" htmlFor="edit-photo-name" error={errors.photoName?.message}>
          <Input {...register("photoName")} id="edit-photo-name" placeholder="What's this a photo of?" />
        </FormField>
        <Button type="submit" variant="primary" size="md" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </ModalShell>
  );
};

export default EditPhotoModal;
