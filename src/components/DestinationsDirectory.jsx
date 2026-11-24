import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import DestinationCard from './DestinationCard';
import HiddenGemsSection from './HiddenGemsSection';
import { toBengaliNumber } from '../utils/geolocation';
import { 
  MapPin, 
  Sparkles, 
  SlidersHorizontal, 
  RotateCcw,
  Compass,
  Flame,
  Gem,
  Tent,
  Layers,
  Tag,
  Navigation2,
  LocateFixed,
  RefreshCw,
  AlertCircle,
  Radio,
  MapPinned
} from 'lucide-react';

const DestinationsDirectory = ({ onSelectTransitSpot }) => {
  const { 
    destinationsData, 
    searchQuery, 
    setSearchQuery,
    selectedDivision, 
    setSelectedDivision, 
    selectedVibe, 
    setSelectedVibe,
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
    BANGLADESH_CITY_PRESETS
  } = useApp();

  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'reviews' | 'name' | 'distance'
  const [selectedTag, setSelectedTag] = useState('All');
  const [nearbyCategoryFilter, setNearbyCategoryFilter] = useState('all'); // 'all' | 'popular' | 'offbeat'

  const divisionsList = [
    { id: 'All', nameEn: 'All Divisions', nameBn: 'সকল বিভাগ' },
    { id: 'Chattogram', nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম' },
    { id: 'Sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট' },
    { id: 'Khulna', nameEn: 'Khulna', nameBn: 'খুলনা' },
    { id: 'Barishal', nameEn: 'Barishal', nameBn: 'বরিশাল' },
    { id: 'Rajshahi', nameEn: 'Rajshahi', nameBn: 'রাজশাহী' },
    { id: 'Rangpur', nameEn: 'Rangpur', nameBn: 'রংপুর' },
    { id: 'Dhaka', nameEn: 'Dhaka', nameBn: 'ঢাকা' },
    { id: 'Mymensingh', nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
  ];

  // Quick popular tags for filtering
  const topTags = ['All', 'Hills', 'Water', 'Heritage', 'Forest', 'Trekking', 'Camping', 'Beaches'];

  // Filtered & Sorted spots
  const filteredSpots = useMemo(() => {
    // 1. Calculate distance for each spot if userLocation is active
    const spotsWithDistance = destinationsData.map((spot) => {
      const distance = getSpotDistance(spot);
      return {
        ...spot,
        userDistance: distance
      };
    });

    // 2. Filter logic based on directoryType
    return spotsWithDistance.filter((spot) => {
      // Nearby mode filters
      if (directoryType === 'nearby') {
        if (!userLocation) return true; // Show all until location enabled
        
        // Radius filter
        if (locationRadius > 0 && spot.userDistance !== null) {
          if (spot.userDistance > locationRadius) return false;
        }

        // Sub-filter inside nearby (Popular / Offbeat)
        if (nearbyCategoryFilter === 'popular' && spot.category !== 'Popular') return false;
        if (nearbyCategoryFilter === 'offbeat' && spot.category !== 'Offbeat') return false;
      } else {
        // Standard category filters
        if (directoryType === 'popular' && spot.category !== 'Popular') return false;
        if (directoryType === 'offbeat' && spot.category !== 'Offbeat') return false;
      }

      // Search query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        spot.name.toLowerCase().includes(q) ||
        spot.bengaliName.toLowerCase().includes(q) ||
        spot.district.toLowerCase().includes(q) ||
        spot.division.toLowerCase().includes(q) ||
        spot.vibe.toLowerCase().includes(q) ||
        (spot.tags && spot.tags.some(t => t.toLowerCase().includes(q))) ||
        (spot.highlights && spot.highlights.some(h => h.toLowerCase().includes(q)))
      );

      // Division (in nearby mode, division filter can be optional or applied if selected)
      const matchesDivision = directoryType === 'nearby' || selectedDivision === 'All' || spot.division.toLowerCase() === selectedDivision.toLowerCase();

      // Vibe
      const matchesVibe = selectedVibe === 'All' || 
        spot.vibe.toLowerCase() === selectedVibe.toLowerCase() ||
        (spot.vibes && spot.vibes.some(v => v.toLowerCase() === selectedVibe.toLowerCase()));

      // Tag
      const matchesTag = selectedTag === 'All' || (spot.tags && spot.tags.includes(selectedTag));

      return matchesSearch && matchesDivision && matchesVibe && matchesTag;
    }).sort((a, b) => {
      // In nearby mode, default sort by distance ascending (closest first)
      if (directoryType === 'nearby' && userLocation) {
        if (sortBy === 'distance' || sortBy === 'rating') {
          if (a.userDistance !== null && b.userDistance !== null) {
            return a.userDistance - b.userDistance;
          }
        }
      }

      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'distance' && a.userDistance !== null && b.userDistance !== null) {
        return a.userDistance - b.userDistance;
      }
      return 0;
    });
  }, [
    destinationsData, 
    directoryType, 
    userLocation, 
    locationRadius, 
    nearbyCategoryFilter, 
    searchQuery, 
    selectedDivision, 
    selectedVibe, 
    selectedTag, 
    sortBy,
    getSpotDistance
  ]);

  const hasActiveFilters = searchQuery !== '' || selectedDivision !== 'All' || selectedVibe !== 'All' || selectedTag !== 'All' || directoryType !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDivision('All');
    setSelectedVibe('All');
    setSelectedTag('All');
    setDirectoryType('all');
    setSortBy('rating');
    setNearbyCategoryFilter('all');
  };

  return (
    <section id="destinations" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Master 5-Way Segmented Filter Control */}
      <div className="flex justify-center mb-8">
        <div className="p-1.5 rounded-2xl bg-slate-200/90 dark:bg-[#0B1E16] border border-slate-300 dark:border-emerald-800/40 shadow-md inline-flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          
          {/* All Spots */}
          <button
            onClick={() => setDirectoryType('all')}
            className={`px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 ${
              directoryType === 'all'
                ? 'bg-emerald-600 text-white shadow-glow'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-300" />
            <span>সকল স্পট (52)</span>
          </button>

          {/* Near Me / Nearby Spots */}
          <button
            onClick={() => {
              setDirectoryType('nearby');
              if (!userLocation) {
                enableUserLocation().catch(() => {});
              }
            }}
            className={`px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 relative ${
              directoryType === 'nearby'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-glow'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5 mr-0.5">
              {userLocation ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
                </>
              ) : (
                <Radio className="w-3.5 h-3.5 text-teal-400" />
              )}
            </span>
            <LocateFixed className="w-4 h-4 text-emerald-300" />
            <span>আমার কাছে (Near Me)</span>
            {userLocation && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-black">
                GPS
              </span>
            )}
          </button>

          {/* Popular Spots */}
          <button
            onClick={() => setDirectoryType('popular')}
            className={`px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 ${
              directoryType === 'popular'
                ? 'bg-amber-500 text-slate-950 shadow-glow'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-900" />
            <span>পপুলার (20)</span>
          </button>

          {/* Offbeat Gems */}
          <button
            onClick={() => setDirectoryType('offbeat')}
            className={`px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 ${
              directoryType === 'offbeat'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Gem className="w-4 h-4 text-purple-300" />
            <span>অফবিট (32)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
              NEW
            </span>
          </button>

          {/* Deep Offbeat Showcase */}
          <button
            onClick={() => setDirectoryType('showcase')}
            className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 ${
              directoryType === 'showcase'
                ? 'bg-teal-600 text-white shadow-glow'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Tent className="w-4 h-4 text-teal-300" />
            <span>ক্যাম্পিং শোকেস</span>
          </button>

        </div>
      </div>

      {/* RENDER DEEP SHOWCASE VIEW IF SELECTED */}
      {directoryType === 'showcase' ? (
        <HiddenGemsSection onSelectTransitSpot={onSelectTransitSpot} />
      ) : (
        /* RENDER DIRECTORY */
        <div>
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>
                  {directoryType === 'nearby' 
                    ? 'GPS Geolocation & Proximity Radar (নিকটবর্তী স্পটসমূহ)'
                    : '8-Division Master Dataset (৮টি প্রশাসনিক বিভাগ)'
                  }
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {directoryType === 'nearby' && 'Explore Spots Near You (আপনার আশেপাশের দর্শনীয় স্থান)'}
                {directoryType === 'popular' && 'Top Popular Tourist Destinations (জনপ্রিয় পর্যটন কেন্দ্র)'}
                {directoryType === 'offbeat' && 'Authentic Offbeat Hidden Gems (গোপন ও নির্জন অফবিট স্পট)'}
                {directoryType === 'all' && 'Bangladesh Master Travel Directory (সকল দর্শনীয় স্থান)'}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
                {directoryType === 'nearby'
                  ? 'আপনার বর্তমান অবস্থান থেকে নিকটবর্তী সকল আকর্ষণ, আসল দূরত্ব ও গুগল ম্যাপস দিকনির্দেশনা।'
                  : 'চট্টগ্রাম, সিলেট, খুলনা, বরিশাল, রাজশাহী, রংপুর, ঢাকা ও ময়মনসিংহ—আসল লোকাল বাহন ও সঠিক ভাড়ার হিসাব।'
                }
              </p>
            </div>

            {/* Filter controls & Sort bar */}
            <div className="flex flex-wrap items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              )}

              {/* Sort Selector */}
              <div className="flex items-center gap-2 bg-white dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-800/40 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent focus:outline-none text-emerald-700 dark:text-emerald-400 font-bold cursor-pointer"
                >
                  {userLocation && (
                    <option value="distance" className="dark:bg-[#0B1E16]">
                      📍 Nearest First (নিকটবর্তী)
                    </option>
                  )}
                  <option value="rating" className="dark:bg-[#0B1E16]">Highest Rated</option>
                  <option value="reviews" className="dark:bg-[#0B1E16]">Most Popular</option>
                  <option value="name" className="dark:bg-[#0B1E16]">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* NEARBY PROXIMITY RADAR DASHBOARD (Only in Nearby Mode) */}
          {directoryType === 'nearby' && (
            <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-[#0B1E16] to-[#07130E] border border-emerald-500/30 shadow-xl backdrop-blur-md">
              {/* Not Located State - Big Prompt Banner */}
              {!userLocation && !isLocating && (
                <div className="text-center py-6 px-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-glow">
                    <LocateFixed className="w-8 h-8 animate-pulse text-emerald-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                    আপনার চারপাশের দর্শনীয় স্থান খুঁজুন (Enable Location)
                  </h3>
                  <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6 leading-relaxed">
                    আপনার ফোনের বা ডিভাইসের GPS লোকেশন চালু করুন। আপনার অবস্থান থেকে ৫০ কিমি বা ১০০ কিমির মধ্যে থাকা সব প্রাকৃতিক পাহাড়ি ট্রেইল, নদী, লেক ও দর্শনীয় স্থান এক পলকে দূরত্বের ক্রম অনুযায়ী দেখতে পাবেন।
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                    <button
                      onClick={() => enableUserLocation()}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-glow flex items-center justify-center gap-2 transition-all transform hover:scale-102"
                    >
                      <Navigation2 className="w-4 h-4 fill-current" />
                      <span>লাইভ GPS লোকেশন চালু করুন (Auto Detect)</span>
                    </button>
                  </div>

                  {locationError && (
                    <div className="max-w-lg mx-auto p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 mb-5 text-left">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{locationError}</span>
                    </div>
                  )}

                  {/* Manual City Fallback Selector */}
                  <div className="pt-4 border-t border-emerald-900/40">
                    <p className="text-xs font-bold text-slate-400 mb-3 flex items-center justify-center gap-1.5">
                      <MapPinned className="w-3.5 h-3.5 text-emerald-400" />
                      অথবা নিচের তালিকা থেকে আপনার বর্তমান জেলা/শহর বেছে নিন:
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {BANGLADESH_CITY_PRESETS.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => setManualLocation(city)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-emerald-600/30 text-slate-300 hover:text-white border border-white/10 hover:border-emerald-500/50 transition-all"
                        >
                          {city.nameBn}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Locating Spinner */}
              {isLocating && (
                <div className="text-center py-10 px-4">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
                  <h4 className="text-lg font-bold text-white mb-1">
                    🛰️ আপনার স্যাটেলাইট GPS স্থানাঙ্ক সংগ্রহ করা হচ্ছে...
                  </h4>
                  <p className="text-xs text-slate-400">
                    অনুগ্রহ করে ব্রাউজারের পপ-আপে লোকেশনের অনুমতি (Allow Location) দিন।
                  </p>
                </div>
              )}

              {/* User Location Active - Radar Panel */}
              {userLocation && (
                <div>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-800/40">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                          <LocateFixed className="w-5 h-5 text-emerald-400" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                            {userLocation.isManual ? 'নির্বাচিত শহর' : 'লাইভ GPS সক্রিয়'}
                          </span>
                          <span className="text-xs text-slate-400">
                            (±{userLocation.accuracy}m একুরেসি)
                          </span>
                        </div>
                        <h4 className="text-lg font-extrabold text-white mt-0.5 flex items-center gap-2">
                          <span>{userLocation.areaName}</span>
                          <span className="text-xs text-emerald-400/80 font-mono font-normal">
                            [{userLocation.lat.toFixed(3)}°N, {userLocation.lng.toFixed(3)}°E]
                          </span>
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => enableUserLocation()}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10"
                        title="রিলোড বা রিফ্রেশ GPS"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                        <span>রিফ্রেশ GPS</span>
                      </button>

                      <button
                        onClick={clearUserLocation}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-rose-500/20"
                        title="লোকেশন বন্ধ করুন"
                      >
                        <span>লোকেশন বন্ধ করুন</span>
                      </button>
                    </div>
                  </div>

                  {/* Proximity Distance Radius Chips & Subcategories */}
                  <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    {/* Radius selector */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-400 font-bold mr-1">দূরত্বের পরিধি:</span>
                      {[
                        { radius: 50, label: '৫০ কিমি (খুব কাছে)' },
                        { radius: 100, label: '১০০ কিমি (ডে-ট্রিপ)' },
                        { radius: 200, label: '২০০ কিমি (আশেপাশের জেলা)' },
                        { radius: 0, label: 'পুরো বাংলাদেশ (দূরত্ব অনুযায়ী)' },
                      ].map((item) => (
                        <button
                          key={item.radius}
                          onClick={() => setLocationRadius(item.radius)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                            locationRadius === item.radius
                              ? 'bg-emerald-500 text-slate-950 font-black shadow-glow'
                              : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Popular vs Offbeat toggle inside Nearby */}
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                      <button
                        onClick={() => setNearbyCategoryFilter('all')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                          nearbyCategoryFilter === 'all'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        সকল স্পট
                      </button>
                      <button
                        onClick={() => setNearbyCategoryFilter('popular')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                          nearbyCategoryFilter === 'popular'
                            ? 'bg-amber-500 text-slate-950'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        জনপ্রিয়
                      </button>
                      <button
                        onClick={() => setNearbyCategoryFilter('offbeat')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                          nearbyCategoryFilter === 'offbeat'
                            ? 'bg-purple-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        অফবিট
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Division Quick Filter Chips (Hidden in Nearby mode to keep focus on distance) */}
          {directoryType !== 'nearby' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
              {divisionsList.map((div) => {
                const isSelected = selectedDivision.toLowerCase() === div.id.toLowerCase();
                return (
                  <button
                    key={div.id}
                    onClick={() => setSelectedDivision(div.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-[#0B1E16] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-900/40 hover:border-emerald-500/50'
                    }`}
                  >
                    <span>{div.nameBn}</span>
                    <span className="opacity-70 text-[11px] ml-1">({div.nameEn})</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Activity Tag Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-none text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1 shrink-0 mr-1">
              <Tag className="w-3 h-3 text-emerald-500" />
              ট্যাগ:
            </span>
            {topTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  selectedTag === tag
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500'
                    : 'bg-slate-100 dark:bg-[#0E241B] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Active Filter Chips Summary */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6 pb-4 border-b border-slate-200 dark:border-emerald-950/60 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 flex-wrap">
              <span>Showing <strong className="text-slate-900 dark:text-white">{filteredSpots.length}</strong> spots</span>
              
              {directoryType === 'nearby' && userLocation && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                  <LocateFixed className="w-3 h-3 text-emerald-400" />
                  <span>কাছের স্পট ({locationRadius === 0 ? 'পুরো বাংলাদেশ' : `${toBengaliNumber(locationRadius)} কিমির ভেতর`})</span>
                </span>
              )}

              {selectedDivision !== 'All' && directoryType !== 'nearby' && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold">
                  {selectedDivision} Division
                </span>
              )}
              {directoryType === 'popular' && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold">
                  Popular Spots
                </span>
              )}
              {directoryType === 'offbeat' && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 font-bold">
                  Offbeat Gems
                </span>
              )}
              {selectedTag !== 'All' && (
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 font-bold">
                  #{selectedTag}
                </span>
              )}
              {searchQuery && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold">
                  "{searchQuery}"
                </span>
              )}
            </div>
          </div>

          {/* Spots Grid */}
          {filteredSpots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredSpots.map((spot) => (
                <DestinationCard 
                  key={spot.id} 
                  spot={spot} 
                  userDistance={spot.userDistance}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-[#0E241B] border border-dashed border-slate-300 dark:border-emerald-800/40">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Compass className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {directoryType === 'nearby' 
                  ? `${locationRadius} কিমির মধ্যে কোনো স্পট পাওয়া যায়নি`
                  : 'No Destinations Found'
                }
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
                {directoryType === 'nearby'
                  ? 'আপনার বর্তমান অবস্থান থেকে এই দূরত্বের মধ্যে কোনো স্পট তালিকাভুক্ত নেই। পরিধি বাড়িয়ে ১০০ কিমি বা ২০০ কিমি নির্বাচন করুন।'
                  : "We couldn't find any spots matching your current filters. Try selecting a different division or clear your search term."
                }
              </p>
              {directoryType === 'nearby' ? (
                <button
                  onClick={() => setLocationRadius(locationRadius === 50 ? 100 : 0)}
                  className="mt-5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow transition-all"
                >
                  দূরত্বের পরিধি বৃদ্ধি করুন ({locationRadius === 50 ? '১০০ কিমি' : 'পুরো বাংলাদেশ'})
                </button>
              ) : (
                <button
                  onClick={resetFilters}
                  className="mt-5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow transition-all"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default DestinationsDirectory;
