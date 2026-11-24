import React, { useState, useMemo } from 'react';
import localFoodsData from '../data/localFoodsData.json';
import { 
  Utensils, 
  MapPin, 
  Banknote, 
  Search, 
  Sparkles, 
  Flame, 
  Coffee, 
  Fish, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Cake,
  Navigation,
  ExternalLink,
  Car,
  Compass
} from 'lucide-react';

const LocalFoodGuide = () => {
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodSearch, setFoodSearch] = useState('');

  const divisions = [
    { id: 'All', nameBn: 'সকল বিভাগ', nameEn: 'All Divisions' },
    { id: 'Rajshahi', nameBn: 'রাজশাহী বিভাগ', nameEn: 'Rajshahi' },
    { id: 'Chattogram', nameBn: 'চট্টগ্রাম বিভাগ', nameEn: 'Chattogram' },
    { id: 'Sylhet', nameBn: 'সিলেট বিভাগ', nameEn: 'Sylhet' },
    { id: 'Khulna', nameBn: 'খুলনা বিভাগ', nameEn: 'Khulna' },
    { id: 'Barishal', nameBn: 'বরিশাল বিভাগ', nameEn: 'Barishal' },
    { id: 'Rangpur', nameBn: 'রংপুর বিভাগ', nameEn: 'Rangpur' },
    { id: 'Dhaka', nameBn: 'ঢাকা বিভাগ', nameEn: 'Dhaka' },
    { id: 'Mymensingh', nameBn: 'ময়মনসিংহ বিভাগ', nameEn: 'Mymensingh' }
  ];

  const categories = [
    { id: 'All', labelBn: 'সকল খাবার', icon: Utensils },
    { id: 'Spicy Main', labelBn: 'ঝাল ও প্রধান খাবার', icon: Flame },
    { id: 'Sweet & Dessert', labelBn: 'ঐতিহ্যবাহী মিষ্টি', icon: Cake },
    { id: 'Seafood / Fish', labelBn: 'মাছ ও সি-ফুড', icon: Fish },
    { id: 'Snack / Beverage', labelBn: 'স্ন্যাক্স ও চা-পানীয়', icon: Coffee }
  ];

  const filteredFoods = useMemo(() => {
    return localFoodsData.filter((item) => {
      // Division filter
      if (selectedDivision !== 'All' && item.division.toLowerCase() !== selectedDivision.toLowerCase()) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Search query
      const q = foodSearch.toLowerCase().trim();
      if (!q) return true;

      return (
        item.nameBn.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.place.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.shopSpot && item.shopSpot.toLowerCase().includes(q)) ||
        (item.localTransit && item.localTransit.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
      );
    });
  }, [selectedDivision, selectedCategory, foodSearch]);

  const resetFilters = () => {
    setSelectedDivision('All');
    setSelectedCategory('All');
    setFoodSearch('');
  };

  const hasActiveFilters = selectedDivision !== 'All' || selectedCategory !== 'All' || foodSearch !== '';

  return (
    <section id="food-guide" className="py-16 lg:py-24 bg-gradient-to-b from-amber-50/50 via-white to-slate-50 dark:from-[#081510] dark:via-[#0B1E16] dark:to-[#07130E] border-y border-amber-200/50 dark:border-emerald-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300/50 dark:border-amber-700/40 shadow-sm mb-3">
            <Utensils className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>৮টি বিভাগের আসল খাবার • লাইভ গুগল ম্যাপস ডিরেকশন ও লোকাল যাতায়াত</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Traditional Local Food & Live Maps Guide
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 font-medium">
            খাবারের নাম, বিখ্যাত নির্দিষ্ট দোকান ও স্পট, এক ক্লিকে গুগল ম্যাপসে লাইভ ডিরেকশন এবং লোকাল রিকশা/সিএনজি ভাড়ার পূর্ণাঙ্গ তালিকা।
          </p>
        </div>

        {/* Division Selector Chips */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {divisions.map((div) => {
            const isSelected = selectedDivision === div.id;
            return (
              <button
                key={div.id}
                onClick={() => setSelectedDivision(div.id)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-glow font-extrabold scale-105'
                    : 'bg-white dark:bg-[#0E241B] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-900/40 hover:bg-slate-50 dark:hover:bg-[#122e22]'
                }`}
              >
                <span>{div.nameBn}</span>
              </button>
            );
          })}
        </div>

        {/* Category & Search Filter Bar */}
        <div className="max-w-4xl mx-auto mb-10 p-3 sm:p-4 rounded-3xl bg-white/90 dark:bg-[#0B1E16]/90 border border-slate-200 dark:border-emerald-800/40 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isCatActive = selectedCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isCatActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#07130E]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.labelBn}</span>
                </button>
              );
            })}
          </div>

          {/* Food Search Input */}
          <div className="relative w-full md:w-72 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              placeholder="খাবারের নাম বা জেলা খুঁজুন (যেমন দই, কাচ্চি)..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-medium rounded-xl bg-slate-50 dark:bg-[#07130E] border border-slate-200 dark:border-emerald-900/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {foodSearch && (
              <button
                onClick={() => setFoodSearch('')}
                className="absolute right-2.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Filter Summary & Result Count */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-6 pb-3 border-b border-slate-200 dark:border-emerald-950/60 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 flex-wrap">
            <span>Showing <strong className="text-slate-900 dark:text-white">{filteredFoods.length}</strong> authentic food specialties</span>
            {selectedDivision !== 'All' && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 font-bold">
                {divisions.find(d => d.id === selectedDivision)?.nameBn}
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold">
                {categories.find(c => c.id === selectedCategory)?.labelBn}
              </span>
            )}
            {foodSearch && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 font-bold">
                "{foodSearch}"
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Food Cards Grid */}
        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredFoods.map((food) => (
              <div 
                key={food.id}
                className="group rounded-3xl overflow-hidden bg-white dark:bg-[#0B1E16] border border-slate-200 dark:border-emerald-800/40 hover:border-amber-500/50 dark:hover:border-amber-500/40 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Food Image Banner */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-200 dark:bg-emerald-950/60">
                    <img
                      src={food.image}
                      alt={food.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                    {/* Origin / Place Tag in upper left */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-[#07130E]/95 text-slate-900 dark:text-amber-300 backdrop-blur-md shadow-md flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span>{food.place} ({food.divisionBn})</span>
                      </span>
                    </div>

                    {/* Category Tag in upper right */}
                    <div className="absolute top-3.5 right-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-black/60 text-white backdrop-blur-md border border-white/20">
                        {food.categoryBn}
                      </span>
                    </div>

                    {/* Food Titles overlay on bottom of image */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="font-bengali text-lg sm:text-xl font-extrabold tracking-tight text-white drop-shadow-md">
                        {food.nameBn}
                      </h3>
                      <p className="text-xs text-slate-200/90 font-medium">
                        {food.nameEn}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    
                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {food.description}
                    </p>

                    {/* Highlighted Price Card */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300/60 dark:border-amber-800/40 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                        <Banknote className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>আনুমানিক বাজার দর (Estimated Price):</span>
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                        {food.price}
                      </div>
                    </div>

                    {/* Specific Shop & Spot */}
                    {food.shopSpot && (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E241B] border border-slate-200 dark:border-emerald-900/40 text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>দোকান ও স্পট:</span>
                        </span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          {food.shopSpot}
                        </span>
                      </div>
                    )}

                    {/* Local Transit & Fare Step */}
                    {food.localTransit && (
                      <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs space-y-1">
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>লোকাল যাতায়াত ও ভাড়া:</span>
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs">
                          {food.localTransit}
                        </p>
                      </div>
                    )}

                    {/* Google Maps Live Direction Buttons */}
                    {food.mapLinks && food.mapLinks.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                          লাইভ লোকেশন ম্যাপ (Google Maps Directions):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {food.mapLinks.map((mapItem, idx) => (
                            <a
                              key={idx}
                              href={mapItem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all hover:scale-102 group/map"
                              title={`গুগল ম্যাপসে খুলুন: ${mapItem.title}`}
                            >
                              <Navigation className="w-3.5 h-3.5 text-amber-300 shrink-0 group-hover/map:rotate-45 transition-transform" />
                              <span className="truncate max-w-[200px]">{mapItem.title}</span>
                              <ExternalLink className="w-3 h-3 opacity-75 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Tags Footer */}
                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 dark:border-emerald-950/40 mt-3 flex flex-wrap gap-1.5">
                  {food.tags && food.tags.map((tag, i) => (
                    <span 
                      key={i}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#0E241B] text-slate-600 dark:text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-[#0E241B] border border-dashed border-slate-300 dark:border-emerald-800/40">
            <Utensils className="w-12 h-12 mx-auto text-amber-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              কোনো খাবার খুঁজে পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              আপনার ফিল্টারের সাথে মিলে এমন কোনো ঐতিহ্যবাহী খাবার পাওয়া যায়নি। অন্য কোনো বিভাগ সিলেক্ট করুন বা সার্চ ফিল্টার ক্লিয়ার করুন।
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              সকল খাবার দেখুন
            </button>
          </div>
        )}

        {/* Foodie Tips & Cultural Etiquette Advisory Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-white dark:bg-[#0B1E16] border border-amber-300/40 dark:border-emerald-800/40 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-extrabold text-sm sm:text-base">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>ভ্রমণকারীদের জন্য আসল খাবারের সন্ধান ও দরদাম সতর্কতা (Foodie Advisory)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>মিষ্টি কেনার নিয়ম:</strong> বগুড়ার দই, নাটোরের কাঁচাগোল্লা বা মুক্তাগাছার মণ্ডা কেনার সময় ঐতিহ্যবাহী মূল শাখা যাচাই করে কিনুন।</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>সি-ফুড ও মাছ বারবিকিউ:</strong> কক্সবাজার বা সেন্টমার্টিনে মাছের ওজন ও সাইজ মেপে দাম আগে নিশ্চিত হয়ে তারপর আগুনে দিন।</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>চুইঝাল ও মেজবান:</strong> খুলনা ও চট্টগ্রামের ঐতিহ্যবাহী হোটেলে দুপুর ১২:৩০ থেকে ২:০০ টার মধ্যে পৌঁছালে তাজা ও আসল স্বাদ পাওয়া যায়।</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LocalFoodGuide;
