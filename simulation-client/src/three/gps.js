// Simple GPS converter (local meters → lat/lng)
export function createGPS(originLat = 12.9716, originLng = 77.5946) {
  const metersPerDegLat = 111_320;
  const metersPerDegLng = 111_320 * Math.cos((originLat * Math.PI) / 180);

  function toGPS(x, z) {
    const dLat = z / metersPerDegLat;
    const dLng = x / metersPerDegLng;

    return {
      lat: originLat + dLat,
      lng: originLng + dLng,
    };
  }

  return { toGPS };
}
