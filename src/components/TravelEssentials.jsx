import React, { useState } from 'react';
import emergencyData from '../data/emergencyData.json';
import { 
  ShieldAlert, 
  PhoneCall, 
  Hospital, 
  BookOpen, 
  AlertCircle, 
  CheckCircle, 
  MapPin, 
  Phone,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

const TravelEssentials = () => {
  const [activeCategory, setActiveCategory] = useState('emergency'); // 'emergency' | 'hospitals' | 'guidelines'
  const [expandedGuideline, setExpandedGuideline] = useState(0);

  const { nationalEmergency, regionalTouristPolice, majorHospitals, travelGuidelines } = emergencyData;

  return (
    <section id="emergency" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 mb-2">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          <span>Traveler Safety & Support</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Emergency Helplines & Travel Essentials
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
          Keep these 24/7 Tourist Police numbers, regional hospital hotlines, and essential cultural guidelines handy on your journey.
        </p>
      </div>

      {/* Subcategory Switcher Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 dark:bg-[#0B1E16] border border-slate-300/80 dark:border-emerald-800/40">
          <button
            onClick={() => setActiveCategory('emergency')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeCategory === 'emergency'
                ? 'bg-emerald-600 text-white shadow-glow'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Tourist Police & 999</span>
          </button>

          <button
            onClick={() => setActiveCategory('hospitals')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeCategory === 'hospitals'
                ? 'bg-emerald-600 text-white shadow-glow'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Hospital className="w-4 h-4" />
            <span>Regional Hospitals</span>
          </button>

          <button
            onClick={() => setActiveCategory('guidelines')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeCategory === 'guidelines'
                ? 'bg-emerald-600 text-white shadow-glow'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Permits & Local Tips</span>
          </button>
        </div>
      </div>

      {/* EMERGENCY & TOURIST POLICE VIEW */}
      {activeCategory === 'emergency' && (
        <div className="space-y-8">
          
          {/* National Hotlines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {nationalEmergency.map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white dark:bg-[#0B1E16] border border-slate-200 dark:border-emerald-800/40 shadow-lg flex flex-col justify-between hover:border-emerald-500/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                      {item.available}
                    </span>
                    <span className="text-xs text-slate-400">Emergency</span>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    {item.service}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-emerald-950/60 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Direct Dial:</span>
                    <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
                      {item.number}
                    </div>
                  </div>

                  <a
                    href={`tel:${item.number.replace(/\s+/g, '')}`}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Regional Tourist Police Outposts */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1E16] border border-slate-200 dark:border-emerald-800/40 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-500" />
              Regional Tourist Police Zones
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regionalTouristPolice.map((zone, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400">
                      {zone.region}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      <strong>Outposts:</strong> {zone.location}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {zone.services}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-emerald-950/60 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900 dark:text-white">{zone.phone}</span>
                    <a
                      href={`tel:${zone.phone.replace(/\s+/g, '')}`}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* REGIONAL HOSPITALS VIEW */}
      {activeCategory === 'hospitals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {majorHospitals.map((hosp, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-[#0B1E16] border border-slate-200 dark:border-emerald-800/40 shadow-lg flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300">
                  {hosp.zone} Zone
                </span>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white mt-3">
                  {hosp.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{hosp.location}</span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                  {hosp.type}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-emerald-950/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Desk:</span>
                  <div className="font-mono font-bold text-xs text-slate-800 dark:text-white">
                    {hosp.phone}
                  </div>
                </div>

                <a
                  href={`tel:${hosp.phone.split('/')[0].trim().replace(/\s+/g, '')}`}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Dial Desk</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TRAVEL GUIDELINES & LOCAL TIPS VIEW */}
      {activeCategory === 'guidelines' && (
        <div className="max-w-4xl mx-auto space-y-4">
          {travelGuidelines.map((item, idx) => {
            const isExpanded = expandedGuideline === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0B1E16] overflow-hidden shadow-md transition-all"
              >
                <button
                  onClick={() => setExpandedGuideline(isExpanded ? -1 : idx)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-[#0E241B] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {item.badge}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-emerald-950/60">
                    {item.desc}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};

export default TravelEssentials;
