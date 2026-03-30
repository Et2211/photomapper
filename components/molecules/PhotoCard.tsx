"use client";

import { timeAgo } from "@/lib/timeAgo";
import { useAppDispatch } from "@/store";
import { setFocusedPhoto, setMobileTab } from "@/store/uiSlice";
import type { Photo } from "@/types";

const PhotoCard = ({ photo }: { photo: Photo }) => {
  const dispatch = useAppDispatch();

  const handleShowOnMap = () => {
    dispatch(setFocusedPhoto(photo.id));
    dispatch(setMobileTab("map"));
  };

  return (
    <div className="flex gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <img src={photo.url} alt={photo.photo_name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
      <div className="flex flex-col justify-between min-w-0 py-0.5 flex-1">
        <div>
          <p className="font-medium text-sm text-gray-900 truncate">{photo.photo_name}</p>
          <p className="text-xs text-gray-500">@{photo.username}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{timeAgo(photo.created_at)}</span>
          <button onClick={handleShowOnMap} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Show on map
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
