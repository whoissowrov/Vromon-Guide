import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Navigation, 
  Utensils, 
  Compass, 
  Calendar, 
  Calculator, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles,
  LocateFixed,
  Camera,
  CheckCircle2,
  DollarSign,
  PhoneCall
} from 'lucide-react';

export default function HomeNavigationHub() {
  const { navigateToPage, exploreNearby, userLocation } = useApp();

  const options = [
    {
      id: 'destinations',
      numBn: '০১',
      numEn: '01',
      titleBn: 'দর্শনীয় স্থান ও কাছে কি আছে',
      titleEn: 'Destinations & Near Me Live Radar',
      badge: '৫২+ ট্যুরিস্ট স্পট',
      badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
      icon: MapPin,
      gradient: 'from-emerald-600 to-teal-700',
      description: '৮টি বিভাগের ৫২টি জনপ্রিয় ও অফবিট প্রাকৃতিক-ঐতিহাসিক পর্যটন স্পট। আপনার বর্তমান লোকেশন অন করে আশপাশের স্পট খুঁজুন এবং সরাসরি রিয়েল-টাইম ছবি যাচাই করুন।',
      features: ['জনপ্রিয় ও অফবিট ফিল্টার', 'লাইভ জিপিএস প্রক্সিমিটি রেডার', 'অন-সাইট ভেরিফায়েড ফটো'],
      cta: 'দর্শনীয় স্থান পেজ দেখুন'
    },
    {
      id: 'transit',
      numBn: '০২',
      numEn: '02',
      titleBn: 'লোকাল ট্রানজিট ও পরিবহন ভাড়া',
      titleEn: 'Point-to-Point Local Transit & Fares',
      badge: 'স্টেপ-বাই-স্টেপ রুট ও ভাড়া',
      badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
      icon: Navigation,
      gradient: 'from-blue-600 to-indigo-700',
      description: 'দূরপাল্লার বাস থেকে শুরু করে নদীপথের ট্রলার, চাঁদের গাড়ি, লোকাল সিএনজি এবং পাহাড়ি ট্রেকিং গাইড—কোন পয়েন্টে কত ভাড়া লাগবে তার নিখুঁত হিসাব।',
      features: ['স্টেপ-বাই-স্টেপ পরিবহন ফেয়ার', 'লোকাল ভেহিকেল টিপস', 'সঠিক ভাড়ার রেঞ্জ'],
      cta: 'ট্রানজিট পেজ দেখুন'
    },
    {
      id: 'food',
      numBn: '০৩',
      numEn: '03',
      titleBn: 'আঞ্চলিক আসল ও ঐতিহ্যবাহী খাবার',
      titleEn: 'Regional Authentic Foods & Direct Maps',
      badge: '৩০টি আসল খাবার ও মিষ্টি',
      badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
      icon: Utensils,
      gradient: 'from-amber-600 to-orange-700',
      description: 'বগুড়ার আসল দই ও ক্ষীরসা, রাজশাহীর কালাই রুটি-হাঁসের মাংস, চাটগাঁর মেজবানি মাংস থেকে সিলেটের সাতকড়া গরু—খাঁটি ফটো, আসল স্বাদ ও গুগল ম্যাপ ডিরেকশন।',
      features: ['খাঁটি ঐতিহ্যবাহী ফটোগ্রাফি', '৮টি বিভাগের স্পেশাল খাবার', 'বিখ্যাত দোকানের গুগল ম্যাপ'],
      cta: 'খাবারের গাইড দেখুন'
    },
    {
      id: 'routes',
      numBn: '০৪',
      numEn: '04',
      titleBn: 'স্মার্ট রুট প্ল্যানার (জেলা থেকে জেলা)',
      titleEn: 'City-to-City Inter-District Route Planner',
      badge: 'বাস, ট্রেন ও নৌপথ কানেকশন',
      badgeColor: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20',
      icon: Compass,
      gradient: 'from-teal-600 to-cyan-700',
      description: 'আপনার শহর থেকে কাঙ্ক্ষিত পর্যটন কেন্দ্রে সহজে পৌঁছানোর রুট নির্বাচন করুন। ট্রেন, বাস, বিকল্প ড্রাইভ কিংবা নৌপথের তুলনামূলক সময় ও খরচ দেখুন।',
      features: ['সরাসরি রুট সিলেকশন', 'ট্রেন ও বাস শিডিউল তুলনা', 'বিকল্প সংযোগ পরামর্শ'],
      cta: 'রুট প্ল্যানার পেজ দেখুন'
    },
    {
      id: 'itineraries',
      numBn: '০৫',
      numEn: '05',
      titleBn: 'রেডিমেড ট্যুর আইটিনারারি',
      titleEn: 'Curated Ready-to-Go Tour Itineraries',
      badge: '২-৪ দিনের সাজানো প্ল্যান',
      badgeColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
      icon: Calendar,
      gradient: 'from-purple-600 to-fuchsia-700',
      description: 'সাজেক ভ্যালি, সেন্টমার্টিন দ্বীপ, সুন্দরবন, বান্দরবান কিংবা শ্রীমঙ্গলের জন্য ডে-বাই-ডে সাজানো ট্যুর প্ল্যান। পরিবার কিংবা বন্ধুদের সাথে সময় ও বাজেট সাশ্রয়ী ভ্রমণ।',
      features: ['দিনভিত্তিক অ্যাক্টিভিটি টাইমলাইন', 'হোটেল ও স্পট পরামর্শ', 'বাজেট অপটিমাইজেশন'],
      cta: 'ট্যুর আইটিনারারি দেখুন'
    },
    {
      id: 'calculator',
      numBn: '০৬',
      numEn: '06',
      titleBn: 'স্মার্ট বাজেট ক্যালকুলেটর',
      titleEn: 'Interactive Tour Budget Calculator',
      badge: 'রিয়েল-টাইম হিসাব ও এস্টিমেট',
      badgeColor: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
      icon: Calculator,
      gradient: 'from-rose-600 to-pink-700',
      description: 'কতজন ট্রাভেলার, কত দিন থাকবেন, হোটেলের ক্যাটাগরি এবং খাবারের ধরনের ওপর ভিত্তি করে সম্পূর্ণ সফরের মাথাপিছু ও মোট খরচ তাৎক্ষণিকভাবে হিসাব করুন।',
      features: ['মাথাপিছু খরচের হিসাব', 'হোটেল, খাবার ও লোকাল খরচ', 'বাজেট সামারি ভিউ'],
      cta: 'বাজেট ক্যালকুলেটর দেখুন'
    },
    {
      id: 'emergency',
      numBn: '০৭',
      numEn: '07',
      titleBn: 'জরুরি ট্রাভেল গাইড ও হেল্পলাইন',
      titleEn: 'Emergency Helplines & Travel Essentials',
      badge: 'নিরাপত্তা, হটলাইন ও চেকলিস্ট',
      badgeColor: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
      icon: ShieldAlert,
      gradient: 'from-red-600 to-rose-700',
      description: 'ট্যুরিস্ট পুলিশ, জরুরি হেল্পলাইন ৯৯৯, প্রয়োজনীয় প্যাকিং চেকলিস্ট, স্থানীয় সংস্কৃতি ও নিরাপত্তা নির্দেশিকা—একটি নিরাপদ ও স্বস্তিদায়ক ভ্রমণের পূর্ণ প্রস্তুতি।',
      features: ['ট্যুরিস্ট পুলিশ ও জরুরি নম্বর', 'প্যাকিং ও ফার্স্ট-এইড চেকলিস্ট', 'লোকাল কালচার এটিকেট'],
      cta: 'জরুরি গাইড দেখুন'
    }
  ];

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>আলাদা ও স্বতন্ত্র সেকশন পেজ (Modular Multi-Page Experience)</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-bengali tracking-tight">
          ওয়েবসাইটের মূল ৭টি অপশন ও সেবা
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          আপনার পছন্দমতো যেকোনো নম্বরে ক্লিক করে সরাসরি সেই বিষয়ের জন্য তৈরি স্বতন্ত্র ও পূর্ণাঙ্গ পেজে প্রবেশ করুন।
        </p>

        {/* Live GPS Nearby Shortcut Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => exploreNearby()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all hover:scale-[1.02]"
          >
            <LocateFixed className="w-4 h-4" />
            <span>আমার কাছে কি কি স্পট আছে দেখুন (GPS Radar)</span>
          </button>
          {userLocation && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              📍 আপনার এরিয়া: {userLocation.areaName || 'শনাক্ত করা হয়েছে'}
            </span>
          )}
        </div>
      </div>

      {/* Numbered Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <div
              key={opt.id}
              onClick={() => navigateToPage(opt.id)}
              className="group relative rounded-3xl bg-white dark:bg-[#0B1E16] border border-slate-200/90 dark:border-emerald-900/40 p-6 sm:p-7 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer overflow-hidden"
            >
              {/* Ambient gradient glow on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div>
                {/* Top Row: Big Number Badge & Category */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    {/* Big Bengali Number Pill */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-xl font-bengali shadow-md group-hover:scale-105 transition-transform">
                      {opt.numBn}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Option {opt.numEn}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {opt.numBn} নং অপশন
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`p-3 rounded-2xl bg-gradient-to-tr ${opt.gradient} text-white shadow-sm group-hover:rotate-6 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Badge Tag */}
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${opt.badgeColor}`}>
                    {opt.badge}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-bengali tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {opt.titleBn}
                </h3>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
                  {opt.titleEn}
                </p>

                {/* Card Description */}
                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {opt.description}
                </p>

                {/* Bullet Highlights */}
                <ul className="mt-4 space-y-1.5 border-t border-slate-100 dark:border-emerald-950/60 pt-3">
                  {opt.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom CTA Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-emerald-950/60">
                <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                  <span>{opt.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Overview Footer Strip inside Hub */}
      <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0B1E16] to-teal-950 text-white border border-emerald-800/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg sm:text-xl font-extrabold font-bengali">
            একটি সম্পূর্ণ ও নির্ভরযোগ্য বাংলাদেশ ভ্রমণ প্ল্যাটফর্ম
          </h4>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-xl">
            কোনো অস্পষ্ট তথ্য বা ভুল ছবি নয়—আসল ঐতিহ্যবাহী খাবার, সঠিক ভাড়া ও স্পটগুলোর নিখুঁত সমন্বয়ে আপনার প্রতিটি ট্যুরকে সহজ ও সাশ্রয়ী করতে আমাদের এই আয়োজন।
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateToPage('destinations')}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg transition-all"
          >
            ০১. স্থান অন্বেষণ শুরু করুন →
          </button>
        </div>
      </div>

    </section>
  );
}
