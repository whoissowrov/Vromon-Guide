import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import DestinationCard from './DestinationCard';
import HiddenGemsSection from './HiddenGemsSection';
import { 
  MapPin, 
  Sparkles, 
  SlidersHorizontal, 
  RotateCcw,
  Compass,
  Flame,
  Gem
} from 'lucide-react';

const DestinationsDirectory = ({ onSelectTransitSpot }) => {
  const { 
    destinationsData, 
    searchQuery, 
    setSearchQuery,
    selectedDivision, 
    setSelectedDivision, 
    selectedVibe, 
    setSelectedVibe 
  } = useApp();

  // Simple filter toggle: পপুলার স্পট (Popular) vs অফবিট স্পট (Hidden Gems)
  const [directoryType, setDirectoryType] = useState('popular'); // 'popular' | 'hidden-gems'
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'reviews' | 'name'

  // Filtered & Sorted spots for Popular view
  const filteredSpots = useMemo(() => {
    return destinationsData.filter((spot) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        spot.name.toLowerCase().includes(q) ||
        spot.bengaliName.toLowerCase().includes(q) ||
        spot.district.toLowerCase().includes(q) ||
        spot.division.toLowerCase().includes(q) ||
        spot.vibe.toLowerCase().includes(q) ||
        spot.highlights.some(h => h.toLowerCase().includes(q))
      );

      const matchesDivision = selectedDivision === 'All' || spot.division.toLowerCase() === selectedDivision.toLowerCase();

      const matchesVibe = selectedVibe === 'All' || 
        spot.vibe.toLowerCase() === selectedVibe.toLowerCase() ||
        (spot.vibes && spot.vibes.some(v => v.toLowerCase() === selectedVibe.toLowerCase()));

      return matchesSearch && matchesDivision && matchesVibe;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [destinationsData, searchQuery, selectedDivision, selectedVibe, sortBy]);

  const hasActiveFilters = searchQuery !== '' || selectedDivision !== 'All' || selectedVibe !== 'All';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDivision('All');
    setSelectedVibe('All');
    setSortBy('rating');
  };

  return (
    <section id="destinations" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Popular vs Hidden Gems Master Toggle */}
      <div className="flex justify-center mb-10">
        <div className="p-1.5 rounded-2xl bg-slate-200/90 dark:bg-[#0B1E16] border border-slate-300 dark:border-emerald-800/40 shadow-md inline-flex items-center gap-1 sm:gap-2">
          
          <button
            onClick={() => setDirectoryType('popular')}
            className={`px-5 sm:px-7 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
              directoryType === 'popular'
                ? 'bg-emerald-600 text-white shadow-glow'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>পপুলার স্পট (Popular Spots)</span>
          </button>

          <button
            onClick={() => setDirectoryType('hidden-gems')}
            className={`px-5 sm:px-7 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
              directoryType === 'hidden-gems'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-glow'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Gem className="w-4 h-4 text-emerald-300" />
            <span>অফবিট স্পট (Hidden Gems)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
              NEW
            </span>
          </button>

        </div>
      </div>

      {/* RENDER HIDDEN GEMS VIEW IF SELECTED */}
      {directoryType === 'hidden-gems' ? (
        <HiddenGemsSection onSelectTransitSpot={onSelectTransitSpot} />
      ) : (
        /* RENDER POPULAR 8 DIVISIONS DIRECTORY */
        <div>
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>Destinations Directory (জনপ্রিয় দর্শনীয় স্থান)</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Explore Bangladesh Spots
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
                ৮টি প্রশাসনিক বিভাগের সেরা সব জনপ্রিয় পর্যটন কেন্দ্র।
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
                  <span>Reset Filters</span>
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
                  <option value="rating" className="dark:bg-[#0B1E16]">Highest Rated</option>
                  <option value="reviews" className="dark:bg-[#0B1E16]">Most Popular</option>
                  <option value="name" className="dark:bg-[#0B1E16]">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips Summary */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6 pb-4 border-b border-slate-200 dark:border-emerald-950/60 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span>Showing <strong className="text-slate-900 dark:text-white">{filteredSpots.length}</strong> spots</span>
              {selectedDivision !== 'All' && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold">
                  {selectedDivision} Division
                </span>
              )}
              {selectedVibe !== 'All' && (
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 font-bold">
                  {selectedVibe}
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
                <DestinationCard key={spot.id} spot={spot} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-[#0E241B] border border-dashed border-slate-300 dark:border-emerald-800/40">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Compass className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                No Destinations Found
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
                We couldn't find any spots matching your current filters. Try selecting a different division or clear your search term.
              </p>
              <button
                onClick={resetFilters}
                className="mt-5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

    </section>
  );
};

export default DestinationsDirectory;
