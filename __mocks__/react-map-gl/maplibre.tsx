import React from "react";
import { vi } from "vitest";

export const Map = vi.fn(
  ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="react-map">{children}</div>
  ),
);

export default Map;

export const Marker = vi.fn(
  ({
    children,
    latitude,
    longitude,
    onClick,
  }: {
    children?: React.ReactNode;
    latitude: number;
    longitude: number;
    onClick?: (e: { originalEvent: { stopPropagation: () => void } }) => void;
  }) => (
    <div
      data-testid="map-marker"
      data-lat={latitude}
      data-lng={longitude}
      onClick={() => onClick?.({ originalEvent: { stopPropagation: () => {} } })}
    >
      {children}
    </div>
  ),
);

export const Popup = vi.fn(
  ({
    children,
    onClose,
  }: {
    children?: React.ReactNode;
    onClose: () => void;
  }) => (
    <div data-testid="map-popup">
      {children}
      <button onClick={onClose}>Close popup</button>
    </div>
  ),
);

export const useMap = vi.fn(() => ({ current: null }));
