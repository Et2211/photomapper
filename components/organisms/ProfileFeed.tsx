"use client";

import Spinner from "@/components/atoms/Spinner";
import PhotoGridItem from "@/components/molecules/PhotoGridItem";
import ProfilePhotoCard from "@/components/molecules/ProfilePhotoCard";
import { useAppSelector } from "@/store";
import { useGetUserPhotosQuery } from "@/store/photosApi";
import type { Photo } from "@/types";


interface ProfileFeedProps {
  onEdit: (photo: Photo) => void;
  onDelete: (photo: Photo) => void;
}

const ProfileFeed = ({ onEdit, onDelete }: ProfileFeedProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const profileView = useAppSelector((state) => state.ui.profileView);
  const username = user?.email ?? "";
  const { data: photos = [], isLoading, isError } = useGetUserPhotosQuery(username, { skip: !username });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 text-sm px-4 text-center">
        Failed to load photos.
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400 text-sm p-6 text-center">
        <p>No photos yet.</p>
        <p>Head back to the map and click &quot;Add Photo&quot; to get started!</p>
      </div>
    );
  }

  if (profileView === "grid") {
    return (
      <div className="overflow-y-auto h-full p-3">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {photos.map((photo) => (
            <PhotoGridItem key={photo.id} photo={photo} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto h-full">
      {photos.map((photo) => (
        <ProfilePhotoCard key={photo.id} photo={photo} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ProfileFeed;
