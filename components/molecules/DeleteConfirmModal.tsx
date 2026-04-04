"use client";

import Button from "@/components/atoms/Button";
import ModalShell from "@/components/molecules/ModalShell";
import { useDeletePhotoMutation } from "@/store/photosApi";
import type { Photo } from "@/types";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  photo: Photo | null;
  onClose: () => void;
}

const DeleteConfirmModal = ({ isOpen, photo, onClose }: DeleteConfirmModalProps) => {
  const [deletePhoto, { isLoading }] = useDeletePhotoMutation();

  if (!isOpen || !photo) {
    return null;
  }

  const handleDelete = async () => {
    await deletePhoto({ id: photo.id, username: photo.username });
    onClose();
  };

  return (
    <ModalShell title="Delete Photo" onClose={onClose}>
      <div className="p-4 flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-900">&quot;{photo.photo_name}&quot;</span>? This cannot be
          undone.
        </p>
        <div className="flex gap-2">
          <Button onClick={onClose} className="flex-1 justify-center" size="md">
            Cancel
          </Button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 text-sm px-4 py-2.5 rounded-lg font-medium transition-colors bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default DeleteConfirmModal;
