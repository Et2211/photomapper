"use client";

import { useCallback, useEffect, useState } from "react";
import type { MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Map, { Marker, Popup } from "react-map-gl/maplibre";

import { useAppDispatch, useAppSelector } from "@/store";
import { setFocusedPhoto } from "@/store/uiSlice";
import type { Photo } from "@/types";

import PhotoMarker from "./PhotoMarker";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const DEFAULT_VIEW = { latitude: 34.0522, longitude: -118.2437, zoom: 10 };

interface MapViewProps {
  photos: Photo[];
  pickingLocation?: boolean;
  onLocationPick?: (lat: number, lng: number) => void;
  pickedLocation?: { lat: number; lng: number } | null;
}

const MapView = ({
  photos,
  pickingLocation = false,
  onLocationPick,
  pickedLocation,
}: MapViewProps) => {
  const dispatch = useAppDispatch();
  const focusedPhotoId = useAppSelector((state) => state.ui.focusedPhotoId);
  const [viewState, setViewState] = useState(DEFAULT_VIEW);
  const [popupPhoto, setPopupPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    if (!focusedPhotoId) {
      return;
    }

    const photo = photos.find((p) => p.id === focusedPhotoId);

    if (photo) {
      setViewState((prev) => ({ ...prev, latitude: photo.lat, longitude: photo.lng, zoom: 15 }));
      setPopupPhoto(photo);
      dispatch(setFocusedPhoto(null));
    }
  }, [focusedPhotoId, photos, dispatch]);

  const handleClick = useCallback(
    (e: MapLayerMouseEvent) => {
      if (pickingLocation && onLocationPick) {
        onLocationPick(e.lngLat.lat, e.lngLat.lng);
      }
    },
    [pickingLocation, onLocationPick]
  );

  return (
    <Map
      {...viewState}
      onMove={(e) => setViewState(e.viewState)}
      mapStyle={MAP_STYLE}
      onClick={handleClick}
      cursor={pickingLocation ? "crosshair" : "auto"}
      style={{ width: "100%", height: "100%" }}
    >
      {photos.map((photo) => (
        <PhotoMarker key={photo.id} photo={photo} onClick={() => setPopupPhoto(photo)} />
      ))}

      {pickedLocation && (
        <Marker latitude={pickedLocation.lat} longitude={pickedLocation.lng} anchor="center">
          <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg" />
        </Marker>
      )}

      {popupPhoto && (
        <Popup
          latitude={popupPhoto.lat}
          longitude={popupPhoto.lng}
          onClose={() => setPopupPhoto(null)}
          anchor="bottom"
          closeButton
        >
          <div className="p-1 min-w-[140px]">
            <img
              src={popupPhoto.url}
              alt={popupPhoto.photo_name}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <p className="font-semibold text-sm leading-tight">{popupPhoto.photo_name}</p>
            <p className="text-xs text-gray-500 mt-0.5">@{popupPhoto.username}</p>
          </div>
        </Popup>
      )}
    </Map>
  );
};

export default MapView;
