import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import routesData from '../data/routes.json';
import destinationsData from '../data/destinations.json';
import { 
  Navigation, 
  Bus, 
  Train, 
  Plane, 
  Car, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ArrowLeftRight, 
  CreditCard, 
  Info, 
  CheckCircle,
  AlertCircle,
  Anchor
} from 'lucide-react';

const RoutePlanner = () => {
  const { routeFrom, setRouteFrom, routeTo, setRouteTo } = useApp();
  const [activeTransitTab, setActiveTransitTab] = useState('bus'); // 'bus' | 'train' | 'air' | 'local'

  const { origins, routes } = routesData;

  // Group destinations by division for the dropdown
  const groupedDestinations = useMemo(() => {
    const groups = {};
    destinationsData.forEach(dest => {
      if (!groups[dest.division]) {
        groups[dest.division] = [];
      }
      groups[dest.division].push(dest);
    });
    return groups;
  }, []);

  const currentOrigin = origins.find(o => o.id === routeFrom) || origins[0];
  const matchedSpot = destinationsData.find(d => d.id === routeTo) || destinationsData[0];

  // Build the route lookup key: e.g. "dhaka_to_sajek-valley"
  const routeKey = `${routeFrom}_to_${routeTo}`;
  const staticRoute = routes[routeKey] || routes[`dhaka_to_${routeTo}`];

  // Dynamic route fallback for any destination in the 52-spot Master Dataset
  const route = staticRoute || {
    summary: `${currentOrigin.name.split('(')[0]} ➔ ${matchedSpot.district} ➔ ${matchedSpot.name}`,
    distance: "স্থানভেদে ১৫০ - ৪৫০ কিমি",
    typicalDuration: "গন্তব্য অনুযায়ী ৫ - ১০ ঘণ্টা",
    overview: matchedSpot.description || matchedSpot.tagline,
    bus: {
      available: true,
      operators: ["শ্যামলী এন আর", "হানিফ এন্টারপ্রাইজ", "এনা পরিবহন", "গ্রীন লাইন", "দেশ ট্রাভেলস", "লোকাল সার্ভিস"],
      fareRange: matchedSpot.howToGoSteps?.[0]?.sharedFare ? `${matchedSpot.howToGoSteps[0].sharedFare} (লোকাল) - ৳১,৫০০ (এসি)` : "৳৪০০ - ৳১,২০০",
      boardingPoints: [currentOrigin.name.split('(')[0] + " সেন্ট্রাল টার্মিনাল", "কাউন্টার পয়েন্ট"],
      droppingPoints: [matchedSpot.district + " বাস টার্মিনাল", "নিকটবর্তী উপজেলা"],
      duration: "৬ - ৯ ঘণ্টা",
      notes: `${matchedSpot.name} পৌঁছানোর জন্য প্রথমে জেলা সদরে পৌঁছে লোকাল যানবাহনে বা শেয়ারিং গাড়িতে কানেক্ট করুন।`
    },
    train: {
      available: true,
      type: "Intermodal (Train + Road)",
      availableTrains: [
        { name: "আন্তঃনগর ট্রেন সার্ভিস", route: `${currentOrigin.name.split('(')[0]} থেকে নিকটবর্তী রেলওয়ে স্টেশন`, time: "সকাল / রাতের শিডিউল", fare: "৳১৫০ - ৳১,২০০" }
      ],
      station: "নিকটবর্তী জংশন বা রেলওয়ে স্টেশন",
      duration: "৪ - ৭ ঘণ্টা",
      bookingTip: "বাংলাদেশ রেলওয়ের অফিসিয়াল ওয়েবসাইট বা অ্যাপ থেকে অগ্রিম টিকিট বুকিং করুন।"
    },
    air: {
      available: ["Chattogram", "Sylhet", "Barishal", "Rajshahi", "Rangpur"].includes(matchedSpot.division),
      airlines: ["বিমান বাংলাদেশ", "ইউএস-বাংলা", "এয়ার অ্যাস্ট্রা"],
      airports: {
        departure: `${currentOrigin.name.split('(')[0]} বিমানবন্দর`,
        arrival: `${matchedSpot.division} আঞ্চলিক বিমানবন্দর`
      },
      fareRange: "৳৩,৫০০ - ৳৮,৫০০",
      duration: "৪৫ - ৫৫ মিনিট",
      notes: "বিমানে পৌঁছে বিমানবন্দর থেকে প্রাইভেট কার বা মাইক্রোবাস রিজার্ভ করে স্পটে যাওয়া যায়।"
    },
    localTransit: {
      modes: matchedSpot.howToGoSteps ? matchedSpot.howToGoSteps.map(s => s.vehicleLabelBn || s.vehicleType).join(', ') : "লোকাল সিএনজি, অটো, বা চাঁদের গাড়ি",
      typicalFares: matchedSpot.howToGoSteps?.[0]?.sharedFare || "লোকাল রেট",
      lastMileInfo: matchedSpot.howToGoSteps?.map(s => `${s.from} ➔ ${s.to}: ${s.vehicleLabelBn} (${s.sharedFare})`).join(' | ') || matchedSpot.tagline,
      scamWarnings: matchedSpot.bargainingTips || ["আগে থেকে দরদাম ঠিক করে উঠুন।"]
    }
  };

  const handleSwap = () => {
    // If the destination happens to be an origin city, allow swap
    const canSwap = origins.some(o => o.id === routeTo);
    if (canSwap) {
      const temp = routeFrom;
      setRouteFrom(routeTo);
      setRouteTo(temp);
    }
  };

  const transitTabs = [
    { id: 'bus', label: 'By Bus', icon: Bus, badge: 'Popular' },
    { id: 'train', label: 'By Train', icon: Train, badge: 'Scenic' },
    { id: 'air', label: 'By Air', icon: Plane, badge: 'Fastest' },
    { id: 'local', label: 'Local & Last-Mile', icon: Car, badge: 'Crucial' },
  ];

  return (
    <section id="route-planner" className="py-16 lg:py-24 bg-slate-100/70 dark:bg-[#071710] border-y border-slate-200 dark:border-emerald-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 mb-2">
            <Navigation className="w-3.5 h-3.5" />
            <span>Smart Route & Transit Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How to Go: Route & Transport Planner
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            Select your starting city and destination to view real-world bus operators, train schedules, air connections, and local 4x4 Chander Gari or boat fares.
          </p>
        </div>

        {/* Route Selector Card */}
        <div className="max-w-4xl mx-auto mb-8 p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#0B1E16] border border-slate-200 dark:border-emerald-800/40 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            
            {/* Origin (From) */}
            <div className="md:col-span-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                From (Starting Point)
              </label>
              <select
                value={routeFrom}
                onChange={(e) => setRouteFrom(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-800/40 text-slate-900 dark:text-white font-bold text-sm sm:text-base focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {origins.map((origin) => (
                  <option key={origin.id} value={origin.id} className="dark:bg-[#0B1E16]">
                    {origin.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button / Arrow Divider */}
            <div className="md:col-span-1 flex justify-center py-1">
              <button
                onClick={handleSwap}
                className="p-3 rounded-full bg-slate-100 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-slate-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-800/30 transition-transform active:rotate-180"
                title="Swap origin and destination"
                aria-label="Swap direction"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* Destination (To) */}
            <div className="md:col-span-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-rose-500" />
                To (Destination)
              </label>
              <select
                value={routeTo}
                onChange={(e) => setRouteTo(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-800/40 text-slate-900 dark:text-white font-bold text-sm sm:text-base focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {Object.keys(groupedDestinations).map((division) => (
                  <optgroup key={division} label={`── ${division} Division ──`} className="font-bold text-slate-500">
                    {groupedDestinations[division].map((dest) => (
                      <option key={dest.id} value={dest.id} className="dark:bg-[#0B1E16] text-slate-900 dark:text-white font-medium">
                        {dest.name} ({dest.bengaliName}) [{dest.category}]
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

          </div>

          {/* Quick Route Highlights Banner */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-emerald-950/60 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">Route:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{route.summary}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>{route.distance}</span>
              </div>
              <div className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{route.typicalDuration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Transit Options Container */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-white dark:bg-[#0B1E16] border border-slate-200 dark:border-emerald-800/40 shadow-xl overflow-hidden">
          
          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 dark:border-emerald-950/60">
            {transitTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTransitTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTransitTab(tab.id)}
                  className={`py-4 px-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all relative ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#0E241B]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-glow" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className="p-6 sm:p-8">
            
            {/* BUS TAB */}
            {activeTransitTab === 'bus' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-emerald-950/60">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Bus className="w-5 h-5 text-emerald-500" />
                      Interdistrict Bus & Luxury Coach Transit
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Estimated travel time: {route.bus.duration}
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-extrabold text-sm">
                    {route.bus.fareRange}
                  </div>
                </div>

                {/* Bus Operators */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Recommended Bus Operators:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {route.bus.operators.map((op, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-[#0E241B] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-emerald-900/40"
                      >
                        {op}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Boarding & Dropping Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      Boarding Points (Departure)
                    </span>
                    <ul className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 space-y-1">
                      {route.bus.boardingPoints.map((pt, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      Dropping Points (Arrival)
                    </span>
                    <ul className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 space-y-1">
                      {route.bus.droppingPoints.map((pt, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/30 flex items-start gap-2.5">
                  <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <strong>Pro Traveler Tip:</strong> {route.bus.notes} Tickets can be booked online via Shohoz, Busbd, or operator counters.
                  </p>
                </div>
              </div>
            )}

            {/* TRAIN TAB */}
            {activeTransitTab === 'train' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-emerald-950/60">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Train className="w-5 h-5 text-emerald-500" />
                      Bangladesh Railway Services
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Transit Type: {route.train.type}
                    </p>
                  </div>
                  {route.train.fares && (
                    <div className="text-xs text-right">
                      <span className="text-slate-500 dark:text-slate-400">Class Fares:</span>
                      <div className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        {route.train.fares.shovon} (Shovon) • {route.train.fares.snigdha} (AC)
                      </div>
                    </div>
                  )}
                </div>

                {/* Available Trains Table / Cards */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    Available Intercity Trains & Timetable:
                  </h4>
                  <div className="space-y-3">
                    {route.train.availableTrains.map((train, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                            <Train className="w-4 h-4 text-emerald-500" />
                            {train.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Route: {train.route}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-medium">
                          <div className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                            {train.time}
                          </div>
                          <div className="font-bold text-slate-800 dark:text-white">
                            {train.fare}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Train Guidelines */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/30 flex items-start gap-2.5">
                  <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <strong>Railway Booking:</strong> {route.train.notes} Online railway tickets open 10 days in advance at 08:00 AM (Eastern zone) and 02:00 PM (Western zone) on <em>eticket.railway.gov.bd</em>.
                  </p>
                </div>
              </div>
            )}

            {/* AIR TAB */}
            {activeTransitTab === 'air' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-emerald-950/60">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Plane className="w-5 h-5 text-emerald-500" />
                      Domestic Air Flights & Airport Connections
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Fastest travel mode to regional hubs
                    </p>
                  </div>
                  {route.air.available && (
                    <div className="px-3.5 py-1.5 rounded-xl bg-teal-500/10 dark:bg-teal-950/40 border border-teal-500/30 text-teal-700 dark:text-teal-300 font-extrabold text-sm">
                      {route.air.fareRange}
                    </div>
                  )}
                </div>

                {route.air.available ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                          Nearest Airport
                        </span>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          {route.air.nearestAirport}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {route.air.distanceFromDestination}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                          Flight Duration & Frequency
                        </span>
                        <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                          {route.air.flightDuration}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Multiple daily flights from Dhaka (DAC)
                        </div>
                      </div>
                    </div>

                    {/* Airlines */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Operating Domestic Airlines:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {route.air.airlines.map((airline, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-[#0E241B] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-emerald-900/40"
                          >
                            ✈️ {airline}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Post-flight transit note */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                        Airport to Final Destination Transit:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        {route.air.postFlightTransit}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      No direct commercial airport within immediate vicinity. Direct scenic road or rail transit is recommended for this route.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* LOCAL & LAST-MILE TRANSIT TAB */}
            {activeTransitTab === 'local' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-emerald-950/60">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Car className="w-5 h-5 text-emerald-500" />
                      Local Transit: 4x4 Chander Gari, Boats & CNG
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Essential last-mile rates for Bangladesh's unique terrain
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                    Local Negotiable Rates
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Mode: {route.localTransit.type}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-[#081510] border border-slate-200 dark:border-emerald-900/40">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Estimated Fare / Hiring Rates
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                      {route.localTransit.estimatedFare}
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <strong>Critical Local Rules & Timing:</strong> {route.localTransit.keyTips}
                  </div>
                </div>

                {/* Cultural Terms glossary snippet */}
                <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-2">
                    Local Transit Vocabulary:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <div>
                      <strong>Chander Gari (চাঁদের গাড়ি):</strong> 4x4 open-roof Mahindra/Jeep used for rugged mountain climbs in Bandarban & Sajek.
                    </div>
                    <div>
                      <strong>Ghat (ঘাট):</strong> River or sea boat landing jetty (e.g. Tahirpur Ghat, Teknaf Damdamia Ghat).
                    </div>
                    <div>
                      <strong>Trawler / Engine Nouka:</strong> Traditional motorized wooden boat used across haors and rivers.
                    </div>
                    <div>
                      <strong>Tomtom / Easybike:</strong> Battery-powered electric 3-wheel auto-rickshaw inside towns and beaches.
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Fast Route Summary Card */}
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-[#0E241B] border-t border-slate-200 dark:border-emerald-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Need assistance booking or verifying seasonal schedules?
            </span>
            <div className="flex items-center gap-2">
              <a
                href="#emergency"
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Check Tourist Police Contacts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default RoutePlanner;
