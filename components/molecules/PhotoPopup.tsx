"use client";

import { useState } from "react";
import { Popup } from "react-map-gl/maplibre";

import type { Photo } from "@/types";

interface PhotoPopupProps {
  photo: Photo;
  onClose: () => void;
}

const PhotoPopup = ({ photo, onClose }: PhotoPopupProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Popup latitude={photo.lat} longitude={photo.lng} onClose={onClose} anchor="bottom" closeButton>
      <div className="p-1 min-w-[140px]">
        {!imgLoaded && <div className="w-full h-32 bg-gray-200 animate-pulse rounded mb-2" />}
        <img
          src={photo.url}
          alt={photo.photo_name}
          className={`w-full h-32 object-cover rounded mb-2 ${imgLoaded ? "" : "hidden"}`}
          onLoad={() => setImgLoaded(true)}
        />
        <p className="font-semibold text-sm leading-tight">{photo.photo_name}</p>
        <p className="text-xs text-gray-500 mt-0.5">@{photo.username}</p>
      </div>
    </Popup>
  );
};

export default PhotoPopup;
