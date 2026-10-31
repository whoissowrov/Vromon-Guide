import React from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DestinationsDirectory from './components/DestinationsDirectory';
import RoutePlanner from './components/RoutePlanner';
import ItinerariesSection from './components/ItinerariesSection';
import BudgetCalculator from './components/BudgetCalculator';
import TravelEssentials from './components/TravelEssentials';
import DestinationModal from './components/DestinationModal';
import BookmarksModal from './components/BookmarksModal';
import Footer from './components/Footer';

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07130E] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <DestinationsDirectory />
        <RoutePlanner />
        <ItinerariesSection />
        <BudgetCalculator />
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
