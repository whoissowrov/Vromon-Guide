/**
 * Geolocation & Haversine Distance Utilities for Vromon Guide
 */

/**
 * Calculates the great-circle distance between two GPS coordinates using the Haversine formula.
 * @param {number} lat1 Latitude of point 1 (in degrees)
 * @param {number} lon1 Longitude of point 1 (in degrees)
 * @param {number} lat2 Latitude of point 2 (in degrees)
 * @param {number} lon2 Longitude of point 2 (in degrees)
 * @returns {number} Distance in kilometers
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (
    lat1 === undefined || lon1 === undefined ||
    lat2 === undefined || lon2 === undefined
  ) {
    return Infinity;
  }

  const R = 6371; // Earth's mean radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Checks if user is within the geofenced threshold (default: 5.0 km) of the destination.
 * @param {number} userLat 
 * @param {number} userLng 
 * @param {number} targetLat 
 * @param {number} targetLng 
 * @param {number} thresholdKm Default 5.0 km
 * @returns {{ isWithinGeofence: boolean, distanceKm: number }}
 */
export function verifyGeofenceProximity(userLat, userLng, targetLat, targetLng, thresholdKm = 5.0) {
  const distanceKm = calculateHaversineDistance(userLat, userLng, targetLat, targetLng);
  return {
    isWithinGeofence: distanceKm <= thresholdKm,
    distanceKm: Math.round(distanceKm * 100) / 100
  };
}

/**
 * Converts numbers to Bengali digits
 */
export function toBengaliNumber(num) {
  if (num === null || num === undefined) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/[0-9]/g, (d) => bnDigits[d]);
}

