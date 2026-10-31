import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import itinerariesData from '../data/itineraries.json';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckSquare, 
  Banknote, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Compass, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const ItinerariesSection = () => {
  const { planRouteTo } = useApp();
  const [selectedItineraryId, setSelectedItineraryId] = useState(itinerariesData[0].id);
  const [expandedDays, setExpandedDays] = useState({ 1: true, 2: true });

  const activeItinerary = itinerariesData.find(item => item.id === selectedItineraryId) || itinerariesData[0];

  const toggleDay = (dayNum) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayNum]: !prev[dayNum]
    }));
  };

  return (
    <section id="itineraries" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>Curated Tour Plans</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Handcrafted Day-Wise Tour Itineraries
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
          Take the guesswork out of your journey with hour-by-hour schedules, meal recommendations, and essential packing checklists.
        </p>
      </div>

      {/* Itinerary Selection Horizontal Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
        {itinerariesData.map((itin) => {
          const isSelected = selectedItineraryId === itin.id;
          return (
            <button
              key={itin.id}
              onClick={() => {
                setSelectedItineraryId(itin.id);
                setExpandedDays({ 1: true, 2: true });
              }}
              className={`p-4 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-400 shadow-glow scale-[1.02]'
                  : 'bg-white dark:bg-[#0B1E16] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-emerald-900/40 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-[#0E241B]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                  }`}>
                    {itin.duration}
                  </span>
                  <span className={`text-[11px] font-semibold ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                    {itin.category}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base leading-snug line-clamp-2">
                  {itin.title.split(':')[0]}
                </h3>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/20 dark:border-emerald-950/60 flex items-center justify-between text-xs font-bold">
                <span className={isSelected ? 'text-amber-200' : 'text-amber-600 dark:text-amber-400'}>
                  {itin.estimatedCost.split(' ')[0]} {itin.estimatedCost.split(' ')[1]}
                </span>
                <span className="flex items-center gap-1 opacity-80">
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Itinerary Detailed View */}
      <div className="rounded-3xl bg-white dark:bg-[#0B1E16] border border-slate-200 dark:border-emerald-800/40 shadow-xl overflow-hidden">
        
        {/* Banner with Cover Image & Key Stats */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={activeItinerary.coverImage}
            alt={activeItinerary.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E16] via-[#0B1E16]/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                {activeItinerary.duration}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md">
                Difficulty: {activeItinerary.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-white backdrop-blur-md">
                Best: {activeItinerary.bestSeason.split('(')[0]}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeItinerary.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl font-medium">
              {activeItinerary.subtitle}
            </p>
          </div>
        </div>

        {/* Action & Cost Summary Bar */}
        <div className="px-6 py-4 bg-emerald-50/70 dark:bg-[#0E241B] border-b border-slate-200 dark:border-emerald-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-slate-600 dark:text-slate-300">Estimated Total Trip Cost:</span>
            <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm sm:text-base">
              {activeItinerary.estimatedCost}
            </strong>
          </div>

          <button
            onClick={() => planRouteTo(activeItinerary.destinationId)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-glow transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Plan Route for This Tour</span>
          </button>
        </div>

        {/* Days Accordion / Timeline */}
        <div className="p-6 sm:p-8 space-y-6">
          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-500" />
            Day-by-Day Schedule & Activities
          </h4>

          <div className="space-y-4">
            {activeItinerary.days.map((day) => {
              const isExpanded = !!expandedDays[day.day];
              return (
                <div
                  key={day.day}
                  className="rounded-2xl border border-slate-200 dark:border-emerald-900/40 bg-slate-50 dark:bg-[#07130E] overflow-hidden transition-all"
                >
                  {/* Day Header Trigger */}
                  <button
                    onClick={() => toggleDay(day.day)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-[#0E241B] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm">
                        D{day.day}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          Day 0{day.day}
                        </div>
                        <h5 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {day.title}
                        </h5>
                      </div>
                    </div>

                    <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Day Schedule Activities */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-200/60 dark:border-emerald-950/60 space-y-3">
                      {day.schedule.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 text-xs sm:text-sm">
                          <span className="px-2.5 py-1 rounded-md bg-white dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold font-mono text-[11px] shrink-0 border border-slate-200 dark:border-emerald-800/40 mt-0.5">
                            {item.time}
                          </span>
                          <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                            {item.activity}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Packing Checklist */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-[#07130E] border border-slate-200 dark:border-emerald-900/40">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-500" />
              Essential Packing List for this Trip
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeItinerary.packingChecklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

export default ItinerariesSection;
