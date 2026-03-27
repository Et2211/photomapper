"use client";

import type { MapLayerMouseEvent } from "maplibre-gl";
import { useCallback, useEffect, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import ReactMap, { Marker } from "react-map-gl/maplibre";

import MapPin from "@/components/atoms/MapPin";
import type { Photo } from "@/types";

import PhotoMarker from "./PhotoMarker";
import PhotoPopup from "./PhotoPopup";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const DEFAULT_VIEW = { latitude: 34.0522, longitude: -118.2437, zoom: 10 };

interface FocusTarget {
  lat: number;
  lng: number;
  zoom: number;
  photo: Photo;
}

interface MapCanvasProps {
  photos: Photo[];
  pickingLocation?: boolean;
  onLocationPick?: (lat: number, lng: number) => void;
  pickedLocation?: { lat: number; lng: number } | null;
  focusTarget?: FocusTarget | null;
  onFocusConsumed?: () => void;
}

const MapCanvas = ({
  photos,
  pickingLocation = false,
  onLocationPick,
  pickedLocation,
  focusTarget,
  onFocusConsumed,
}: MapCanvasProps) => {
  const [viewState, setViewState] = useState(DEFAULT_VIEW);
  const [popupPhoto, setPopupPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    if (!focusTarget) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewState((prev) => ({
      ...prev,
      latitude: focusTarget.lat,
      longitude: focusTarget.lng,
      zoom: focusTarget.zoom,
    }));

    setPopupPhoto(focusTarget.photo);
    onFocusConsumed?.();
  }, [focusTarget, onFocusConsumed]);

  const handleClick = useCallback(
    (e: MapLayerMouseEvent) => {
      if (pickingLocation && onLocationPick) {
        onLocationPick(e.lngLat.lat, e.lngLat.lng);
      }
    },
    [pickingLocation, onLocationPick],
  );

  return (
    <ReactMap
      {...viewState}
      onMove={(e) => setViewState(e.viewState)}
      mapStyle={MAP_STYLE}
      onClick={handleClick}
      cursor={pickingLocation ? "crosshair" : "auto"}
      style={{ width: "100%", height: "100%" }}
    >
      {photos.map((photo) => (
        <PhotoMarker
          key={photo.id}
          photo={photo}
          onClick={() => setPopupPhoto(photo)}
        />
      ))}

      {pickedLocation && (
        <Marker
          latitude={pickedLocation.lat}
          longitude={pickedLocation.lng}
          anchor="center"
        >
          <MapPin />
        </Marker>
      )}

      {popupPhoto && (
        <PhotoPopup photo={popupPhoto} onClose={() => setPopupPhoto(null)} />
      )}
    </ReactMap>
  );
};

export default MapCanvas;
