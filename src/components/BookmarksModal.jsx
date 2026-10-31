import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Bookmark, 
  Trash2, 
  ArrowUpRight, 
  Navigation, 
  MapPin, 
  Star 
} from 'lucide-react';

const BookmarksModal = () => {
  const { 
    isBookmarksOpen, 
    setIsBookmarksOpen, 
    bookmarks, 
    toggleBookmark, 
    destinationsData, 
    setActiveModalSpot, 
    planRouteTo 
  } = useApp();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsBookmarksOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsBookmarksOpen]);

  if (!isBookmarksOpen) return null;

  const bookmarkedSpots = destinationsData.filter(spot => bookmarks.includes(spot.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      {/* Click outside to close */}
      <div 
        className="fixed inset-0" 
        onClick={() => setIsBookmarksOpen(false)} 
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#0B1E16] h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-emerald-800/40">
        
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-emerald-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Saved Destinations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {bookmarkedSpots.length} {bookmarkedSpots.length === 1 ? 'place' : 'places'} bookmarked
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBookmarksOpen(false)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-emerald-900/50 text-slate-500 dark:text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {bookmarkedSpots.length > 0 ? (
            bookmarkedSpots.map((spot) => (
              <div
                key={spot.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40 flex gap-3.5 group hover:border-emerald-500/50 transition-all"
              >
                <img
                  src={spot.heroImage}
                  alt={spot.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                        {spot.name}
                      </h4>
                      <button
                        onClick={() => toggleBookmark(spot.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-500" />
                      <span>{spot.district}, {spot.division}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 mt-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{spot.rating}</span>
                      <span className="text-slate-400 font-normal">({spot.vibe})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/50 dark:border-emerald-950/60">
                    <button
                      onClick={() => {
                        setActiveModalSpot(spot);
                        setIsBookmarksOpen(false);
                      }}
                      className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <button
                      onClick={() => {
                        planRouteTo(spot.id);
                        setIsBookmarksOpen(false);
                      }}
                      className="text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Routes</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 dark:bg-emerald-950/50 flex items-center justify-center text-slate-400">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">
                No Bookmarked Spots Yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Click the bookmark icon on any destination card to save your dream travel spots for quick reference.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {bookmarkedSpots.length > 0 && (
          <div className="p-5 border-t border-slate-200 dark:border-emerald-950/60 bg-slate-50 dark:bg-[#07130E]">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Your bookmarks are saved locally on this browser.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookmarksModal;
