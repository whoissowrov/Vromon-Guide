import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Camera, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  Maximize2,
  Filter,
  Flame,
  ShieldCheck,
  Lock
} from 'lucide-react';

const CommunityPhotosModal = () => {
  const { 
    activePhotoSpot, 
    setActivePhotoSpot, 
    getSpotPhotos, 
    likedPhotos,
    togglePhotoLike,
    openLiveVerification
  } = useApp();

  // Active Lightbox Photo Index (null if lightbox closed)
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // Gallery Sort Filter: 'all' | 'verified' | 'popular' | 'traveler'
  const [filterMode, setFilterMode] = useState('all');

  // Close Lightbox or Modal on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) {
          setLightboxIndex(null);
          setIsZoomed(false);
          setZoomScale(1);
        } else if (activePhotoSpot) {
          setActivePhotoSpot(null);
        }
      } else if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') {
          handleNextPhoto();
        } else if (e.key === 'ArrowLeft') {
          handlePrevPhoto();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, activePhotoSpot]);

  if (!activePhotoSpot) return null;

  const spot = activePhotoSpot;
  const rawPhotos = getSpotPhotos(spot);

  // Filter & Sort photos
  let photos = [...rawPhotos];
  if (filterMode === 'popular') {
    photos.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (filterMode === 'verified') {
    photos = photos.filter(p => p.isLiveVerified);
    if (photos.length === 0) photos = [...rawPhotos]; // fallback if none yet
  } else if (filterMode === 'traveler') {
    photos = photos.filter(p => p.isUserUploaded);
    if (photos.length === 0) photos = [...rawPhotos]; // fallback if none yet
  }

  const currentLightboxPhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;

  const handleNextPhoto = () => {
    setIsZoomed(false);
    setZoomScale(1);
    setLightboxIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setIsZoomed(false);
    setZoomScale(1);
    setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const toggleZoom = () => {
    if (isZoomed) {
      setIsZoomed(false);
      setZoomScale(1);
    } else {
      setIsZoomed(true);
      setZoomScale(1.8);
    }
  };

  return (
    <>
      {/* ================= MAIN MASONRY GALLERY MODAL ================= */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
        {/* Backdrop click to close */}
        <div 
          className="fixed inset-0" 
          onClick={() => setActivePhotoSpot(null)}
        />

        <div className="relative w-full max-w-6xl bg-white dark:bg-[#07130E] border border-slate-200 dark:border-emerald-700/40 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[94vh] flex flex-col my-auto">
          
          {/* Header Bar */}
          <div className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0B1E16] border-b border-slate-200 dark:border-emerald-950/60 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-800/40 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-emerald-500" />
                  Real Community Gallery
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {photos.length}টি আসল ছবি
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {spot.name}
                </h2>
                <span className="font-bengali text-sm sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  ({spot.bengaliName})
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>{spot.district}, {spot.division} Division</span>
              </div>
            </div>

            {/* Actions: Take Live Photo Verification Button + Close Button */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => openLiveVerification(spot)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-glow flex items-center gap-2 transition-all transform hover:scale-102 active:scale-98"
                title="Strict Rear Live Camera & 5km GPS Verification"
              >
                <Camera className="w-4 h-4" />
                <span>Take Live Photo & Geoverify (৫ কিমি GPS)</span>
              </button>

              <button
                onClick={() => setActivePhotoSpot(null)}
                className="p-2.5 rounded-2xl bg-slate-200/80 hover:bg-slate-300 dark:bg-emerald-950/80 dark:hover:bg-emerald-900/80 text-slate-700 dark:text-slate-200 transition-colors"
                aria-label="Close community photos"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader Filter Bar & Tips */}
          <div className="px-5 sm:px-6 py-2.5 bg-slate-100/70 dark:bg-[#0A1A13] border-b border-slate-200/70 dark:border-emerald-950/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-slate-500 dark:text-slate-400">ফিল্টার:</span>
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filterMode === 'all'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-white dark:bg-[#122820] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#18362b]'
                }`}
              >
                সব ছবি ({rawPhotos.length})
              </button>
              <button
                onClick={() => setFilterMode('verified')}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  filterMode === 'verified'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-white dark:bg-[#122820] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#18362b]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>ভেরিফায়েড লাইভ</span>
              </button>
              <button
                onClick={() => setFilterMode('popular')}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  filterMode === 'popular'
                    ? 'bg-amber-500 text-white font-bold'
                    : 'bg-white dark:bg-[#122820] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#18362b]'
                }`}
              >
                <Flame className="w-3 h-3 fill-current" />
                <span>বেশি জনপ্রিয়</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic hidden sm:block">
              💡 ছবিতে ক্লিক করে লাইটবক্স প্রিভিউ ও জুম (Zoom) করে বিস্তারিত দেখুন
            </p>
          </div>

          {/* Masonry Gallery Grid Container */}
          <div className="overflow-y-auto p-4 sm:p-6 flex-1">
            {photos.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                  এখনো কোনো ছবি নেই
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  আপনি কি বর্তমানে {spot.name}-এ আছেন? ৫ কিমি জিওফেন্স ও লাইভ রিয়ার ক্যামেরা দিয়ে প্রথম ভেরিফায়েড ছবি আপলোড করুন!
                </p>
                <button
                  onClick={() => openLiveVerification(spot)}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-glow flex items-center gap-2 mx-auto transition-transform hover:scale-102"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take Live Photo & Geoverify</span>
                </button>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 md:columns-3 gap-4 [column-fill:_balance]">
                {photos.map((photo, index) => {
                  const isLiked = likedPhotos.includes(photo.id);
                  const effectiveLikes = (photo.likes || 0) + (isLiked ? 1 : 0);

                  return (
                    <div
                      key={photo.id || index}
                      onClick={() => {
                        setLightboxIndex(index);
                        setIsZoomed(false);
                        setZoomScale(1);
                      }}
                      className="break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-200/80 dark:border-emerald-900/30 shadow-md hover:shadow-2xl hover:border-emerald-500/60 transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Image */}
                      <div className="w-full relative overflow-hidden bg-slate-800">
                        <img
                          src={photo.url}
                          alt={photo.caption || spot.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                      </div>

                      {/* Top Badges: Photographer & User Upload indicator */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white/90 border border-white/10 shadow-sm truncate max-w-[75%]">
                          <User className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{photo.photographer}</span>
                        </div>

                        {photo.isLiveVerified ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black shadow-md flex items-center gap-1 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-slate-950" />
                            <span>ভেরিফায়েড লাইভ</span>
                          </span>
                        ) : photo.isUserUploaded ? (
                          <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-extrabold shadow-sm flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>কমিউনিটি</span>
                          </span>
                        ) : null}
                      </div>

                      {/* Bottom Info Overlay */}
                      <div className="absolute bottom-0 inset-x-0 p-3.5 z-10 text-white">
                        <p className="text-xs font-medium text-slate-100 line-clamp-2 mb-2 group-hover:text-white transition-colors">
                          "{photo.caption}"
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/15">
                          <div className="flex items-center gap-1 text-slate-300">
                            <Calendar className="w-3 h-3 text-emerald-400" />
                            <span>{photo.date}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Like Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePhotoLike(photo.id);
                              }}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                                isLiked 
                                  ? 'bg-rose-500 text-white' 
                                  : 'bg-black/40 hover:bg-black/60 text-white/80'
                              }`}
                              title={isLiked ? 'Liked' : 'Like photo'}
                            >
                              <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                              <span>{effectiveLikes}</span>
                            </button>

                            <span className="p-1 rounded-lg bg-emerald-600/80 group-hover:bg-emerald-500 text-white transition-colors">
                              <Maximize2 className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sticky Bottom Community Contribution Bar */}
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#0B1E16] border-t border-slate-200 dark:border-emerald-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Camera className="w-4 h-4 text-emerald-500" />
              <span>
                <strong>ভ্রমণ অভিজ্ঞতা শেয়ার করুন:</strong> ফিল্টার ছাড়া তোলা আসল ছবি অন্য ভ্রমণকারীদের সবচেয়ে বেশি সাহায্য করে।
              </span>
            </div>

            <button
              onClick={() => openLiveVerification(spot)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-glow transition-all whitespace-nowrap w-full sm:w-auto justify-center"
            >
              <Camera className="w-4 h-4" />
              <span>Take Live Photo & Geoverify (৫ কিমি GPS)</span>
            </button>
          </div>

        </div>
      </div>

      {/* ================= FULLSCREEN LIGHTBOX PREVIEW ================= */}
      {currentLightboxPhoto && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between animate-fadeIn select-none">
          
          {/* Top Bar: Counter, Photographer Info, Zoom & Close */}
          <div className="p-4 sm:p-6 flex items-center justify-between gap-4 z-20 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs sm:text-sm font-semibold backdrop-blur-md">
                {lightboxIndex + 1} / {photos.length}
              </span>

              <div className="text-white hidden sm:block">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-300">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentLightboxPhoto.photographer}</span>
                  {currentLightboxPhoto.isUserUploaded && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-white">
                      Community
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{currentLightboxPhoto.date} • {spot.name}</span>
                </div>
              </div>
            </div>

            {/* Controls: Zoom, Like, Close */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Zoom Button */}
              <button
                onClick={toggleZoom}
                className={`p-2.5 rounded-full text-white backdrop-blur-md transition-all ${
                  isZoomed
                    ? 'bg-emerald-500 text-white shadow-glow'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                title={isZoomed ? 'Zoom Out (Reset)' : 'Zoom In (180%)'}
                aria-label="Toggle zoom"
              >
                {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </button>

              {/* Heart/Like Button */}
              <button
                onClick={() => togglePhotoLike(currentLightboxPhoto.id)}
                className={`p-2.5 rounded-full text-white backdrop-blur-md transition-all ${
                  likedPhotos.includes(currentLightboxPhoto.id)
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                title="Like photo"
              >
                <Heart className={`w-5 h-5 ${likedPhotos.includes(currentLightboxPhoto.id) ? 'fill-current' : ''}`} />
              </button>

              {/* View in New Tab */}
              <a
                href={currentLightboxPhoto.url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
                title="Open original high-res photo"
              >
                <ExternalLink className="w-5 h-5" />
              </a>

              {/* Close Button */}
              <button
                onClick={() => {
                  setLightboxIndex(null);
                  setIsZoomed(false);
                  setZoomScale(1);
                }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Image Container with Navigation & Zoom */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
            
            {/* Prev Photo Button */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-2 sm:left-6 z-30 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Next Photo Button */}
            <button
              onClick={handleNextPhoto}
              className="absolute right-2 sm:right-6 z-30 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Zoomable Image Wrapper */}
            <div 
              className={`relative max-w-full max-h-full flex items-center justify-center transition-transform duration-300 ${
                isZoomed ? 'overflow-auto cursor-zoom-out p-4' : 'cursor-zoom-in'
              }`}
              onClick={toggleZoom}
            >
              <img
                src={currentLightboxPhoto.url}
                alt={currentLightboxPhoto.caption}
                referrerPolicy="no-referrer"
                style={{
                  transform: isZoomed ? `scale(${zoomScale})` : 'scale(1)',
                  transition: 'transform 0.3s ease'
                }}
                className={`max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl transition-all ${
                  isZoomed ? 'max-w-none max-h-none' : ''
                }`}
              />
            </div>
          </div>

          {/* Bottom Bar: Caption, Credit & Instructions */}
          <div className="p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 text-center sm:text-left">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                {currentLightboxPhoto.isLiveVerified && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold mb-2 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{currentLightboxPhoto.verifiedBadge || '✅ ভেরিফায়েড লাইভ ফটো (Verified on Location)'}</span>
                    {currentLightboxPhoto.distanceKm !== null && (
                      <span className="opacity-80 font-normal">({currentLightboxPhoto.distanceKm} কিমি দূরত্বে)</span>
                    )}
                  </div>
                )}
                <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  "{currentLightboxPhoto.caption}"
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5 text-xs text-slate-400">
                  <span>📸 ফটোগ্রাফার: <strong className="text-emerald-400">{currentLightboxPhoto.photographer}</strong></span>
                  <span>•</span>
                  <span>{currentLightboxPhoto.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3 h-3 text-emerald-500" />
                    {spot.name}, {spot.district}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 shrink-0">
                {isZoomed ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                    🔎 জুম সক্রিয় (ক্লিক করে রিসেট করুন)
                  </span>
                ) : (
                  <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/10 text-slate-300">
                    💡 ছবিতে ক্লিক করুন বা <strong>Zoom In</strong> চাপুন
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default CommunityPhotosModal;
