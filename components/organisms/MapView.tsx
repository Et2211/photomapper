"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { useGetPhotosQuery } from "@/store/photosApi";
import { setFocusedPhoto } from "@/store/uiSlice";
import type { Photo } from "@/types";

const MapCanvas = dynamic(() => import("@/components/molecules/MapCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" />,
});

const photoCenter = (
  photos: Photo[],
): { lat: number; lng: number; zoom: number } | null => {
  const recent = photos.slice(-5);
  if (recent.length === 0) return null;

  const lats = recent.map((point) => point.lat);
  const lngs = recent.map((point) => point.lng);
  const lat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const lng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  const maxSpan = Math.max(
    Math.max(...lats) - Math.min(...lats),
    Math.max(...lngs) - Math.min(...lngs),
  );
  const zoom =
    maxSpan === 0
      ? 13
      : Math.max(2, Math.min(13, Math.round(Math.log2(180 / maxSpan))));

  return { lat, lng, zoom };
};

const MapView = () => {
  const dispatch = useAppDispatch();
  const { data: photos = [] } = useGetPhotosQuery();
  const focusedPhotoId = useAppSelector((state) => state.ui.focusedPhotoId);
  const [geoFocusTarget, setGeoFocusTarget] = useState<{
    lat: number;
    lng: number;
    zoom: number;
  } | null>(null);
  const [geoDenied, setGeoDenied] = useState(false);

  // Try user's location on mount
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setGeoFocusTarget({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          zoom: 12,
        }),

      () => setGeoDenied(true),
    );
  }, []);

  // Fall back to photo centre once photos are available and geolocation was denied
  useEffect(() => {
    if (!geoDenied || geoFocusTarget || photos.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGeoFocusTarget(photoCenter(photos));
  }, [geoDenied, photos]); // geoFocusTarget intentionally excluded — only set once

  const focusTarget = useMemo(() => {
    if (!focusedPhotoId) return null;
    const photo = photos.find((found) => found.id === focusedPhotoId);
    return photo ? { lat: photo.lat, lng: photo.lng, zoom: 15, photo } : null;
  }, [focusedPhotoId, photos]);

  const handleFocusConsumed = useCallback(() => {
    dispatch(setFocusedPhoto(null));
    setGeoFocusTarget(null);
  }, [dispatch]);

  return (
    <MapCanvas
      photos={photos}
      focusTarget={focusTarget ?? geoFocusTarget}
      onFocusConsumed={handleFocusConsumed}
    />
  );
};

export default MapView;
