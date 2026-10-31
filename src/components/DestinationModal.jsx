import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import TransitBreakdown from './TransitBreakdown';
import { 
  X, 
  MapPin, 
  Calendar, 
  Banknote, 
  Utensils, 
  ShieldCheck, 
  Navigation, 
  Bookmark, 
  Star, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Car
} from 'lucide-react';

const DestinationModal = () => {
  const { activeModalSpot, setActiveModalSpot, bookmarks, toggleBookmark, planRouteTo } = useApp();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeModalTab, setActiveModalTab] = useState('overview'); // 'overview' | 'transit'

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModalSpot(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveModalSpot]);

  if (!activeModalSpot) return null;

  const spot = activeModalSpot;
  const isBookmarked = bookmarks.includes(spot.id);


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Click outside backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={() => setActiveModalSpot(null)}
      />

      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0B1E16] border border-slate-200 dark:border-emerald-700/40 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col my-auto">
        
        {/* Top Floating Close & Bookmark buttons */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => toggleBookmark(spot.id)}
            className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all ${
              isBookmarked
                ? 'bg-rose-500 text-white'
                : 'bg-black/50 hover:bg-black/70 text-white'
            }`}
            title={isBookmarked ? 'Saved to bookmarks' : 'Save to bookmarks'}
          >
            <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => setActiveModalSpot(null)}
            className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md shadow-lg transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto p-0">
          
          {/* Hero Image & Gallery Section */}
          <div className="relative h-72 sm:h-96 w-full bg-slate-900">
            <img
              src={spot.gallery ? spot.gallery[activeImageIndex] || spot.heroImage : spot.heroImage}
              alt={spot.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E16] via-[#0B1E16]/30 to-transparent" />

            {/* Title & Info on bottom of hero image */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {spot.district}, {spot.division} Division
                </span>
                
                {spot.category && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold shadow-sm ${
                    spot.category === 'Popular'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-purple-500 text-white'
                  }`}>
                    {spot.category === 'Popular' ? '🔥 পপুলার স্পট' : '✨ অফবিট জেম'}
                  </span>
                )}

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md">
                  {spot.vibe}
                </span>

                <div className="flex items-center gap-1 text-xs font-bold bg-amber-500/90 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{spot.rating}</span>
                  <span className="opacity-75">({spot.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {spot.name}
                </h2>
                <span className="font-bengali text-lg sm:text-2xl font-bold text-emerald-400">
                  {spot.bengaliName}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl font-medium">
                {spot.tagline}
              </p>

              {/* Tags */}
              {spot.tags && spot.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {spot.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-black/40 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tab Bar inside Modal: Overview vs Step-by-Step Transit */}
          <div className="flex items-center gap-2 px-6 pt-3 pb-2 bg-slate-100 dark:bg-[#07130E] border-b border-slate-200 dark:border-emerald-950/60 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveModalTab('overview')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeModalTab === 'overview'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Overview, Food & Budget (সারসংক্ষেপ)
            </button>
            <button
              onClick={() => setActiveModalTab('transit')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeModalTab === 'transit'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Step-by-Step Transit (লোকাল গাড়ি ও ভাড়া)</span>
            </button>
          </div>

          {/* Modal Main Body */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {activeModalTab === 'transit' ? (
              <TransitBreakdown spot={spot} />
            ) : (
              <>
                {/* Description */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    About This Destination
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {spot.description}
                  </p>
                </div>

                {/* Key Highlights Grid */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-3">
                    Top Experiences & Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {spot.highlights.map((hl, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Time to Visit & Ideal Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Best Time to Visit</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {spot.bestTimeToVisit}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40">
                    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span>Recommended Duration</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {spot.idealDuration}
                    </p>
                  </div>
                </div>

                {/* Estimated Budget per Person (Budget vs Luxury) */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-amber-500" />
                    Estimated Budget per Person
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Budget */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Backpacker / Budget</div>
                      <div className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                        {spot.budget.backpacker}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Hostels/cottages, shared transit (Chander Gari / CNG), local eateries.
                      </p>
                    </div>

                    {/* Standard */}
                    <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/30">
                      <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">Standard Traveler</div>
                      <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                        {spot.budget.standard}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                        Mid-tier resort, AC bus/express train, good restaurants, guided trips.
                      </p>
                    </div>

                    {/* Luxury */}
                    <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30">
                      <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Luxury / Premium</div>
                      <div className="text-lg sm:text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                        {spot.budget.luxury}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                        Premium eco-cottages, private reserved 4x4, flights, seafood BBQs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Local Food Specialties to Try */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-rose-500" />
                    Local Food Specialties to Try
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {spot.localFoods.map((food, i) => (
                      <div 
                        key={i} 
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40 hover:border-emerald-500/50 transition-colors"
                      >
                        <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          {food.name}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                          {food.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Tips & Local Cultural Etiquettes */}
                <div className="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30">
                  <h3 className="text-base font-bold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                    Safety Tips & Cultural Etiquettes
                  </h3>
                  <ul className="space-y-2.5">
                    {spot.safetyTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

          </div>

          {/* Sticky Modal Bottom Actions */}
          <div className="sticky bottom-0 p-4 sm:p-6 bg-white/95 dark:bg-[#0B1E16]/95 border-t border-slate-200 dark:border-emerald-900/50 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
              <span>Looking for transport options? Check routes from Dhaka, Chittagong & Sylhet.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  planRouteTo(spot.id);
                  setActiveModalSpot(null);
                }}
                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-glow flex items-center justify-center gap-2 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Plan Transport to {spot.name}</span>
              </button>

              <button
                onClick={() => setActiveModalSpot(null)}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DestinationModal;
