'use client';

import { Marker } from 'react-map-gl/maplibre';
import type { Photo } from '@/types';

interface PhotoMarkerProps {
  photo: Photo;
  onClick: () => void;
}

export default function PhotoMarker({ photo, onClick }: PhotoMarkerProps) {
  return (
    <Marker
      latitude={photo.lat}
      longitude={photo.lng}
      anchor="center"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick();
      }}
    >
      <div className="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden cursor-pointer hover:scale-110 transition-transform">
        <img
          src={photo.url}
          alt={photo.photo_name}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
    </Marker>
  );
}
