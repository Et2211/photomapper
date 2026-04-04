"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { useGetPhotosQuery } from "@/store/photosApi";
import { setFocusedPhoto } from "@/store/uiSlice";

const MapCanvas = dynamic(() => import("@/components/molecules/MapCanvas"), { ssr: false });

const MapView = () => {
  const dispatch = useAppDispatch();
  const { data: photos = [] } = useGetPhotosQuery();
  const focusedPhotoId = useAppSelector((state) => state.ui.focusedPhotoId);

  const focusTarget = useMemo(() => {
    if (!focusedPhotoId) {
      return null;
    }

    const photo = photos.find((found) => found.id === focusedPhotoId);
    return photo ? { lat: photo.lat, lng: photo.lng, zoom: 15, photo } : null;
  }, [focusedPhotoId, photos]);

  const handleFocusConsumed = useCallback(() => {
    dispatch(setFocusedPhoto(null));
  }, [dispatch]);

  return <MapCanvas photos={photos} focusTarget={focusTarget} onFocusConsumed={handleFocusConsumed} />;
};

export default MapView;
