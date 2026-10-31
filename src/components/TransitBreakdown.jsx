import React, { useState } from 'react';
import transitStepsData from '../data/transitSteps.json';
import { 
  Bus, 
  Car, 
  Ship, 
  Footprints, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Users, 
  BadgePercent, 
  Info, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const TransitBreakdown = ({ destinationKey = 'nafakhum-waterfall' }) => {
  const [selectedRouteKey, setSelectedRouteKey] = useState(destinationKey);

  // Available routes in data
  const routeKeys = Object.keys(transitStepsData);
  const activeRoute = transitStepsData[selectedRouteKey] || transitStepsData['nafakhum-waterfall'];

  // Vehicle badge config helper
  const getVehicleBadge = (type) => {
    switch (type) {
      case 'bus':
        return {
          icon: Bus,
          label: 'লোকাল / দূরপাল্লার বাস',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800/40'
        };
      case 'chander-gari':
        return {
          icon: Car,
          label: 'চাঁদের গাড়ি (4x4 জিপ)',
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
        };
      case 'boat':
        return {
          icon: Ship,
          label: 'ইঞ্জিন ট্রলার / নৌকা / জাহাজ',
          color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/40'
        };
      case 'cng':
        return {
          icon: Car,
          label: 'লোকাল সিএনজি / লেগুনা',
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'
        };
      case 'auto':
        return {
          icon: Car,
          label: 'টমটম / ভাড়ার বাইক',
          color: 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 border-teal-200 dark:border-teal-800/40'
        };
      case 'trek':
        return {
          icon: Footprints,
          label: 'পায়ে হাঁটা ট্রেইল ও গাইড',
          color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800/40'
        };
      default:
        return {
          icon: Car,
          label: 'লোকাল বাহন',
          color: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200 border-slate-200'
        };
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B1E16] border border-slate-200 dark:border-emerald-800/40 p-5 sm:p-7 shadow-xl space-y-6">
      
      {/* Component Header & Route Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-emerald-950/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Step-by-Step Local Transit Stepper (লোকাল কানেক্টিভিটি)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {activeRoute.spotName}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            <strong>রুট সারসংক্ষেপ:</strong> {activeRoute.routeSummary}
          </p>
        </div>

        {/* Route Selector Dropdown if multiple routes available */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
            স্পট পরিবর্তন:
          </label>
          <select
            value={selectedRouteKey}
            onChange={(e) => setSelectedRouteKey(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-800/40 text-xs font-bold text-emerald-700 dark:text-emerald-400 focus:outline-none cursor-pointer"
          >
            {routeKeys.map((key) => (
              <option key={key} value={key} className="dark:bg-[#0B1E16]">
                {transitStepsData[key].spotName.split('(')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vertical Stepper Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-teal-500 before:to-rose-500">
        {activeRoute.steps.map((st) => {
          const badge = getVehicleBadge(st.vehicleType);
          const Icon = badge.icon;

          return (
            <div key={st.step} className="relative group">
              {/* Stepper Node Icon */}
              <div className="absolute -left-6 sm:-left-8 top-0 w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-glow ring-4 ring-white dark:ring-[#0B1E16]">
                {st.step}
              </div>

              {/* Step Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40 group-hover:border-emerald-500/50 transition-all space-y-3">
                
                {/* From -> To Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {st.from}
                    </span>
                    <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-extrabold text-sm sm:text-base text-emerald-600 dark:text-emerald-400">
                      {st.to}
                    </span>
                  </div>

                  {/* Vehicle Tag */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </div>
                </div>

                {/* Dual Fare Range Comparison: Per Person (Shared) vs Reserved */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  
                  {/* Shared Fare */}
                  <div className="p-3 rounded-xl bg-white dark:bg-[#07130E] border border-slate-200 dark:border-emerald-900/40">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3 text-emerald-500" />
                      <span>জনপ্রতি শেয়ারিং ভাড়া (Per Person / Shared)</span>
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {st.sharedFare}
                    </div>
                  </div>

                  {/* Reserved Fare */}
                  <div className="p-3 rounded-xl bg-white dark:bg-[#07130E] border border-slate-200 dark:border-emerald-900/40">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Car className="w-3 h-3 text-amber-500" />
                      <span>পুরো রিজার্ভ ভাড়া (Full Reserved Group)</span>
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
                      {st.reservedFare}
                    </div>
                  </div>

                </div>

                {/* Duration & Practical Notes */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>সময়: {st.duration}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 italic">
                    💡 {st.notes}
                  </p>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Local Fare Warning & Bargaining Tips Card */}
      <div className="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 space-y-3">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <span>লোকাল ভাড়া সতর্কতা ও বার্গেইনিং টিপস (Local Fare Warning & Tips)</span>
        </div>
        <ul className="space-y-2">
          {activeRoute.bargainingTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default TransitBreakdown;
