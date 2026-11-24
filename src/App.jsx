import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HomeNavigationHub from './components/HomeNavigationHub';
import PageHeader from './components/PageHeader';
import DestinationsDirectory from './components/DestinationsDirectory';
import TransitBreakdown from './components/TransitBreakdown';
import LocalFoodGuide from './components/LocalFoodGuide';
import RoutePlanner from './components/RoutePlanner';
import ItinerariesSection from './components/ItinerariesSection';
import BudgetCalculator from './components/BudgetCalculator';
import TravelEssentials from './components/TravelEssentials';
import DestinationModal from './components/DestinationModal';
import CommunityPhotosModal from './components/CommunityPhotosModal';
import BookmarksModal from './components/BookmarksModal';
import LivePhotoVerificationModal from './components/LivePhotoVerificationModal';
import Footer from './components/Footer';

function AppContent() {
  const { currentPage, navigateToPage } = useApp();
  const [transitSpotKey, setTransitSpotKey] = useState('nafakhum-waterfall');

  const handleSelectTransitSpot = (key) => {
    setTransitSpotKey(key);
    navigateToPage('transit');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07130E] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {/* ================= PAGE ROUTING SWITCH ================= */}

        {/* 1. HOME HUB PAGE */}
        {currentPage === 'home' && (
          <div>
            <Hero />
            <HomeNavigationHub />
          </div>
        )}

        {/* 2. OPTION 01: DESTINATIONS & NEARBY PAGE */}
        {currentPage === 'destinations' && (
          <div className="animate-fadeIn">
            <PageHeader 
              moduleNumber="০১" 
              titleBn="দর্শনীয় স্থান ও লাইভ জিপিএস রেডার" 
              titleEn="Destinations & Near Me Live Radar"
              description="৮টি বিভাগের ৫২টি প্রাকৃতিক ও ঐতিহাসিক পর্যটন স্পট, জনপ্রিয় বনাম অফবিট ফিল্টার, অন-সাইট লাইভ ছবি যাচাই এবং আপনার বর্তমান লোকেশনের সাপেক্ষে নিকটবর্তী স্থান খোঁজার সুবিধা।"
              badgeText="৫২+ ট্যুরিস্ট স্পট"
            />
            <div className="pt-4">
              <DestinationsDirectory onSelectTransitSpot={handleSelectTransitSpot} />
            </div>
          </div>
        )}

        {/* 3. OPTION 02: LOCAL TRANSIT & STEPPER PAGE */}
        {currentPage === 'transit' && (
          <div className="animate-fadeIn">
            <PageHeader 
              moduleNumber="০২" 
              titleBn="লোকাল ট্রানজিট ও স্টেপ-বাই-স্টেপ পরিবহন ভাড়া" 
              titleEn="Local Transit & Point-to-Point Fare Stepper"
              description="দূরপাল্লার বাস থেকে শুরু করে নদীপথ, চাঁদের গাড়ি, লোকাল সিএনজি এবং পাহাড়ি ট্রেকিং গাইড—কোন পয়েন্টে কত ভাড়া লাগবে তার নিখুঁত ও নির্ভরযোগ্য হিসাব।"
              badgeText="লাইভ ফেয়ার ক্যালকুলেটর"
            />
            <div id="transit-stepper" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <TransitBreakdown destinationKey={transitSpotKey} />
            </div>
          </div>
        )}

        {/* 4. OPTION 03: REGIONAL FOOD & DIRECT MAPS PAGE */}
        {currentPage === 'food' && (
          <div className="animate-fadeIn">
            <PageHeader 
              moduleNumber="০৩" 
              titleBn="আঞ্চলিক আসল ও ঐতিহ্যবাহী খাবার" 
              titleEn="Regional Authentic Foods & Direct Restaurant Maps"
              description="বগুড়ার আসল দই ও ক্ষীরসা, রাজশাহীর কালাই রুটি-হাঁসের মাংস, নাটোরের কাঁচাগোল্লা থেকে মেজবানি মাংস—৮টি বিভাগের ৩০টি খাঁটি খাবারের আসল ছবি, সঠিক দাম ও সেরা দোকানের গুগল ম্যাপ ডিরেকশন।"
              badgeText="৩০টি আসল খাবার"
            />
            <div className="pt-4">
              <LocalFoodGuide />
            </div>
          </div>
        )}

        {/* 5. OPTION 04: CITY-TO-CITY ROUTE PLANNER PAGE */}
        {currentPage === 'routes' && (
          <div className="animate-fadeIn">
            <PageHeader 
              moduleNumber="০৪" 
              titleBn="স্মার্ট রুট প্ল্যানার (জেলা থেকে জেলা)" 
              titleEn="City-to-City Inter-District Route Planner"
              description="আপনার জেলা শহর থেকে কাঙ্ক্ষিত পর্যটন কেন্দ্রে সহজে পৌঁছানোর সরাসরি রুট, ট্রেন ও বাসের সময়সূচি, কিলোমিটার দূরত্ব এবং বিকল্প ড্রাইভ সংযোগ।"
              badgeText="আন্তঃজেলা কানেক্টিভিটি"
            />
            <div className="pt-4">
              <RoutePlanner />
            </div>
          </div>
        )}

        {/* 6. OPTION 05: READY-TO-GO TOUR ITINERARIES PAGE */}
        {currentPage === 'itineraries' && (
          <div className="animate-fadeIn">
            <PageHeader 
              moduleNumber="০৫" 
              titleBn="রেডিমেড ট্যুর আইটিনারারি" 
              titleEn="Curated Ready-to-Go Tour Itineraries"
              description="সাজেক ভ্যালি, সেন্টমার্টিন দ্বীপ, সুন্দরবন, বান্দরবান কিংবা শ্রীমঙ্গলের জন্য ২-৪ দিনের প্রস্তুত ভ্রমণ পরিকল্পনা। দিনভিত্তিক অ্যাক্টিভিটি টাইমলাইন ও সেরা বাজেট গাইড।"
              badgeText="২-৪ দিনের সাজানো প্ল্যান"
            />
            <div className="pt-4">
              <ItinerariesSection />
            </div>
          </div>
        )}

        {/* 7. OPTION 06: TRAVEL BUDGET CALCULATOR PAGE */}
        {currentPage === 'calculator' && (
          <div className="animate-fadeIn">
            <PageHeader 
              moduleNumber="০৬" 
              titleBn="স্মার্ট বাজেট ক্যালকুলেটর" 
              titleEn="Interactive Tour Budget Calculator"
              description="কতজন ট্রাভেলার, কত দিন থাকবেন, হোটেলের ক্যাটাগরি এবং খাবারের ধরণের ওপর ভিত্তি করে সম্পূর্ণ সফরের মাথাপিছু ও মোট খরচ নিখুঁতভাবে হিসাব করুন।"
              badgeText="রিয়েল-টাইম হিসাব"
            />
            <div className="pt-4">
              <BudgetCalculator />
            </div>
          </div>
        )}

        {/* 8. OPTION 07: EMERGENCY HELPLINES & ESSENTIALS PAGE */}
        {currentPage === 'emergency' && (
          <div className="animate-fadeIn">
            <PageHeader 
              moduleNumber="০৭" 
              titleBn="জরুরি ট্রাভেল গাইড ও হেল্পলাইন" 
              titleEn="Emergency Helplines & Travel Essentials"
              description="ট্যুরিস্ট পুলিশ, জরুরি হেল্পলাইন ৯৯৯, প্রয়োজনীয় প্যাকিং চেকলিস্ট, ফার্স্ট এইড ও লোকাল কালচার নির্দেশিকা—একটি নিরাপদ ও স্বস্তিদায়ক ভ্রমণের পূর্ণ প্রস্তুতি।"
              badgeText="নিরাপত্তা ও হেল্পলাইন"
            />
            <div className="pt-4">
              <TravelEssentials />
            </div>
          </div>
        )}

      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <DestinationModal />
      <CommunityPhotosModal />
      <BookmarksModal />
      <LivePhotoVerificationModal />
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
