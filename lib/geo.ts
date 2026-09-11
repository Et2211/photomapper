interface Coordinate {
  lat: number;
  lng: number;
}

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

/**
 * Average position of a set of coordinates, computed on the unit sphere so that
 * points either side of the antimeridian average sensibly (a plain mean of the
 * longitudes would put two photos at -179 and 179 somewhere near 0).
 */
export const averageCoordinate = (points: Coordinate[]): Coordinate | null => {
  if (points.length === 0) {
    return null;
  }

  let sumX = 0;
  let sumY = 0;
  let sumZ = 0;

  for (const point of points) {
    const lat = toRadians(point.lat);
    const lng = toRadians(point.lng);
    sumX += Math.cos(lat) * Math.cos(lng);
    sumY += Math.cos(lat) * Math.sin(lng);
    sumZ += Math.sin(lat);
  }

  const meanX = sumX / points.length;
  const meanY = sumY / points.length;
  const meanZ = sumZ / points.length;

  // Points spread evenly around the globe cancel out and leave no meaningful
  // average; fall back to the first one rather than centring on null island.
  const hypotenuse = Math.hypot(meanX, meanY);
  if (hypotenuse < 1e-9 && Math.abs(meanZ) < 1e-9) {
    return { lat: points[0].lat, lng: points[0].lng };
  }

  return {
    lat: toDegrees(Math.atan2(meanZ, hypotenuse)),
    lng: toDegrees(Math.atan2(meanY, meanX)),
  };
};
