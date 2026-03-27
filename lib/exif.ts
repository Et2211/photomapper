import exifr from "exifr";

export const extractGpsFromFile = async (file: File): Promise<{ lat: number; lng: number } | null> => {
  try {
    const gps = await exifr.gps(file);
    if (!gps?.latitude || !gps?.longitude) {
      return null;
    }
    return { lat: gps.latitude, lng: gps.longitude };
  } catch {
    return null;
  }
};
