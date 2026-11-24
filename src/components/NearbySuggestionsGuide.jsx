import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { toBengaliNumber, getGoogleMapsDirectionsUrl } from '../utils/geolocation';
import localFoodsData from '../data/localFoodsData.json';
import { 
  Flame, 
  Gem, 
  Compass, 
  MapPin, 
  Calendar, 
  Car, 
  Banknote, 
  Utensils, 
  Navigation, 
  ExternalLink, 
  Star, 
  Sparkles, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  LocateFixed, 
  RefreshCw, 
  Sun, 
  Sunset, 
  Camera, 
  Lightbulb,
  Radio,
  MapPinned
} from 'lucide-react';

const NearbySuggestionsGuide = () => {
  const { 
    userLocation, 
    destinationsData, 
    locationRadius, 
    setLocationRadius, 
    enableUserLocation, 
    clearUserLocation, 
    getSpotDistance,
    setActiveModalSpot,
    setActivePhotoSpot,
    planRouteTo,
    openLiveVerification
  } = useApp();

  const [activeTab, setActiveTab] = useState('popular'); // 'popular' | 'offbeat' | 'itinerary' | 'foods'

  // Calculate distances and categorize
  const { popularSpots, offbeatSpots, allNearbySpots, nearestDivision } = useMemo(() => {
    if (!userLocation) {
      return { popularSpots: [], offbeatSpots: [], allNearbySpots: [], nearestDivision: 'Dhaka' };
    }

    const calculated = destinationsData.map(spot => {
      const dist = getSpotDistance(spot);
      return {
        ...spot,
        userDistance: dist
      };
    });

    // Filter by radius (if radius > 0)
    const inRadius = calculated.filter(spot => {
      if (spot.userDistance === null) return false;
      if (locationRadius > 0 && spot.userDistance > locationRadius) return false;
      return true;
    }).sort((a, b) => a.userDistance - b.userDistance);

    const popular = inRadius.filter(s => s.category === 'Popular');
    const offbeat = inRadius.filter(s => s.category === 'Offbeat');

    // Detect closest division based on closest spot
    const nearestDivision = inRadius[0]?.division || 'Dhaka';

    return {
      popularSpots: popular,
      offbeatSpots: offbeat,
      allNearbySpots: inRadius,
      nearestDivision
    };
  }, [userLocation, destinationsData, locationRadius, getSpotDistance]);

  // Match regional foods
  const regionalFoods = useMemo(() => {
    if (!nearestDivision) return [];
    return localFoodsData.filter(food => 
      food.division.toLowerCase() === nearestDivision.toLowerCase()
    ).slice(0, 4);
  }, [nearestDivision]);

  if (!userLocation) return null;

  return (
    <div className="mb-12 rounded-3xl bg-gradient-to-br from-[#0B1E16] via-[#07130E] to-[#040C09] border border-emerald-500/40 shadow-2xl overflow-hidden backdrop-blur-xl">
      
      {/* Top Proximity Radar Status Bar */}
      <div className="p-5 sm:p-6 border-b border-emerald-800/40 bg-emerald-950/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-glow">
                <LocateFixed className="w-6 h-6 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 tracking-wide uppercase">
                  {userLocation.isManual ? 'নির্বাচিত শহর' : '🟢 লাইভ GPS সক্রিয়'}
                </span>
                <span className="text-xs text-slate-400">
                  {userLocation.areaName} ({userLocation.lat.toFixed(3)}°N, {userLocation.lng.toFixed(3)}°E)
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                আপনার আশেপাশের ভ্রমণ গাইড ও সাজেস্ট করা স্পট
              </h3>
            </div>
          </div>

          {/* Quick Actions & Radius Controller */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-emerald-500/30 text-xs">
              <span className="text-slate-400 font-bold px-2 hidden sm:inline">পরিধি:</span>
              {[
                { r: 50, label: '৫০ কিমি' },
                { r: 100, label: '১০০ কিমি' },
                { r: 200, label: '২০০ কিমি' },
                { r: 0, label: 'সব স্পট' },
              ].map(item => (
                <button
                  key={item.r}
                  onClick={() => setLocationRadius(item.r)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    locationRadius === item.r
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => enableUserLocation()}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10"
              title="রিলোড বা রিফ্রেশ GPS"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">রিফ্রেশ</span>
            </button>

            <button
              onClick={clearUserLocation}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all border border-rose-500/20"
              title="লোকেশন বন্ধ করুন"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>

        {/* Suggestion Metrics Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{toBengaliNumber(popularSpots.length)}টি জনপ্রিয় পর্যটন কেন্দ্র</span>
          </span>

          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold flex items-center gap-1.5">
            <Gem className="w-3.5 h-3.5" />
            <span>{toBengaliNumber(offbeatSpots.length)}টি গোপন ও নির্জন অফবিট স্থান</span>
          </span>

          {regionalFoods.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" />
              <span>{toBengaliNumber(regionalFoods.length)}টি আঞ্চলিক ঐতিহ্যবাহী খাবার</span>
            </span>
          )}
        </div>
      </div>

      {/* Suggestion Navigation Tabs */}
      <div className="flex items-center gap-1 p-2 bg-black/40 border-b border-emerald-900/50 overflow-x-auto scrollbar-none text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('popular')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'popular'
              ? 'bg-amber-500 text-slate-950 shadow-glow font-black'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Flame className="w-4 h-4 fill-current" />
          <span>কাছের জনপ্রিয় স্পট ({popularSpots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('offbeat')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'offbeat'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow font-black'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Gem className="w-4 h-4" />
          <span>কাছের লোকাল ও অফবিট জেমস ({offbeatSpots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('itinerary')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'itinerary'
              ? 'bg-emerald-600 text-white shadow-glow font-black'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-300" />
          <span>স্মার্ট ডে-ট্রিপ প্ল্যান ও পরামর্শ</span>
        </button>

        <button
          onClick={() => setActiveTab('foods')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'foods'
              ? 'bg-rose-600 text-white shadow-glow font-black'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>আশেপাশের বিখ্যাত খাবার ({regionalFoods.length})</span>
        </button>
      </div>

      {/* Tab 1: Popular Tourist Spots Nearby */}
      {activeTab === 'popular' && (
        <div className="p-5 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>আপনার অঞ্চলের শীর্ষ জনপ্রিয় দর্শনীয় স্থানসমূহ</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                পর্যটকদের সবচেয়ে পছন্দের এবং সহজে যাতায়াতযোগ্য প্রধান পর্যটন কেন্দ্রগুলো।
              </p>
            </div>
          </div>

          {popularSpots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularSpots.map(spot => (
                <NearbySuggestionCard 
                  key={spot.id} 
                  spot={spot} 
                  userLocation={userLocation}
                  setActiveModalSpot={setActiveModalSpot}
                  setActivePhotoSpot={setActivePhotoSpot}
                  planRouteTo={planRouteTo}
                  openLiveVerification={openLiveVerification}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-2xl bg-white/5 border border-dashed border-white/10">
              <Compass className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-300 font-bold">
                এই দূরত্বের মধ্যে কোনো জনপ্রিয় স্পট পাওয়া যায়নি।
              </p>
              <button
                onClick={() => setLocationRadius(locationRadius === 50 ? 100 : 0)}
                className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                দূরত্বের পরিধি বাড়িয়ে ১০০ কিমি বা পুরো বাংলাদেশ দেখুন
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Local & Offbeat Hidden Gems Nearby */}
      {activeTab === 'offbeat' && (
        <div className="p-5 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <Gem className="w-5 h-5 text-purple-400" />
                <span>কাছের নির্জন ও অপ্রচলিত অফবিট স্পটসমূহ (Local Hidden Gems)</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                প্রাকৃতিক জলপ্রপাত, গ্রামীণ কাঠের ব্রিজ, নীরব পাহাড় ও শান্ত নদীর তীর যা সাধারণ পর্যটকরা মিস করেন!
              </p>
            </div>
          </div>

          {offbeatSpots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offbeatSpots.map(spot => (
                <NearbySuggestionCard 
                  key={spot.id} 
                  spot={spot} 
                  userLocation={userLocation}
                  setActiveModalSpot={setActiveModalSpot}
                  setActivePhotoSpot={setActivePhotoSpot}
                  planRouteTo={planRouteTo}
                  openLiveVerification={openLiveVerification}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-2xl bg-white/5 border border-dashed border-white/10">
              <Compass className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-300 font-bold">
                এই পরিধির মধ্যে কোনো অফবিট স্পট নেই।
              </p>
              <button
                onClick={() => setLocationRadius(locationRadius === 50 ? 100 : 0)}
                className="mt-3 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
              >
                দূরত্বের পরিধি বাড়িয়ে দেখুন
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Smart Day-Trip Itinerary Plan & Suggestions */}
      {activeTab === 'itinerary' && (
        <div className="p-5 sm:p-8">
          <div className="mb-6">
            <h4 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <span>আপনার অবস্থানের ওপর ভিত্তি করে প্রস্তাবিত ১-দিনের ভ্রমণ পরিকল্পনা</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              আজকের দিনটি যেভাবে সবচেয়ে সুন্দরভাবে উপভোগ করতে পারেন:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Step 1: Morning */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
                <Sun className="w-4 h-4" />
                <span>সকাল (Morning) • প্রাকৃতিক সৌন্দর্য</span>
              </div>
              <h5 className="font-extrabold text-white text-base mb-1">
                {allNearbySpots[0]?.name || 'নিকটবর্তী প্রথম স্পট'}
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                সকালে রোদের তীব্রতা কম থাকতে ঘুরে আসুন সবচেয়ে কাছের এই মনোরম স্থানে ({allNearbySpots[0]?.bengaliName})।
              </p>
              {allNearbySpots[0] && (
                <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <LocateFixed className="w-3 h-3" />
                  <span>দূরত্ব: মাত্র {toBengaliNumber(allNearbySpots[0].userDistance)} কিমি</span>
                </div>
              )}
            </div>

            {/* Step 2: Lunch */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-500/10 to-transparent border border-rose-500/30">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-wider mb-2">
                <Utensils className="w-4 h-4" />
                <span>দুপুর (Noon) • আঞ্চলিক ভুরিভোজ</span>
              </div>
              <h5 className="font-extrabold text-white text-base mb-1">
                {regionalFoods[0]?.nameBn || 'ঐতিহ্যবাহী আঞ্চলিক খাবার'}
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {regionalFoods[0]?.description || 'দুপুরে স্থানীয় বিখ্যাত রেস্তোরাঁয় খাঁটি আঞ্চলিক খাবারের স্বাদ নিন।'}
              </p>
              {regionalFoods[0] && (
                <div className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
                  <Banknote className="w-3 h-3" />
                  <span>মূল্য: {regionalFoods[0].priceRange} ({regionalFoods[0].place})</span>
                </div>
              )}
            </div>

            {/* Step 3: Afternoon / Sunset */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-teal-500/10 to-transparent border border-teal-500/30">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-black uppercase tracking-wider mb-2">
                <Sunset className="w-4 h-4" />
                <span>বিকেল ও সন্ধ্যা (Sunset) • সূর্যাস্ত ও বিশ্রাম</span>
              </div>
              <h5 className="font-extrabold text-white text-base mb-1">
                {allNearbySpots[1]?.name || allNearbySpots[0]?.name}
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                বিকেলের শান্ত মিষ্টি আলোতে সূর্যাস্ত উপভোগ করুন দ্বিতীয় স্পটে গিয়ে ({allNearbySpots[1]?.bengaliName || allNearbySpots[0]?.bengaliName})।
              </p>
              {allNearbySpots[1] && (
                <div className="text-[11px] font-bold text-teal-300 flex items-center gap-1">
                  <LocateFixed className="w-3 h-3" />
                  <span>দূরত্ব: {toBengaliNumber(allNearbySpots[1].userDistance)} কিমি</span>
                </div>
              )}
            </div>
          </div>

          {/* Local Transit & Bargaining Advice */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h5 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
              <Car className="w-4 h-4 text-emerald-400" />
              <span>লোকাল ট্রানজিট ও দরদাম বিষয়ক পরামর্শ (Local Travel Tips):</span>
            </h5>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>ভাড়া নির্ধারণ:</strong> লোকাল অটোরিকশা বা সিএনজিতে ওঠার আগেই গন্তব্য ও যাওয়া-আসার ভাড়া চূড়ান্ত করে নিন।</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>গুগল ম্যাপে ড্রাইভ রুট:</strong> প্রতিটি স্পটের নিচে দেওয়া "গুগল ম্যাপস" বাটনে চাপ দিলে যানজটের লাইভ আপডেট সহ সেরা রুট দেখতে পাবেন।</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>নিরাপত্তা ও স্থানীয় গাইড:</strong> পাহাড় বা বনাঞ্চলের ট্রেইলে গেলে সন্ধ্যার আগে লোকালয়ে ফিরে আসুন।</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 4: Regional Delicacies Nearby */}
      {activeTab === 'foods' && (
        <div className="p-5 sm:p-8">
          <div className="mb-6">
            <h4 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-rose-400" />
              <span>আপনার নিকটবর্তী অঞ্চলের বিখ্যাত খাবার ও মিষ্টি (Local Food Guide)</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              এই অঞ্চলে ভ্রমণে এলে যে খাবারগুলোর স্বাদ নেওয়া একেবারেই হাতছাড়া করা উচিত নয়!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {regionalFoods.map(food => (
              <div 
                key={food.id}
                className="group rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-rose-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {food.image && (
                    <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                      <img
                        src={food.image}
                        alt={food.nameEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-black/80 text-rose-600 dark:text-rose-300 backdrop-blur-md">
                          {food.place} ({food.divisionBn})
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-500 text-white shadow-sm">
                          {food.priceRange}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <div>
                        <h5 className="font-extrabold text-white text-base">
                          {food.nameBn}
                        </h5>
                        <span className="text-xs text-rose-400 font-semibold font-mono">
                          {food.nameEn}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {food.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>কোথায় পাবেন:</strong> {food.shopSpot}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Car className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>যাতায়াত:</strong> {food.localTransit}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {food.mapLinks && food.mapLinks[0] && (
                    <a
                      href={food.mapLinks[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-rose-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>গুগল ম্যাপে লোকেশন দেখুন</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

// Subcomponent: Rich Suggestion Card with full details
const NearbySuggestionCard = ({ 
  spot, 
  userLocation, 
  setActiveModalSpot, 
  setActivePhotoSpot, 
  planRouteTo, 
  openLiveVerification 
}) => {
  const isWithinGeofence = spot.userDistance !== null && spot.userDistance <= 5.0;
  const googleMapsUrl = getGoogleMapsDirectionsUrl(
    userLocation?.lat,
    userLocation?.lng,
    spot.coordinates?.lat,
    spot.coordinates?.lng,
    spot.name
  );

  return (
    <div className="group rounded-3xl overflow-hidden bg-slate-900/90 border border-emerald-800/40 hover:border-emerald-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Card Image with Distance and Category Overlay */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          <img
            src={spot.heroImage}
            alt={spot.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            {/* Distance Pill */}
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black backdrop-blur-md shadow-md flex items-center gap-1 ${
              isWithinGeofence 
                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 animate-pulse'
                : 'bg-teal-500 text-slate-950'
            }`}>
              <LocateFixed className="w-3 h-3" />
              <span>{toBengaliNumber(spot.userDistance)} কিমি দূরে</span>
            </span>

            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
              {spot.district}
            </span>
          </div>

          {/* Bottom Info Pill */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="font-semibold text-emerald-400 bg-black/60 px-2 py-0.5 rounded-lg backdrop-blur-sm">
              {spot.vibe}
            </span>
            <div className="flex items-center gap-1 font-bold bg-black/60 px-2 py-0.5 rounded-lg backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{spot.rating}</span>
            </div>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between mb-1">
            <h5 className="font-extrabold text-base sm:text-lg text-white group-hover:text-emerald-400 transition-colors">
              {spot.name}
            </h5>
            <span className="font-bengali text-xs font-bold text-emerald-400 ml-2 whitespace-nowrap">
              {spot.bengaliName}
            </span>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
            {spot.tagline}
          </p>

          {/* Key Details: Budget, Best Time, Steps */}
          <div className="space-y-1.5 text-xs text-slate-400 mb-3.5">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate"><strong>সেরা সময়:</strong> {spot.bestTimeToVisit.split('(')[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span><strong>বাজেট:</strong> {spot.budget.backpacker} (বাজেট)</span>
            </div>
            {spot.howToGoSteps && spot.howToGoSteps[0] && (
              <div className="flex items-center gap-2 text-emerald-300 font-semibold truncate">
                <Car className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate"><strong>যানবাহন:</strong> {spot.howToGoSteps[0].vehicle} • {spot.howToGoSteps[0].fare}</span>
              </div>
            )}
          </div>

          {/* Geofence Alert */}
          {isWithinGeofence && (
            <div className="mb-3 p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center justify-between">
              <span className="font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                ৫ কিমির ভেতরে আছেন!
              </span>
              <button
                onClick={() => openLiveVerification(spot)}
                className="px-2 py-0.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black"
              >
                ভেরিফাই 📸
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="p-4 sm:p-5 pt-0 border-t border-white/5 flex items-center gap-2">
        <button
          onClick={() => setActiveModalSpot(spot)}
          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1"
        >
          <span>Spot Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1 border border-white/10"
          title="গুগল ম্যাপে ড্রাইভ ও রোডম্যাপ দেখুন"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          <span>ম্যাপস</span>
        </a>

        <button
          onClick={() => planRouteTo(spot.id)}
          className="py-2 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-colors flex items-center gap-1"
          title="লোকাল ট্রানজিট ও ভাড়া হিসাব"
        >
          <Car className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">ভাড়া</span>
        </button>
      </div>
    </div>
  );
};

export default NearbySuggestionsGuide;
