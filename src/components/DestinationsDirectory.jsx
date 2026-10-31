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
  Gem,
  Tent,
  Layers,
  Tag
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

  // Master Category Filter: 'all' | 'popular' | 'offbeat' | 'showcase'
  const [directoryType, setDirectoryType] = useState('all');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'reviews' | 'name'
  const [selectedTag, setSelectedTag] = useState('All');

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
    return destinationsData.filter((spot) => {
      // Category filter (Popular vs Offbeat)
      if (directoryType === 'popular' && spot.category !== 'Popular') return false;
      if (directoryType === 'offbeat' && spot.category !== 'Offbeat') return false;

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

      // Division
      const matchesDivision = selectedDivision === 'All' || spot.division.toLowerCase() === selectedDivision.toLowerCase();

      // Vibe
      const matchesVibe = selectedVibe === 'All' || 
        spot.vibe.toLowerCase() === selectedVibe.toLowerCase() ||
        (spot.vibes && spot.vibes.some(v => v.toLowerCase() === selectedVibe.toLowerCase()));

      // Tag
      const matchesTag = selectedTag === 'All' || (spot.tags && spot.tags.includes(selectedTag));

      return matchesSearch && matchesDivision && matchesVibe && matchesTag;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [destinationsData, directoryType, searchQuery, selectedDivision, selectedVibe, selectedTag, sortBy]);

  const hasActiveFilters = searchQuery !== '' || selectedDivision !== 'All' || selectedVibe !== 'All' || selectedTag !== 'All' || directoryType !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDivision('All');
    setSelectedVibe('All');
    setSelectedTag('All');
    setDirectoryType('all');
    setSortBy('rating');
  };

  return (
    <section id="destinations" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Master 4-Way Segmented Filter Control */}
      <div className="flex justify-center mb-8">
        <div className="p-1.5 rounded-2xl bg-slate-200/90 dark:bg-[#0B1E16] border border-slate-300 dark:border-emerald-800/40 shadow-md inline-flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          
          {/* All Spots */}
          <button
            onClick={() => setDirectoryType('all')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
              directoryType === 'all'
                ? 'bg-emerald-600 text-white shadow-glow'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-300" />
            <span>সকল স্পট (All 52 Spots)</span>
          </button>

          {/* Popular Spots */}
          <button
            onClick={() => setDirectoryType('popular')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
              directoryType === 'popular'
                ? 'bg-amber-500 text-slate-950 shadow-glow'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-900" />
            <span>পপুলার স্পট (Popular - 20)</span>
          </button>

          {/* Offbeat Gems */}
          <button
            onClick={() => setDirectoryType('offbeat')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
              directoryType === 'offbeat'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Gem className="w-4 h-4 text-purple-300" />
            <span>অফবিট জেমস (Offbeat - 32)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
              NEW
            </span>
          </button>

          {/* Deep Offbeat Showcase */}
          <button
            onClick={() => setDirectoryType('showcase')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 ${
              directoryType === 'showcase'
                ? 'bg-teal-600 text-white shadow-glow'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Tent className="w-4 h-4 text-teal-300" />
            <span>ক্যাম্পিং ও হোমস্টে শোকেস</span>
          </button>

        </div>
      </div>

      {/* RENDER DEEP SHOWCASE VIEW IF SELECTED */}
      {directoryType === 'showcase' ? (
        <HiddenGemsSection onSelectTransitSpot={onSelectTransitSpot} />
      ) : (
        /* RENDER 8 DIVISIONS DIRECTORY */
        <div>
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>8-Division Master Dataset (৮টি প্রশাসনিক বিভাগ)</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {directoryType === 'popular' && 'Top Popular Tourist Destinations (জনপ্রিয় পর্যটন কেন্দ্র)'}
                {directoryType === 'offbeat' && 'Authentic Offbeat Hidden Gems (গোপন ও নির্জন অফবিট স্পট)'}
                {directoryType === 'all' && 'Bangladesh Master Travel Directory (সকল দর্শনীয় স্থান)'}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
                চট্টগ্রাম, সিলেট, খুলনা, বরিশাল, রাজশাহী, রংপুর, ঢাকা ও ময়মনসিংহ—আসল লোকাল বাহন ও সঠিক ভাড়ার হিসাব।
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
                  <option value="rating" className="dark:bg-[#0B1E16]">Highest Rated</option>
                  <option value="reviews" className="dark:bg-[#0B1E16]">Most Popular</option>
                  <option value="name" className="dark:bg-[#0B1E16]">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Division Quick Filter Chips */}
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
              {selectedDivision !== 'All' && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold">
                  {selectedDivision} Division
                </span>
              )}
              {directoryType !== 'all' && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 font-bold">
                  Category: {directoryType === 'popular' ? 'Popular' : 'Offbeat Gems'}
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
