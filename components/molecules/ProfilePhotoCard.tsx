"use client";

import type { Photo } from "@/types";

const timeAgo = (dateStr: string): string => {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);

  if (seconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

interface ProfilePhotoCardProps {
  photo: Photo;
  onEdit: (photo: Photo) => void;
  onDelete: (photo: Photo) => void;
}

const ProfilePhotoCard = ({ photo, onEdit, onDelete }: ProfilePhotoCardProps) => (
  <div className="flex gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
    <img src={photo.url} alt={photo.photo_name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
    <div className="flex flex-col justify-between min-w-0 py-0.5 flex-1">
      <div>
        <p className="font-medium text-sm text-gray-900 truncate">{photo.photo_name}</p>
        <p className="text-xs text-gray-400">{timeAgo(photo.created_at)}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onEdit(photo)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(photo)}
          className="text-xs text-red-500 hover:text-red-700 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default ProfilePhotoCard;
