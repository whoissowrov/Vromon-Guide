import React, { createContext, useContext, useState, useEffect } from 'react';
import destinationsData from '../data/destinations.json';
import { 
  calculateHaversineDistance, 
  requestDeviceLocation, 
  getNearestAreaName, 
  BANGLADESH_CITY_PRESETS 
} from '../utils/geolocation';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state: dark by default for premium travel look or persisted
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('vromon_theme');
    if (saved) return saved;
    return 'dark'; // rich dark emerald aesthetic default
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [selectedVibe, setSelectedVibe] = useState('All');
  const [activeTab, setActiveTab] = useState('explore');
  const [directoryType, setDirectoryType] = useState('all'); // 'all' | 'popular' | 'offbeat' | 'nearby' | 'showcase'

  // User Geolocation State
  const [userLocation, setUserLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('vromon_user_location');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationRadius, setLocationRadius] = useState(100); // in km (50 | 100 | 200 | 0 for all)

  // Route planner state
  const [routeFrom, setRouteFrom] = useState('dhaka');
  const [routeTo, setRouteTo] = useState('sajek-valley');

  // Bookmarks (saved spots)
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('vromon_bookmarks');
      return saved ? JSON.parse(saved) : ['sajek-valley', 'tanguar-haor'];
    } catch {
      return ['sajek-valley', 'tanguar-haor'];
    }
  });

  const [activeModalSpot, setActiveModalSpot] = useState(null);
  const [activePhotoSpot, setActivePhotoSpot] = useState(null);
  const [liveVerificationSpot, setLiveVerificationSpot] = useState(null);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Real Community Photos user uploads (persisted in localStorage)
  const [communityUploads, setCommunityUploads] = useState(() => {
    try {
      const saved = localStorage.getItem('vromon_community_uploads');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Photo likes tracker
  const [likedPhotos, setLikedPhotos] = useState(() => {
    try {
      const saved = localStorage.getItem('vromon_liked_photos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('vromon_theme', theme);
  }, [theme]);

  // Persist bookmarks
  useEffect(() => {
    localStorage.setItem('vromon_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Persist user location
  useEffect(() => {
    if (userLocation) {
      localStorage.setItem('vromon_user_location', JSON.stringify(userLocation));
    } else {
      localStorage.removeItem('vromon_user_location');
    }
  }, [userLocation]);

  // Persist community uploads
  useEffect(() => {
    localStorage.setItem('vromon_community_uploads', JSON.stringify(communityUploads));
  }, [communityUploads]);

  // Persist liked photos
  useEffect(() => {
    localStorage.setItem('vromon_liked_photos', JSON.stringify(likedPhotos));
  }, [likedPhotos]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  /**
   * Request live device GPS coordinates
   */
  const enableUserLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const location = await requestDeviceLocation();
      setUserLocation(location);
      setIsLocating(false);
      return location;
    } catch (err) {
      setLocationError(err.message || 'লোকেশন অ্যাক্সেস ব্যর্থ হয়েছে।');
      setIsLocating(false);
      throw err;
    }
  };

  /**
   * Set location manually from Bangladesh city presets
   */
  const setManualLocation = (cityOrId) => {
    let preset = typeof cityOrId === 'string'
      ? BANGLADESH_CITY_PRESETS.find(c => c.id === cityOrId)
      : cityOrId;

    if (!preset) return;

    const loc = {
      lat: preset.lat,
      lng: preset.lng,
      accuracy: 500,
      areaName: `${preset.nameBn} ও আশপাশ`,
      cityName: preset.nameBn,
      isManual: true,
      timestamp: Date.now()
    };
    setUserLocation(loc);
    setLocationError(null);
    return loc;
  };

  /**
   * Clear user location
   */
  const clearUserLocation = () => {
    setUserLocation(null);
    setLocationError(null);
    if (directoryType === 'nearby') {
      setDirectoryType('all');
    }
  };

  /**
   * Calculate distance from current userLocation to a specific spot
   */
  const getSpotDistance = (spot) => {
    if (!userLocation || !spot || !spot.coordinates) return null;
    const dist = calculateHaversineDistance(
      userLocation.lat,
      userLocation.lng,
      spot.coordinates.lat,
      spot.coordinates.lng
    );
    return dist === Infinity ? null : Math.round(dist * 10) / 10;
  };

  /**
   * Jump to Nearby exploration view
   */
  const exploreNearby = async () => {
    setDirectoryType('nearby');
    const elem = document.getElementById('destinations');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
    if (!userLocation) {
      try {
        await enableUserLocation();
      } catch {
        // Handled in state
      }
    }
  };

  const toggleBookmark = (spotId) => {
    setBookmarks(prev => {
      if (prev.includes(spotId)) {
        return prev.filter(id => id !== spotId);
      } else {
        return [...prev, spotId];
      }
    });
  };

  const togglePhotoLike = (photoId) => {
    setLikedPhotos(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId);
      } else {
        return [...prev, photoId];
      }
    });
  };

  const openLiveVerification = (spot) => {
    setLiveVerificationSpot(spot);
  };

  const closeLiveVerification = () => {
    setLiveVerificationSpot(null);
  };

  const addCommunityPhoto = (spotId, photoData) => {
    const newPhoto = {
      id: `comm-${spotId}-${Date.now()}`,
      url: photoData.url,
      caption: photoData.caption || 'ভেরিফায়েড লাইভ ভ্রমণ ছবি',
      photographer: photoData.photographer || 'অন-সাইট ট্রাভেলার',
      date: photoData.date || new Date().toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' }),
      likes: 1,
      aspectRatio: photoData.aspectRatio || 'wide',
      isUserUploaded: true,
      isLiveVerified: Boolean(photoData.isLiveVerified ?? true),
      verifiedBadge: photoData.verifiedBadge || '✅ ভেরিফায়েড লাইভ ফটো (Verified on Location)',
      distanceKm: photoData.distanceKm !== undefined ? photoData.distanceKm : null,
      userCoords: photoData.userCoords || null,
      verifiedAt: photoData.verifiedAt || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setCommunityUploads(prev => {
      const existing = prev[spotId] || [];
      return {
        ...prev,
        [spotId]: [newPhoto, ...existing]
      };
    });

    return newPhoto;
  };

  const getSpotPhotos = (spot) => {
    if (!spot) return [];
    const userPhotos = communityUploads[spot.id] || [];
    const basePhotos = spot.realPhotos || [];
    return [...userPhotos, ...basePhotos];
  };

  const planRouteTo = (destinationId) => {
    setRouteTo(destinationId);
    setActiveTab('routes');
    // Scroll smoothly to route section
    const elem = document.getElementById('route-planner');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        selectedDivision,
        setSelectedDivision,
        selectedVibe,
        setSelectedVibe,
        activeTab,
        setActiveTab,
        directoryType,
        setDirectoryType,
        userLocation,
        isLocating,
        locationError,
        locationRadius,
        setLocationRadius,
        enableUserLocation,
        setManualLocation,
        clearUserLocation,
        getSpotDistance,
        exploreNearby,
        routeFrom,
        setRouteFrom,
        routeTo,
        setRouteTo,
        bookmarks,
        toggleBookmark,
        activeModalSpot,
        setActiveModalSpot,
        activePhotoSpot,
        setActivePhotoSpot,
        liveVerificationSpot,
        openLiveVerification,
        closeLiveVerification,
        communityUploads,
        likedPhotos,
        togglePhotoLike,
        addCommunityPhoto,
        getSpotPhotos,
        isBookmarksOpen,
        setIsBookmarksOpen,
        planRouteTo,
        destinationsData,
        BANGLADESH_CITY_PRESETS
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
