import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DestinationsDirectory from './components/DestinationsDirectory';
import TransitBreakdown from './components/TransitBreakdown';
import RoutePlanner from './components/RoutePlanner';
import ItinerariesSection from './components/ItinerariesSection';
import BudgetCalculator from './components/BudgetCalculator';
import TravelEssentials from './components/TravelEssentials';
import DestinationModal from './components/DestinationModal';
import BookmarksModal from './components/BookmarksModal';
import Footer from './components/Footer';

function AppContent() {
  const [transitSpotKey, setTransitSpotKey] = useState('nafakhum-waterfall');

  const handleSelectTransitSpot = (key) => {
    setTransitSpotKey(key);
    const elem = document.getElementById('transit-stepper');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07130E] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* Destinations Directory with Popular vs Hidden Gems filter toggle */}
        <DestinationsDirectory onSelectTransitSpot={handleSelectTransitSpot} />

        {/* Step-by-Step Local Transit Stepper (লোকাল কানেক্টিভিটি ও লোকাল গাড়ি-ভাড়া) */}
        <div id="transit-stepper" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Interactive Transit Visualizer
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              লোকাল কানেক্টিভিটি ও স্টেপ-বাই-স্টেপ পরিবহন ভাড়া
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              দূরপাল্লার বাস থেকে শুরু করে নদীপথ, চাঁদের গাড়ি, লোকাল সিএনজি এবং ট্রেকিং গাইড—কোন পয়েন্টে কত ভাড়া লাগবে তার নিখুঁত হিসাব।
            </p>
          </div>
          <TransitBreakdown destinationKey={transitSpotKey} />
        </div>

        {/* Full City-to-City Route Planner */}
        <RoutePlanner />

        {/* Tour Itineraries */}
        <ItinerariesSection />

        {/* Interactive Budget Calculator */}
        <BudgetCalculator />

        {/* Emergency Helplines & Travel Essentials */}
        <TravelEssentials />
      </main>
      <Footer />

      {/* Global Modals & Drawers */}
      <DestinationModal />
      <BookmarksModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
