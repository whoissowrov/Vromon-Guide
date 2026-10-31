import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Bookmark, 
  ArrowUpRight, 
  Navigation, 
  Banknote,
  Utensils,
  Car,
  Flame,
  Sparkles,
  Layers
} from 'lucide-react';

const DestinationCard = ({ spot }) => {
  const { bookmarks, toggleBookmark, setActiveModalSpot, planRouteTo } = useApp();
  const isBookmarked = bookmarks.includes(spot.id);

  const stepsCount = spot.howToGoSteps ? spot.howToGoSteps.length : 0;

  return (
    <div className="group rounded-3xl overflow-hidden glass-card hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image & Badges Container */}
        <div className="relative h-60 w-full overflow-hidden bg-slate-200 dark:bg-emerald-950/60">
          <img
            src={spot.heroImage}
            alt={spot.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Division & Category Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 items-center">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-[#07130E]/90 text-slate-800 dark:text-emerald-300 backdrop-blur-md shadow-sm flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-500" />
              {spot.district}, {spot.division}
            </span>

            {spot.category && (
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-sm flex items-center gap-1 ${
                spot.category === 'Popular'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-purple-600 text-white'
              }`}>
                {spot.category === 'Popular' ? (
                  <>
                    <Flame className="w-3 h-3 fill-current" />
                    <span>পপুলার</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    <span>অফবিট</span>
                  </>
                )}
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(spot.id);
            }}
            className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all duration-200 ${
              isBookmarked
                ? 'bg-emerald-500 text-white'
                : 'bg-black/40 hover:bg-black/60 text-white/90 hover:text-white'
            }`}
            title={isBookmarked ? 'Remove from saved' : 'Save to bookmarks'}
            aria-label="Bookmark destination"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Vibe & Rating Pill in lower image area */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-600/90 font-semibold backdrop-blur-sm">
              {spot.vibe}
            </span>
            <div className="flex items-center gap-1 font-bold bg-black/50 px-2 py-1 rounded-lg backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{spot.rating}</span>
              <span className="text-white/60 text-[10px]">({spot.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6">
          <div className="flex items-baseline justify-between mb-1.5">
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {spot.name}
            </h3>
            <span className="font-bengali text-sm font-semibold text-emerald-700 dark:text-emerald-400/90 ml-2 whitespace-nowrap">
              {spot.bengaliName}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3.5 leading-relaxed">
            {spot.tagline}
          </p>

          {/* Tags (Hills, Water, Heritage, Forest, etc.) */}
          {spot.tags && spot.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3.5">
              {spot.tags.slice(0, 4).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30"
                >
                  #{tag}
                </span>
              ))}
              {spot.tags.length > 4 && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold self-center">
                  +{spot.tags.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Key Quick Info Pills */}
          <div className="space-y-2 mb-4 text-xs font-medium text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate"><strong>সেরা সময়:</strong> {spot.bestTimeToVisit.split('(')[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span><strong>বাজেট:</strong> {spot.budget.backpacker} (বাজেট) • {spot.budget.standard}</span>
            </div>
            {stepsCount > 0 && (
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                <Car className="w-3.5 h-3.5 shrink-0" />
                <span><strong>লোকাল রুট:</strong> {stepsCount} ধাপের ট্রানজিট ও ভাড়া হিসাব</span>
              </div>
            )}
            {spot.localFoods && spot.localFoods[0] && (
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold truncate">
                <Utensils className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate"><strong>খাবার:</strong> {spot.localFoods[0].name} ({spot.localFoods[0].priceRange || spot.localFoods[0].price?.split(';')[0]})</span>
              </div>
            )}
          </div>

          {/* Highlights preview tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {spot.highlights.slice(0, 3).map((hl, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#0E241B] text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-emerald-800/30"
              >
                {hl}
              </span>
            ))}
            {spot.highlights.length > 3 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-bold">
                +{spot.highlights.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 dark:border-emerald-950/40 mt-2 flex items-center gap-2">
        <button
          onClick={() => setActiveModalSpot(spot)}
          className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Spot Guide & Fares</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => planRouteTo(spot.id)}
          className="py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#122820] dark:hover:bg-[#18352b] text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          title="Plan Transport & Route to here"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden sm:inline">How to Go</span>
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;
