import React, { createContext, useContext, useState, useEffect } from 'react';
import destinationsData from '../data/destinations.json';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state: dark by default for premium travel look or persisted
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('vromon_theme');
    if (saved) return saved;
    return 'dark'; // rich dark emerald aesthetic default
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [selectedVibe, setSelectedVibe] = useState('All');
  const [activeTab, setActiveTab] = useState('explore');

  // Route planner state
  const [routeFrom, setRouteFrom] = useState('dhaka');
  const [routeTo, setRouteTo] = useState('sajek-valley');

  // Bookmarks (saved spots)
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('vromon_bookmarks');
      return saved ? JSON.parse(saved) : ['sajek-valley', 'tanguar-haor'];
    } catch {
      return ['sajek-valley', 'tanguar-haor'];
    }
  });

  const [activeModalSpot, setActiveModalSpot] = useState(null);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('vromon_theme', theme);
  }, [theme]);

  // Persist bookmarks
  useEffect(() => {
    localStorage.setItem('vromon_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleBookmark = (spotId) => {
    setBookmarks(prev => {
      if (prev.includes(spotId)) {
        return prev.filter(id => id !== spotId);
      } else {
        return [...prev, spotId];
      }
    });
  };

  const planRouteTo = (destinationId) => {
    setRouteTo(destinationId);
    setActiveTab('routes');
    // Scroll smoothly to route section
    const elem = document.getElementById('route-planner');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        selectedDivision,
        setSelectedDivision,
        selectedVibe,
        setSelectedVibe,
        activeTab,
        setActiveTab,
        routeFrom,
        setRouteFrom,
        routeTo,
        setRouteTo,
        bookmarks,
        toggleBookmark,
        activeModalSpot,
        setActiveModalSpot,
        isBookmarksOpen,
        setIsBookmarksOpen,
        planRouteTo,
        destinationsData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
