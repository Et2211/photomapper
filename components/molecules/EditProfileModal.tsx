"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import ModalShell from "@/components/molecules/ModalShell";
import { useAppDispatch } from "@/store";
import { setProfile } from "@/store/authSlice";
import { useUpdateDisplayNameMutation } from "@/store/photosApi";

const schema = z.object({
  displayName: z.string().min(1, "Display name is required").max(50),
});

type FormData = z.infer<typeof schema>;

interface EditProfileModalProps {
  isOpen: boolean;
  currentDisplayName: string | null;
  onClose: () => void;
}

const EditProfileModal = ({ isOpen, currentDisplayName, onClose }: EditProfileModalProps) => {
  const dispatch = useAppDispatch();
  const [updateDisplayName, { isLoading }] = useUpdateDisplayNameMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) {
      reset({ displayName: currentDisplayName ?? "" });
    }
  }, [isOpen, currentDisplayName, reset]);

  if (!isOpen) {
    return null;
  }

  const onSubmit = async (data: FormData) => {
    const result = await updateDisplayName({ displayName: data.displayName }).unwrap();
    dispatch(setProfile({ displayName: result.display_name, avatarUrl: result.avatar_url }));
    onClose();
  };

  return (
    <ModalShell title="Edit Profile" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-4">
        <FormField label="Display Name" htmlFor="edit-display-name" error={errors.displayName?.message}>
          <Input {...register("displayName")} id="edit-display-name" placeholder="Your name" />
        </FormField>
        <Button type="submit" variant="primary" size="md" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </ModalShell>
  );
};

export default EditProfileModal;
