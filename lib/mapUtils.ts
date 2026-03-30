import type { Photo } from "@/types";

export const photoCenter = (
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
