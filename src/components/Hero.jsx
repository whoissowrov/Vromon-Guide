import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Compass, 
  Palmtree, 
  Mountain, 
  Landmark, 
  Trees, 
  Waves,
  ArrowRight
} from 'lucide-react';

const Hero = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedVibe, 
    setSelectedVibe, 
    selectedDivision, 
    setSelectedDivision 
  } = useApp();

  const vibes = [
    { id: 'All', label: 'All Vibes', icon: Sparkles, color: 'from-emerald-500 to-teal-600' },
    { id: 'Beaches & Islands', label: 'Beaches & Islands', icon: Palmtree, color: 'from-cyan-500 to-blue-600' },
    { id: 'Hills & Trekking', label: 'Hills & Trekking', icon: Mountain, color: 'from-emerald-600 to-green-700' },
    { id: 'Heritage & History', label: 'Heritage & History', icon: Landmark, color: 'from-amber-500 to-orange-600' },
    { id: 'Forests & Wildlife', label: 'Forests & Wildlife', icon: Trees, color: 'from-teal-600 to-emerald-800' },
    { id: 'Riverine & Waterfalls', label: 'Riverine & Waterfalls', icon: Waves, color: 'from-sky-500 to-indigo-600' },
  ];

  const divisions = [
    'All',
    'Dhaka',
    'Chattogram',
    'Sylhet',
    'Khulna',
    'Barishal',
    'Rajshahi',
    'Rangpur',
    'Mymensingh',
  ];

  const popularSearches = ['Sajek Valley', "Cox's Bazar", 'Sundarbans', 'Tanguar Haor', 'Sreemangal', 'Bandarban'];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200 dark:border-emerald-950/40">
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-teal-500/15 dark:bg-teal-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tagline Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/40 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bengali text-sm font-bold">রূপসী বাংলা</span>
            <span className="opacity-40">|</span>
            <span>Your Ultimate Bangladesh Travel & Transit Companion</span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Explore the Land of <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 bg-clip-text text-transparent">
              Rivers, Clouds & Living Heritage
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            From the cloud-kissed peaks of Sajek to the pristine coral sands of Saint Martin’s and the wild mangroves of Sundarbans—plan complete routes, trains, buses, and budgets.
          </p>
        </div>

        {/* Interactive Search Bar Box */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="p-2 sm:p-3 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-[#0B1E16]/90 border border-slate-200 dark:border-emerald-700/40 shadow-2xl backdrop-blur-xl transition-all">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full flex items-center">
                <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by division, district, or spot (e.g. Sajek, Sylhet, Sundarbans)..."
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 text-sm sm:text-base font-medium rounded-xl sm:rounded-2xl bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mr-3 text-xs font-semibold px-2 py-1 bg-slate-200 dark:bg-emerald-900/60 rounded-md text-slate-600 dark:text-slate-300"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <button
                onClick={() => {
                  const elem = document.getElementById('destinations');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl sm:rounded-2xl shadow-glow transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Find Spots</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Popular quick-click searches */}
            <div className="flex items-center gap-1.5 flex-wrap pt-3 px-3 pb-1 border-t border-slate-100 dark:border-emerald-950/60 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Popular:</span>
              {popularSearches.map((spot) => (
                <button
                  key={spot}
                  onClick={() => setSearchQuery(spot)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  {spot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vibe / Category Horizontal Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Filter by Travel Vibe
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Click to isolate experiences
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {vibes.map((vibe) => {
              const Icon = vibe.icon;
              const isActive = selectedVibe === vibe.id;
              return (
                <button
                  key={vibe.id}
                  onClick={() => setSelectedVibe(vibe.id)}
                  className={`p-3.5 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all duration-300 border ${
                    isActive
                      ? 'bg-gradient-to-b from-emerald-600 to-teal-700 text-white border-emerald-400 shadow-glow scale-[1.02]'
                      : 'bg-white/80 dark:bg-[#0E241B]/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-emerald-900/40 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-[#122c22]'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold leading-tight">
                    {vibe.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Division Pill Badges (8 Administrative Divisions) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 justify-center pt-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Divisions:
          </span>
          {divisions.map((div) => {
            const isActive = selectedDivision === div;
            return (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50'
                    : 'bg-slate-200/80 dark:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                }`}
              >
                {div === 'All' ? 'All 8 Divisions' : `${div}`}
              </button>
            );
          })}
        </div>

        {/* Live Stats Ticker */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-emerald-950/60 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">8 Divisions</div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">64 Districts Covered</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400">120 km</div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Longest Unbroken Beach</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 dark:text-amber-400">10,000 km²</div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Sundarbans Mangrove</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">100% Real</div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Transit Fares & Timetables</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
