"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { useGetPhotosQuery } from "@/store/photosApi";
import { setFocusedPhoto } from "@/store/uiSlice";

const MapCanvas = dynamic(() => import("@/components/molecules/MapCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" />,
});

const MapView = () => {
  const dispatch = useAppDispatch();
  const { data: photos = [] } = useGetPhotosQuery();
  const focusedPhotoId = useAppSelector((state) => state.ui.focusedPhotoId);
  const [geoFocusTarget, setGeoFocusTarget] = useState<{ lat: number; lng: number; zoom: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
       
      (pos) => setGeoFocusTarget({ lat: pos.coords.latitude, lng: pos.coords.longitude, zoom: 12 }),
      () => {} // silently ignore if denied
    );
  }, []);

  const focusTarget = useMemo(() => {
    if (!focusedPhotoId) {
      return null;
    }

    const photo = photos.find((found) => found.id === focusedPhotoId);
    return photo ? { lat: photo.lat, lng: photo.lng, zoom: 15, photo } : null;
  }, [focusedPhotoId, photos]);

  const handleFocusConsumed = useCallback(() => {
    dispatch(setFocusedPhoto(null));
    setGeoFocusTarget(null);
  }, [dispatch]);

  return <MapCanvas photos={photos} focusTarget={focusTarget ?? geoFocusTarget} onFocusConsumed={handleFocusConsumed} />;
};

export default MapView;
