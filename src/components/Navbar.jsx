import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Bookmark, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Navigation, 
  MapPin, 
  Calendar, 
  Calculator, 
  ShieldAlert,
  Search,
  Utensils,
  LocateFixed,
  Home
} from 'lucide-react';

const Navbar = () => {
  const { 
    theme, 
    toggleTheme, 
    bookmarks, 
    setIsBookmarksOpen,
    searchQuery,
    setSearchQuery,
    userLocation,
    exploreNearby,
    currentPage,
    navigateToPage
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'হোম', page: 'home', icon: Home, isHome: true },
    { label: '০১. স্পট ও রেডার', page: 'destinations', icon: MapPin },
    { label: '০২. লোকাল ট্রানজিট', page: 'transit', icon: Navigation },
    { label: '০৩. আসল খাবার', page: 'food', icon: Utensils },
    { label: '০৪. রুট প্ল্যানার', page: 'routes', icon: Compass },
    { label: '০৫. ট্যুর আইটিনারারি', page: 'itineraries', icon: Calendar },
    { label: '০৬. বাজেট হিসাব', page: 'calculator', icon: Calculator },
    { label: '০৭. জরুরি গাইড', page: 'emergency', icon: ShieldAlert },
  ];

  const handleNavClick = (link) => {
    setMobileMenuOpen(false);
    navigateToPage(link.page);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      navigateToPage('destinations');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-emerald-950/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - Navigates to Home */}
          <button 
            onClick={() => navigateToPage('home')} 
            className="flex items-center gap-3 group text-left"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-6 h-6 animate-pulse" />
              {/* Bangladesh circle accent */}
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#07130E]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Vromon<span className="text-emerald-500">Guide</span>
              </span>
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 font-bengali tracking-wider">
                ভ্রমণ গাইড • ৭টি স্বতন্ত্র মডিউল
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white bg-emerald-600 dark:bg-emerald-600 shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'opacity-70'}`} />
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Mid-screen compact menu (lg to xl) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1">
            <button
              onClick={() => navigateToPage('home')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                currentPage === 'home' ? 'bg-emerald-600 text-white' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              হোম
            </button>
            <button
              onClick={() => navigateToPage('destinations')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                currentPage === 'destinations' ? 'bg-emerald-600 text-white' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              ০১. স্পট
            </button>
            <button
              onClick={() => navigateToPage('transit')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                currentPage === 'transit' ? 'bg-emerald-600 text-white' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              ০২. ট্রানজিট
            </button>
            <button
              onClick={() => navigateToPage('food')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                currentPage === 'food' ? 'bg-emerald-600 text-white' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              ০৩. খাবার
            </button>
            <button
              onClick={() => navigateToPage('routes')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                currentPage === 'routes' ? 'bg-emerald-600 text-white' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              ০৪. রুট
            </button>
            <button
              onClick={() => navigateToPage('itineraries')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                currentPage === 'itineraries' ? 'bg-emerald-600 text-white' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              ০৫. আইটিনারারি
            </button>
            <button
              onClick={() => navigateToPage('calculator')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                currentPage === 'calculator' ? 'bg-emerald-600 text-white' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              ০৬. বাজেট
            </button>
            <button
              onClick={() => navigateToPage('emergency')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                currentPage === 'emergency' ? 'bg-emerald-600 text-white' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              ০৭. জরুরি
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Search Input */}
            <div className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search Sajek, Sylhet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                className="w-36 lg:w-48 pl-9 pr-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-slate-800 dark:text-white placeholder-slate-400 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            </div>

            {/* Bookmarks Saved Spots Button */}
            <button
              onClick={() => setIsBookmarksOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/40 text-slate-700 dark:text-emerald-300 transition-all group"
              title="Saved Travel Spots"
              aria-label="Saved Destinations"
            >
              <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {bookmarks.length}
                </span>
              )}
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/40 text-slate-700 dark:text-amber-400 transition-all"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 rotate-0 hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 -rotate-12 hover:rotate-0 transition-transform duration-300 text-slate-700" />
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-emerald-950/50 text-slate-700 dark:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 border-t border-slate-200 dark:border-emerald-950/50 bg-white/95 dark:bg-[#07130E]/95 backdrop-blur-xl animate-fadeIn">
          {/* Mobile Search Input */}
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search spots, divisions, vibe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setMobileMenuOpen(false);
                  navigateToPage('destinations');
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors text-left ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                    <span>{link.label}</span>
                  </div>
                  {isActive && <span className="text-xs font-semibold">বর্তমান পেজ</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
