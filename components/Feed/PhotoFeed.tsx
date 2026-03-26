"use client";

import { useGetPhotosQuery } from "@/store/photosApi";

import PhotoCard from "./PhotoCard";

const PhotoFeed = () => {
  const { data: photos = [], isLoading, isError } = useGetPhotosQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-sm">
        Loading photos...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 text-sm px-4 text-center">
        Failed to load photos. Check your connection and try refreshing.
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400 text-sm p-6 text-center">
        <p>No photos yet.</p>
        <p>Click &quot;Add Photo&quot; to pin the first one!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto h-full">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
};

export default PhotoFeed;
