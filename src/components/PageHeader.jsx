import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Home, 
  MapPin, 
  Navigation, 
  Utensils, 
  Compass, 
  Calendar, 
  Calculator, 
  ShieldAlert 
} from 'lucide-react';

const MODULES = [
  { id: 'destinations', numBn: '০১', numEn: '01', titleBn: 'দর্শনীয় স্থান', icon: MapPin },
  { id: 'transit', numBn: '০২', numEn: '02', titleBn: 'লোকাল ট্রানজিট', icon: Navigation },
  { id: 'food', numBn: '০৩', numEn: '03', titleBn: 'ঐতিহ্যবাহী খাবার', icon: Utensils },
  { id: 'routes', numBn: '০৪', numEn: '04', titleBn: 'রুট প্ল্যানার', icon: Compass },
  { id: 'itineraries', numBn: '০৫', numEn: '05', titleBn: 'ট্যুর আইটিনারারি', icon: Calendar },
  { id: 'calculator', numBn: '০৬', numEn: '06', titleBn: 'বাজেট ক্যালকুলেটর', icon: Calculator },
  { id: 'emergency', numBn: '০৭', numEn: '07', titleBn: 'জরুরি হেল্পলাইন', icon: ShieldAlert },
];

export default function PageHeader({ moduleNumber, titleBn, titleEn, description, badgeText }) {
  const { currentPage, navigateToPage } = useApp();

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-[#0B1E16] dark:via-[#07130E] dark:to-[#07130E] border-b border-slate-200 dark:border-emerald-900/40 py-8 lg:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Back Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigateToPage('home')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-emerald-950/60 hover:bg-slate-100 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-emerald-800/50 shadow-sm transition-all hover:-translate-x-0.5"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>← হোম পেজে ফিরে যান (Back to Home)</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <button 
              onClick={() => navigateToPage('home')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <Home className="w-3.5 h-3.5" /> হোম
            </button>
            <span>/</span>
            <span className="text-emerald-600 dark:text-emerald-400">মডিউল {moduleNumber}</span>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200">{titleBn}</span>
          </div>
        </div>

        {/* Page Identity Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-extrabold bg-emerald-600 text-white shadow-sm font-bengali">
                অপশন {moduleNumber}
              </span>
              {badgeText && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50">
                  {badgeText}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-bengali tracking-tight">
              {titleBn}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mt-1">
              {titleEn}
            </p>
            {description && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-3xl">
                {description}
              </p>
            )}
          </div>

          {/* Quick jump tabs to other modules */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mr-1 hidden sm:inline">
              দ্রুত জাম্প:
            </span>
            {MODULES.map((m) => {
              const isActive = currentPage === m.id;
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => navigateToPage(m.id)}
                  title={`${m.numBn}. ${m.titleBn}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/80 dark:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-900/60 border border-slate-200 dark:border-emerald-800/40'
                  }`}
                >
                  <span className="opacity-80 font-mono text-[10px]">{m.numBn}</span>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{m.titleBn}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
