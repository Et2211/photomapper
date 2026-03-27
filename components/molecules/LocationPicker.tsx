"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const MapCanvas = dynamic(() => import("@/components/molecules/MapCanvas"), {
  ssr: false,
});

interface LocationPickerProps {
  pickedLocation: { lat: number; lng: number } | null;
  onLocationPick: (lat: number, lng: number) => void;
  focusLocation?: { lat: number; lng: number } | null;
}

const LocationPicker = ({
  pickedLocation,
  onLocationPick,
  focusLocation,
}: LocationPickerProps) => {
  const focusTarget = useMemo(
    () => (focusLocation ? { lat: focusLocation.lat, lng: focusLocation.lng, zoom: 13 } : null),
    [focusLocation]
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Location{" "}
        {pickedLocation ? (
          <span className="text-green-600 font-normal text-xs">
            ({pickedLocation.lat.toFixed(4)}, {pickedLocation.lng.toFixed(4)})
          </span>
        ) : (
          <span className="text-gray-400 font-normal text-xs">
            — click the map to set
          </span>
        )}
      </label>
      <div className="h-48 rounded-lg overflow-hidden border">
        <MapCanvas
          photos={[]}
          pickingLocation
          onLocationPick={onLocationPick}
          pickedLocation={pickedLocation}
          focusTarget={focusTarget}
        />
      </div>
    </div>
  );
};

export default LocationPicker;
