"use client";

import type { Photo } from "@/types";

interface PhotoGridItemProps {
  photo: Photo;
  onEdit: (photo: Photo) => void;
  onDelete: (photo: Photo) => void;
}

const PhotoGridItem = ({ photo, onEdit, onDelete }: PhotoGridItemProps) => (
  <div className="relative aspect-square group overflow-hidden rounded-lg bg-gray-100">
    <img src={photo.url} alt={photo.photo_name} className="w-full h-full object-cover" draggable={false} />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100">
      <p className="text-white text-xs font-medium truncate leading-tight mb-1">{photo.photo_name}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(photo)}
          className="text-xs text-white bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(photo)}
          className="text-xs text-white bg-red-500/70 hover:bg-red-500/90 px-2 py-0.5 rounded transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default PhotoGridItem;
