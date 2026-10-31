import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calculator, 
  Users, 
  Calendar, 
  MapPin, 
  Banknote, 
  Sparkles, 
  Check, 
  DollarSign,
  ArrowRight
} from 'lucide-react';

const BudgetCalculator = () => {
  const { destinationsData, planRouteTo } = useApp();

  const [selectedSpotId, setSelectedSpotId] = useState('sajek-valley');
  const [travelerTier, setTravelerTier] = useState('standard'); // 'budget' | 'standard' | 'luxury'
  const [travelersCount, setTravelersCount] = useState(2);
  const [daysCount, setDaysCount] = useState(3);

  // Daily unit costs according to tier (in BDT)
  const tierRates = {
    budget: {
      stayPerRoom: 1500, // shared between 2
      foodPerPerson: 700,
      transitPerPersonDaily: 500,
      activityDaily: 400,
      label: 'Budget Backpacker',
      desc: 'Eco cottages, local shared transit (Chander Gari/CNG), street meals & homestyle food.'
    },
    standard: {
      stayPerRoom: 3500,
      foodPerPerson: 1400,
      transitPerPersonDaily: 1100,
      activityDaily: 800,
      label: 'Standard Traveler',
      desc: 'Comfortable resorts, AC bus/express train, good restaurant dining, guided day tours.'
    },
    luxury: {
      stayPerRoom: 8500,
      foodPerPerson: 2800,
      transitPerPersonDaily: 2500,
      activityDaily: 1600,
      label: 'Luxury Escape',
      desc: 'Top-tier wooden villas, private reserved 4x4 Jeep / domestic flights, seafood BBQs.'
    }
  };

  const currentTier = tierRates[travelerTier];

  const calculatedBudget = useMemo(() => {
    // Rooms needed = Math.ceil(travelers / 2)
    const rooms = Math.ceil(travelersCount / 2);
    const totalStay = rooms * currentTier.stayPerRoom * Math.max(1, daysCount - 1);
    const totalFood = travelersCount * currentTier.foodPerPerson * daysCount;
    const totalTransit = travelersCount * currentTier.transitPerPersonDaily * daysCount;
    const totalActivities = travelersCount * currentTier.activityDaily * daysCount;
    
    const grandTotal = totalStay + totalFood + totalTransit + totalActivities;
    const perPerson = Math.round(grandTotal / travelersCount);
    const usdRate = 120; // 1 USD = approx 120 BDT

    return {
      totalStay,
      totalFood,
      totalTransit,
      totalActivities,
      grandTotal,
      perPerson,
      grandTotalUSD: Math.round(grandTotal / usdRate),
      perPersonUSD: Math.round(perPerson / usdRate)
    };
  }, [travelersCount, daysCount, currentTier]);

  return (
    <section id="calculator" className="py-16 lg:py-24 bg-slate-100/70 dark:bg-[#071710] border-y border-slate-200 dark:border-emerald-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Cost Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Bangladesh Travel Budget Estimator
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            Customize your trip duration, party size, and travel style to get realistic BDT (৳) and USD ($) budget breakdowns.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1E16] border border-slate-200 dark:border-emerald-800/40 shadow-xl space-y-6">
            
            {/* Destination Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                Select Destination
              </label>
              <select
                value={selectedSpotId}
                onChange={(e) => setSelectedSpotId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-800/40 text-slate-900 dark:text-white font-bold text-sm sm:text-base focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {destinationsData.map((spot) => (
                  <option key={spot.id} value={spot.id} className="dark:bg-[#0B1E16]">
                    {spot.name} ({spot.division})
                  </option>
                ))}
              </select>
            </div>

            {/* Travel Tier Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Select Travel Tier
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {['budget', 'standard', 'luxury'].map((tier) => {
                  const isSelected = travelerTier === tier;
                  const item = tierRates[tier];
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setTravelerTier(tier)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-glow'
                          : 'bg-slate-50 dark:bg-[#0E241B] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-900/40 hover:border-emerald-500/50'
                      }`}
                    >
                      <div className="font-extrabold text-xs sm:text-sm capitalize">
                        {tier}
                      </div>
                      <div className="text-[10px] mt-0.5 opacity-80">
                        {tier === 'budget' ? 'Backpacker' : tier === 'standard' ? 'Comfort' : 'Premium'}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {currentTier.desc}
              </p>
            </div>

            {/* Number of Travelers & Days Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {/* Travelers */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    Travelers:
                  </span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    {travelersCount} {travelersCount === 1 ? 'Person' : 'People'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 (Solo)</span>
                  <span>5 (Group)</span>
                  <span>10 (Large)</span>
                </div>
              </div>

              {/* Days */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-500" />
                    Trip Duration:
                  </span>
                  <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400">
                    {daysCount} {daysCount === 1 ? 'Day' : 'Days'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={daysCount}
                  onChange={(e) => setDaysCount(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 Day</span>
                  <span>5 Days</span>
                  <span>10 Days</span>
                </div>
              </div>

            </div>

          </div>

          {/* Budget Result Summary (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-950 to-[#07130E] text-white border border-emerald-500/40 shadow-2xl relative overflow-hidden">
            
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Total Estimated Cost
              </span>
              
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  ৳{calculatedBudget.grandTotal.toLocaleString()}
                </span>
                <span className="text-sm font-medium text-emerald-300">
                  (≈ ${calculatedBudget.grandTotalUSD} USD)
                </span>
              </div>

              <div className="mt-1 text-xs text-emerald-200/80">
                About <strong>৳{calculatedBudget.perPerson.toLocaleString()}</strong> per person for {daysCount} days
              </div>

              {/* Itemized Cost Breakdown */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-xs sm:text-sm">
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Accommodation ({Math.ceil(travelersCount / 2)} rooms):</span>
                  <span className="font-bold">৳{calculatedBudget.totalStay.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Food & Dining:</span>
                  <span className="font-bold">৳{calculatedBudget.totalFood.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Interdistrict & Local Transit:</span>
                  <span className="font-bold">৳{calculatedBudget.totalTransit.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Entry Tickets, Boat & Guides:</span>
                  <span className="font-bold">৳{calculatedBudget.totalActivities.toLocaleString()}</span>
                </div>

              </div>

              {/* Action Button */}
              <button
                onClick={() => planRouteTo(selectedSpotId)}
                className="mt-8 w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-glow transition-all flex items-center justify-center gap-2"
              >
                <span>Check Routes to this Spot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default BudgetCalculator;
