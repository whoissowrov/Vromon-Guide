import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { calculateHaversineDistance, toBengaliNumber } from '../utils/geolocation';
import { 
  X, 
  Camera, 
  MapPin, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  Sparkles, 
  RefreshCw, 
  Clock, 
  Radio, 
  Lock, 
  User, 
  Compass,
  Check,
  Crosshair
} from 'lucide-react';

const GEOFENCE_THRESHOLD_KM = 5.0; // 5 km strict radius

const LivePhotoVerificationModal = () => {
  const { 
    liveVerificationSpot, 
    closeLiveVerification, 
    addCommunityPhoto 
  } = useApp();

  const spot = liveVerificationSpot;

  // GPS Verification States: 'idle' | 'locating' | 'verified' | 'out_of_bounds' | 'permission_denied'
  const [gpsStatus, setGpsStatus] = useState('idle');
  const [userCoords, setUserCoords] = useState(null);
  const [calculatedDistance, setCalculatedDistance] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Camera Capture & Form States
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photographerName, setPhotographerName] = useState('');
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Developer / Demo Testing Simulation Toggle
  const [demoSimulateLocation, setDemoSimulateLocation] = useState(false);

  const fileInputRef = useRef(null);

  // Reset state whenever active spot changes
  useEffect(() => {
    if (spot) {
      setGpsStatus('idle');
      setUserCoords(null);
      setCalculatedDistance(null);
      setErrorMessage('');
      setCapturedPhoto(null);
      setPhotographerName('');
      setCaption('');
      setUploadSuccess(false);
      setDemoSimulateLocation(false);
    }
  }, [spot]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && spot) {
        closeLiveVerification();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spot, closeLiveVerification]);

  if (!spot) return null;

  // Target spot coordinates (fallback to default center if undefined)
  const spotLat = spot.coordinates?.lat ?? 23.8103;
  const spotLng = spot.coordinates?.lng ?? 90.4125;

  /**
   * Request device real-time GPS and verify proximity using Haversine Formula
   */
  const handleVerifyGPSAndOpenLiveCamera = () => {
    setGpsStatus('locating');
    setErrorMessage('');
    setCapturedPhoto(null);

    // If demo simulation mode is explicitly enabled by tester
    if (demoSimulateLocation) {
      setTimeout(() => {
        // Place user within ~0.8 km of the destination
        const simLat = spotLat + 0.005;
        const simLng = spotLng + 0.004;
        const dist = calculateHaversineDistance(simLat, simLng, spotLat, spotLng);
        setUserCoords({ lat: simLat, lng: simLng });
        setCalculatedDistance(dist);
        setGpsStatus('verified');
        // Trigger live rear camera capture
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      }, 700);
      return;
    }

    if (!navigator.geolocation) {
      setGpsStatus('permission_denied');
      setErrorMessage('আপনার ব্রাউজারে GPS জিওলোকেশন সাপোর্ট নেই। অনুগ্রহ করে আধুনিক মোবাইল ব্রাউজার ব্যবহার করুন।');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLat = position.coords.latitude;
        const currentLng = position.coords.longitude;
        setUserCoords({ lat: currentLat, lng: currentLng });

        // Calculate Haversine distance
        const distanceKm = calculateHaversineDistance(
          currentLat,
          currentLng,
          spotLat,
          spotLng
        );
        setCalculatedDistance(distanceKm);

        // Strict Proximity Check: Threshold 5.0 km
        if (distanceKm <= GEOFENCE_THRESHOLD_KM) {
          setGpsStatus('verified');
          // Automatically trigger the device live camera input
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        } else {
          setGpsStatus('out_of_bounds');
          setErrorMessage(
            `❌ আপনি এই স্থানে শারীরিকভাবে উপস্থিত নেই! ${spot.name} এ গিয়েই কেবল লাইভ ছবি আপলোড করা সম্ভব।`
          );
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setGpsStatus('permission_denied');
        // Exact required error message
        setErrorMessage('লোকেশনের অনুমতি ছাড়া ছবি আপলোড করা যাবে না। অনুগ্রহ করে ফোনের GPS চালু করুন।');
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  };

  /**
   * Handle the captured live rear camera image file
   */
  const handleCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Double security check: Ensure GPS was verified within 5 km before processing
    if (gpsStatus !== 'verified') {
      alert(`❌ আপনি এই স্থানে শারীরিকভাবে উপস্থিত নেই! ${spot.name} এ গিয়েই কেবল লাইভ ছবি আপলোড করা সম্ভব।`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setCapturedPhoto(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Final Submit & Save Verified Photo to Community Store
   */
  const handleSubmitVerifiedPhoto = (e) => {
    e.preventDefault();

    if (!capturedPhoto) {
      alert('অনুগ্রহ করে লাইভ ক্যামেরা দিয়ে একটি ছবি তুলুন।');
      return;
    }

    if (gpsStatus !== 'verified' || (calculatedDistance !== null && calculatedDistance > GEOFENCE_THRESHOLD_KM)) {
      alert(`❌ আপনি এই স্থানে শারীরিকভাবে উপস্থিত নেই! ${spot.name} এ গিয়েই কেবল লাইভ ছবি আপলোড করা সম্ভব।`);
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const formattedTimestamp = now.toLocaleString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Add to global store with verified badge and GPS proof
    addCommunityPhoto(spot.id, {
      url: capturedPhoto,
      caption: caption.trim() || `${spot.name}-এ অন-লোকেশন লাইভ ছবি`,
      photographer: photographerName.trim() || 'ভেরিফায়েড ট্রাভেলার',
      date: formattedTimestamp,
      aspectRatio: 'wide',
      isLiveVerified: true,
      verifiedBadge: '✅ ভেরিফায়েড লাইভ ফটো (Verified on Location)',
      distanceKm: calculatedDistance !== null ? Number(calculatedDistance.toFixed(2)) : 0,
      userCoords: userCoords,
      verifiedAt: now.toISOString()
    });

    setIsSubmitting(false);
    setUploadSuccess(true);

    setTimeout(() => {
      closeLiveVerification();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={() => {
          if (!isSubmitting) closeLiveVerification();
        }}
      />

      <div className="relative w-full max-w-xl bg-white dark:bg-[#07130E] border border-slate-200 dark:border-emerald-600/40 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col my-auto transition-all animate-scaleUp">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-slate-900 border-b border-emerald-900/50 text-white relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Camera className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500 text-slate-950 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Live Camera & Geofenced
                  </span>
                  <span className="text-xs text-emerald-300 font-bold">
                    ৫ কিমি জিওফেন্স
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white mt-1">
                  লাইভ ক্যামেরা ভেরিফিকেশন আপলোড
                </h3>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{spot.name} ({spot.bengaliName})</span>
                  <span className="opacity-60">• {spot.district}</span>
                </p>
              </div>
            </div>

            <button
              onClick={closeLiveVerification}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Target GPS Coordinates pill */}
          <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5 font-mono">
              <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
              <span>টার্গেট জিপিএস: {spotLat.toFixed(4)}°N, {spotLng.toFixed(4)}°E</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-black/40 text-emerald-400 font-semibold border border-emerald-500/30">
              সর্বোচ্চ অনুমোদিত রেডিয়াস: ৫ কিমি
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6">

          {/* Success Screen when photo published */}
          {uploadSuccess ? (
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  ভেরিফিকেশন ও আপলোড সফল!
                </h4>
                <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                  ✅ ভেরিফায়েড লাইভ ফটো (Verified on Location)
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                  আপনার তোলা আসল ছবিটি {spot.name}-এর কমিউনিটি গ্যালারিতে লাইভ ব্যাজসহ যুক্ত করা হয়েছে।
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* STRICT SECURITY BANNER */}
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#0B1E16] border border-slate-200 dark:border-emerald-900/60 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>কঠোর সিকিউরিটি ও ভ্যালিডেশন নীতি:</span>
                </div>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 pl-6 list-disc text-[11px] leading-relaxed">
                  <li><strong>শুধুমাত্র লাইভ রিয়ার ক্যামেরা:</strong> গ্যালারি বা ফাইল স্টোরেজ থেকে পুরাতন ছবি আপলোড সম্পূর্ণ নিষিদ্ধ।</li>
                  <li><strong>রিয়েল-টাইম জিপিএস যাচাই:</strong> হাভারসাইন (Haversine) ফর্মুলা দিয়ে স্পটের ৫ কিমি দূরত্বের মধ্যে উপস্থিতি যাচাই বাধ্যতামূলক।</li>
                </ul>
              </div>

              {/* HIDDEN STRICT CAMERA-ONLY FILE INPUT */}
              {/* Force device rear live camera capture with capture="environment" */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
                id="strict-live-camera-input"
              />

              {/* ================= STEP 1: GPS STATUS & ACTION ================= */}
              <div className="space-y-3">
                
                {/* State: IDLE */}
                {gpsStatus === 'idle' && (
                  <div className="text-center p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-emerald-800/60 bg-slate-50 dark:bg-[#0A1A13]">
                    <Compass className="w-10 h-10 text-emerald-500 mx-auto mb-2.5 animate-pulse" />
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                      লাইভ ক্যামেরা চালু করতে জিপিএস যাচাই করুন
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                      নিচের বাটনে চাপ দিলে আপনার ডিভাইসের রিয়েল-টাইম অবস্থান যাচাই হবে এবং স্বয়ংক্রিয়ভাবে রিয়ার ক্যামেরা ওপেন হবে।
                    </p>

                    <button
                      type="button"
                      onClick={handleVerifyGPSAndOpenLiveCamera}
                      className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-glow flex items-center gap-2 mx-auto transition-transform hover:scale-102 active:scale-98"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Live Photo & Upload (লাইভ ছবি তুলুন)</span>
                    </button>
                  </div>
                )}

                {/* State: LOCATING */}
                {gpsStatus === 'locating' && (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-fadeIn">
                    <RefreshCw className="w-8 h-8 text-emerald-500 mx-auto animate-spin" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                        রিয়েল-টাইম জিপিএস সিগন্যাল যাচাই হচ্ছে...
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        হাভারসাইন দূরত্ব গণনার মাধ্যমে {spot.name}-এর ৫ কিমি রেডিয়াসের উপস্থিতি যাচাই করা হচ্ছে
                      </p>
                    </div>
                  </div>
                )}

                {/* State: PERMISSION DENIED or LOCATION OFF */}
                {gpsStatus === 'permission_denied' && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs space-y-2.5 animate-fadeIn">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold text-sm">
                          {errorMessage || 'লোকেশনের অনুমতি ছাড়া ছবি আপলোড করা যাবে না। অনুগ্রহ করে ফোনের GPS চালু করুন।'}
                        </p>
                        <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 mt-1">
                          ফোনের ব্রাউজার সেটিংস থেকে লোকেশন অনুমতি এলাউ (Allow) করে পুনরায় চেষ্টা করুন।
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyGPSAndOpenLiveCamera}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>পুনরায় জিপিএস চেষ্টা করুন</span>
                    </button>
                  </div>
                )}

                {/* State: OUT OF BOUNDS (> 5 km) */}
                {gpsStatus === 'out_of_bounds' && (
                  <div className="p-5 rounded-2xl bg-rose-500/15 border-2 border-rose-500/40 text-rose-900 dark:text-rose-200 text-xs space-y-3 animate-fadeIn">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-rose-700 dark:text-rose-300">
                          {errorMessage}
                        </h4>
                        <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80">
                          অননুমোদিত বা ভুয়া ছবি প্রতিরোধ করতে এই স্পটের ৫ কিলোমিটারের বাইরে থেকে ছবি আপলোড সম্পূর্ণ নিষিদ্ধ।
                        </p>
                      </div>
                    </div>

                    {/* Distance Stats Breakdown */}
                    {calculatedDistance !== null && (
                      <div className="p-3 rounded-xl bg-black/20 font-mono text-[11px] grid grid-cols-2 gap-2 border border-rose-500/20">
                        <div>
                          <span className="opacity-70">আপনার বর্তমান দূরত্ব:</span>
                          <p className="font-bold text-rose-500 dark:text-rose-300 text-sm">
                            {calculatedDistance.toFixed(2)} কিমি
                          </p>
                        </div>
                        <div>
                          <span className="opacity-70">অনুমোদিত সর্বোচ্চ সীমা:</span>
                          <p className="font-bold text-emerald-500 text-sm">
                            ৫.০০ কিমি
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleVerifyGPSAndOpenLiveCamera}
                        className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>পুনরায় লোকেশন চেক করুন</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* State: VERIFIED (<= 5 km) */}
                {gpsStatus === 'verified' && (
                  <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-xs space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span>✅ ভেরিফায়েড লাইভ ফটো (Verified on Location)</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px]">
                        জিপিএস ম্যাচড
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                      <span>স্পট থেকে আপনার দূরত্ব: <strong>{calculatedDistance !== null ? calculatedDistance.toFixed(2) : '০.৫০'} কিমি</strong> (অনুমোদিত: ৫ কিমি)</span>
                      {userCoords && (
                        <span className="font-mono text-[10px] opacity-75">
                          GPS: {userCoords.lat.toFixed(4)}°N, {userCoords.lng.toFixed(4)}°E
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ================= STEP 2: CAMERA CAPTURE PREVIEW & FORM ================= */}
              {gpsStatus === 'verified' && (
                <form onSubmit={handleSubmitVerifiedPhoto} className="space-y-4 animate-fadeIn">
                  
                  {/* Photo Display / Re-take button */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      লাইভ ক্যামেরা ফ্রেম (Live Camera Frame) *
                    </label>

                    {capturedPhoto ? (
                      <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border-2 border-emerald-500 shadow-xl group">
                        <img
                          src={capturedPhoto}
                          alt="Captured Live Frame"
                          className="w-full h-full object-cover"
                        />

                        {/* Real-Time Geofence Watermark Stamp */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] leading-tight space-y-0.5">
                          <p className="font-extrabold text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>✅ ভেরিফায়েড লাইভ ফটো (Verified on Location)</span>
                          </p>
                          <p className="text-slate-200">
                            📍 {spot.name} • দূরত্ব: {calculatedDistance !== null ? calculatedDistance.toFixed(2) : '০.৫০'} কিমি
                          </p>
                          <p className="text-slate-400 font-mono text-[9px]">
                            {new Date().toLocaleString('bn-BD')}
                          </p>
                        </div>

                        {/* Retake Live Photo Button */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 shadow-md transition-all"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>আবার তুলুন</span>
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-emerald-500/60 hover:border-emerald-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-emerald-50/50 dark:bg-emerald-950/20 group"
                      >
                        <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                          <Camera className="w-6 h-6" />
                        </div>
                        <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-emerald-300">
                          রিয়ার ক্যামেরা দিয়ে ছবি তুলতে এখানে ট্যাপ করুন
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          (ডিভাইস ক্যামেরা সরাসরি ওপেন হবে • গ্যালারি নিষিদ্ধ)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Photographer Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      আপনার নাম (Photographer Name) *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tanvir Ahmed / Farhan"
                        value={photographerName}
                        onChange={(e) => setPhotographerName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#0A1A13] border border-slate-200 dark:border-emerald-900/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Caption */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      লাইভ ছবির ক্যাপশন ও অভিজ্ঞতা (Caption & Story) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder={`e.g. ${spot.name}-এ এখনকার আবহাওয়া ও সরাসরি দৃশ্য...`}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#0A1A13] border border-slate-200 dark:border-emerald-900/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={closeLiveVerification}
                      className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      বাতিল
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting || !capturedPhoto}
                      className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-glow flex items-center gap-2 transition-all ${
                        capturedPhoto
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer'
                          : 'bg-slate-300 dark:bg-emerald-950/40 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isSubmitting ? 'আপলোড হচ্ছে...' : 'ভেরিফায়েড ছবি আপলোড করুন'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ================= DEVELOPER TESTING / DEMO SIMULATION ================= */}
              <div className="pt-3 border-t border-slate-200 dark:border-emerald-950/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-amber-500" />
                  <span>সফটওয়্যার টেস্টিং ও ডেমো মোড:</span>
                </div>

                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={demoSimulateLocation}
                    onChange={(e) => {
                      setDemoSimulateLocation(e.target.checked);
                      setGpsStatus('idle');
                      setErrorMessage('');
                    }}
                    className="rounded border-slate-400 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    স্পট লোকেশন সিমুলেট করুন (০.৮ কিমি মধ্যে)
                  </span>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePhotoVerificationModal;

