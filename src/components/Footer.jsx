import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Phone, ShieldAlert, Heart, MapPin } from 'lucide-react';

const Footer = () => {
  const { setSelectedDivision } = useApp();

  const divisions = [
    'Dhaka', 'Chattogram', 'Sylhet', 'Khulna', 
    'Barishal', 'Rajshahi', 'Rangpur', 'Mymensingh'
  ];

  const handleDivisionClick = (div) => {
    setSelectedDivision(div);
    const elem = document.getElementById('destinations');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Brand Col (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-glow">
                <Compass className="w-5 h-5 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-900" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                  Vromon<span className="text-emerald-400">Guide</span>
                </span>
                <span className="text-[11px] font-medium text-emerald-400 font-bengali">
                  ভ্রমণ গাইড • বাংলাদেশ
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Your modern digital compass across Bangladesh. Explore rivers, misty hilltops, pristine coral shores, and ancient terracotta monuments with curated routes and genuine local tips.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <a
                href="tel:999"
                className="px-3 py-1.5 rounded-xl bg-rose-950/70 text-rose-300 border border-rose-800/50 hover:bg-rose-900 flex items-center gap-1.5 font-bold transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>National Emergency: 999</span>
              </a>
              <a
                href="tel:+8801320160120"
                className="px-3 py-1.5 rounded-xl bg-emerald-950/70 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900 flex items-center gap-1.5 font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tourist Police: +880 1320-160120</span>
              </a>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#destinations" className="hover:text-emerald-400 transition-colors">
                  All Destinations
                </a>
              </li>
              <li>
                <a href="#route-planner" className="hover:text-emerald-400 transition-colors">
                  Route & Transport Planner
                </a>
              </li>
              <li>
                <a href="#itineraries" className="hover:text-emerald-400 transition-colors">
                  Day-Wise Tour Itineraries
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-emerald-400 transition-colors">
                  Budget Estimator
                </a>
              </li>
              <li>
                <a href="#emergency" className="hover:text-emerald-400 transition-colors">
                  Emergency & Hospital Directory
                </a>
              </li>
            </ul>
          </div>

          {/* 8 Divisions */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              8 Divisions
            </h4>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-2 text-xs sm:text-sm">
              {divisions.map((div) => (
                <li key={div}>
                  <button
                    onClick={() => handleDivisionClick(div)}
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    {div}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Travel Tips */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Travel Essentials
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#emergency" className="hover:text-emerald-400 transition-colors">
                  Chittagong Hill Tracts Permits
                </a>
              </li>
              <li>
                <a href="#emergency" className="hover:text-emerald-400 transition-colors">
                  Tourist SIM & Mobile Data
                </a>
              </li>
              <li>
                <a href="#emergency" className="hover:text-emerald-400 transition-colors">
                  Cash & bKash / Nagad Advice
                </a>
              </li>
              <li>
                <a href="#emergency" className="hover:text-emerald-400 transition-colors">
                  Leave No Trace Principles
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Vromon Guide (ভ্রমণ গাইড). Designed for travelers discovering Bangladesh.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>for Beautiful Bangladesh</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
