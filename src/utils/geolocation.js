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
    lat2 === undefined || lon2 === undefined ||
    isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)
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

/**
 * Major Bangladesh City / Travel Hub Presets
 * (Useful for manual selection, desktop browsers without GPS, or area matching)
 */
export const BANGLADESH_CITY_PRESETS = [
  { id: 'dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka', lat: 23.8103, lng: 90.4125, division: 'Dhaka' },
  { id: 'chattogram', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram', lat: 22.3569, lng: 91.7832, division: 'Chattogram' },
  { id: 'coxsbazar', nameBn: 'কক্সবাজার', nameEn: 'Cox\'s Bazar', lat: 21.4272, lng: 92.0058, division: 'Chattogram' },
  { id: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet', lat: 24.8949, lng: 91.8687, division: 'Sylhet' },
  { id: 'sreemangal', nameBn: 'শ্রীমঙ্গল', nameEn: 'Sreemangal', lat: 24.3065, lng: 91.7296, division: 'Sylhet' },
  { id: 'bandarban', nameBn: 'বান্দরবান', nameEn: 'Bandarban', lat: 22.1953, lng: 92.2184, division: 'Chattogram' },
  { id: 'rangamati', nameBn: 'রাঙামাটি', nameEn: 'Rangamati', lat: 22.6533, lng: 92.1789, division: 'Chattogram' },
  { id: 'khagrachhari', nameBn: 'খাগড়াছড়ি', nameEn: 'Khagrachhari', lat: 23.1193, lng: 91.9847, division: 'Chattogram' },
  { id: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna', lat: 22.8456, lng: 89.5403, division: 'Khulna' },
  { id: 'barishal', nameBn: 'বরিশাল', nameEn: 'Barishal', lat: 22.7010, lng: 90.3535, division: 'Barishal' },
  { id: 'kuakata', nameBn: 'কুয়াকাটা', nameEn: 'Kuakata', lat: 21.8167, lng: 90.1167, division: 'Barishal' },
  { id: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi', lat: 24.3745, lng: 88.6042, division: 'Rajshahi' },
  { id: 'bogura', nameBn: 'বগুড়া', nameEn: 'Bogura', lat: 24.8465, lng: 89.3777, division: 'Rajshahi' },
  { id: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur', lat: 25.7439, lng: 89.2752, division: 'Rangpur' },
  { id: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', lat: 24.7471, lng: 90.4203, division: 'Mymensingh' }
];

/**
 * Finds the nearest well-known hub / city name for a given GPS coordinate.
 * @param {number} lat 
 * @param {number} lng 
 * @returns {string} Bengali area label, e.g. "ঢাকা ও আশপাশের এলাকা"
 */
export function getNearestAreaName(lat, lng) {
  if (!lat || !lng) return 'অজানা অবস্থান';

  let closestCity = BANGLADESH_CITY_PRESETS[0];
  let minDistance = calculateHaversineDistance(lat, lng, closestCity.lat, closestCity.lng);

  for (let i = 1; i < BANGLADESH_CITY_PRESETS.length; i++) {
    const city = BANGLADESH_CITY_PRESETS[i];
    const dist = calculateHaversineDistance(lat, lng, city.lat, city.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = city;
    }
  }

  if (minDistance <= 25) {
    return `${closestCity.nameBn} শহর ও আশপাশ`;
  } else if (minDistance <= 70) {
    return `${closestCity.nameBn} অঞ্চল (${Math.round(minDistance)} কিমি)`;
  } else {
    return `${closestCity.nameBn} সন্নিহিত অঞ্চল`;
  }
}

/**
 * Generates a Google Maps directions URL from user coords to destination
 * @param {number} userLat 
 * @param {number} userLng 
 * @param {number} destLat 
 * @param {number} destLng 
 * @param {string} destName Optional destination title
 * @returns {string} URL string
 */
export function getGoogleMapsDirectionsUrl(userLat, userLng, destLat, destLng, destName = '') {
  if (userLat && userLng) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destLat},${destLng}&travelmode=driving`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;
}

/**
 * Request device location with Promise-based interface and Bengali errors
 * @returns {Promise<{ lat: number, lng: number, accuracy: number, areaName: string }>}
 */
export function requestDeviceLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('আপনার ব্রাউজারটিতে GPS লোকেশন সাপোর্ট করে না। অনুগ্রহ করে ক্রোম বা অন্য আধুনিক ব্রাউজার ব্যবহার করুন।'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        const areaName = getNearestAreaName(lat, lng);
        resolve({
          lat,
          lng,
          accuracy: Math.round(accuracy),
          areaName,
          isManual: false,
          timestamp: Date.now()
        });
      },
      (error) => {
        let msg = 'লোকেশন পাওয়া সম্ভব হয়নি। অনুগ্রহ করে ফোনের GPS চালু করুন।';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'ব্রাউজারে লোকেশনের অনুমতি বন্ধ করা আছে। অনুগ্রহ করে ব্রাউজার সেটিংসে গিয়ে লোকেশন পারমিশন চালু করুন।';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'ডিভাইসের GPS সিগন্যাল পাওয়া যাচ্ছে না। অনুগ্রহ করে খোলা আকাশের নিচে বা নেটওয়ার্ক সংযোগে চেষ্টা করুন।';
            break;
          case error.TIMEOUT:
            msg = 'GPS লোকেশন নির্ধারণে সময় বেশি লাগছে। পুনরায় চেষ্টা করুন বা নিচের তালিকা থেকে আপনার শহর নির্বাচন করুন।';
            break;
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000
      }
    );
  });
}
