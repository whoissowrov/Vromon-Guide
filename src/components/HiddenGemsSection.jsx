import React, { useState, useMemo } from 'react';
import hiddenGemsData from '../data/hiddenGems.json';
import { 
  Compass, 
  MapPin, 
  Signal, 
  Home, 
  Tent, 
  Users, 
  Footprints, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  Navigation,
  CheckCircle2,
  Filter
} from 'lucide-react';

const HiddenGemsSection = ({ onSelectTransitSpot }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedOffbeatModal, setSelectedOffbeatModal] = useState(null);

  const categories = [
    { id: 'All', labelBn: 'সকল অফবিট স্পট', labelEn: 'All Hidden Gems' },
    { id: 'শান্ত নিরিবিলি', labelBn: 'শান্ত নিরিবিলি', labelEn: 'Peaceful & Secluded' },
    { id: 'অ্যাডভেঞ্চার ট্রেইল ও ট্র্যাকিং', labelBn: 'অ্যাডভেঞ্চার ও ট্র্যাকিং', labelEn: 'Trekking & Camping' },
    { id: 'গ্রাম ও প্রকৃতি', labelBn: 'গ্রাম ও প্রকৃতি', labelEn: 'Village & Nature' },
  ];

  const regions = [
    'All',
    'Chittagong Hill Tracts',
    'Sylhet Region',
    'South & Riverine',
    'North Bengal',
  ];

  const filteredGems = useMemo(() => {
    return hiddenGemsData.filter((gem) => {
      const matchCat = selectedCategory === 'All' || gem.category === selectedCategory;
      const matchRegion = selectedRegion === 'All' || gem.region === selectedRegion;
      return matchCat && matchRegion;
    });
  }, [selectedCategory, selectedRegion]);

  const getCrowdBadge = (crowdLevel) => {
    switch (crowdLevel) {
      case 'very-low':
        return {
          bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-500'
        };
      case 'low':
        return {
          bg: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30',
          dot: 'bg-teal-500'
        };
      default:
        return {
          bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
          dot: 'bg-amber-500'
        };
    }
  };

  return (
    <section id="hidden-gems" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>অফবিট স্পট • Unexplored & Secluded</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Hidden Gems & Offbeat Spots
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 font-medium">
          কম পরিচিত কিন্তু অসাধারণ সুন্দর বাংলাদেশের ১০টি স্বর্গীয় স্পট—যেখানে নেই বাণিজ্যিক পর্যটকদের ভিড়, আছে নির্জন প্রকৃতি ও আদিম পাহাড়ি শান্তি।
        </p>
      </div>

      {/* Category Pills (Bilingual Bangla/English) */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-glow'
                  : 'bg-white dark:bg-[#0B1E16] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-900/40 hover:bg-slate-50 dark:hover:bg-[#0E241B]'
              }`}
            >
              <span>{cat.labelBn}</span>
              <span className="hidden sm:inline opacity-70 ml-1.5 text-xs">({cat.labelEn})</span>
            </button>
          );
        })}
      </div>

      {/* Region Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-xs">
        <span className="font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-emerald-500" /> অঞ্চল:
        </span>
        {regions.map((reg) => (
          <button
            key={reg}
            onClick={() => setSelectedRegion(reg)}
            className={`px-3 py-1 rounded-full font-semibold transition-all ${
              selectedRegion === reg
                ? 'bg-slate-900 text-white dark:bg-emerald-800'
                : 'bg-slate-100 dark:bg-emerald-950/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {reg === 'All' ? 'সব অঞ্চল' : reg}
          </button>
        ))}
      </div>

      {/* Grid of Hidden Gems */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredGems.map((gem) => {
          const crowd = getCrowdBadge(gem.crowdLevel);
          return (
            <div
              key={gem.id}
              className="rounded-3xl overflow-hidden glass-card hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-200 dark:bg-emerald-950/60">
                  <img
                    src={gem.heroImage}
                    alt={gem.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Region badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-[#07130E]/90 text-slate-900 dark:text-emerald-300 backdrop-blur-md shadow-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-500" />
                      {gem.district}
                    </span>
                  </div>

                  {/* Crowd Meter Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border backdrop-blur-md flex items-center gap-1.5 shadow-sm ${crowd.bg}`}>
                      <span className={`w-2 h-2 rounded-full ${crowd.dot} animate-pulse`} />
                      <span>ভিড়: {gem.crowdMeter}</span>
                    </span>
                  </div>

                  {/* Category Pill in lower image area */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-600/90 font-semibold backdrop-blur-sm">
                      {gem.category}
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-black/60 font-semibold text-[11px] backdrop-blur-sm">
                      {gem.difficulty}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                        {gem.name}
                      </h3>
                      <span className="font-bengali text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {gem.bengaliName}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                      {gem.tagline}
                    </p>
                  </div>

                  {/* Where to stay box */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40 text-xs">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      <Tent className="w-3.5 h-3.5" />
                      <span>কোথায় থাকবেন (Where to Stay):</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                      {gem.whereToStay}
                    </p>
                  </div>

                  {/* Network Signal Availability Widget */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40 text-xs space-y-1.5">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      <Signal className="w-3.5 h-3.5" />
                      <span>মোবাইল নেটওয়ার্ক স্ট্যাটাস (Network Signal):</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-700 dark:text-slate-200">Teletalk:</span>
                        <span>{gem.networkStatus.teletalk}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-700 dark:text-slate-200">GP / Robi:</span>
                        <span>{gem.networkStatus.grameenphone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {gem.keyAttractions.map((attr, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-0.5 rounded-md bg-white dark:bg-emerald-950/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-emerald-800/40"
                      >
                        {attr}
                      </span>
                    ))}
                  </div>

                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 dark:border-emerald-950/40 mt-2">
                <button
                  onClick={() => {
                    if (onSelectTransitSpot) {
                      onSelectTransitSpot(gem.transitKey || 'nafakhum-waterfall');
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                  <span>যাতায়াত ও লোকাল ভাড়া দেখুন (Transit Steps)</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};

export default HiddenGemsSection;
