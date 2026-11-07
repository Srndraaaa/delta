import React, { useState, useRef, useEffect } from 'react';
import Galaxy from './components/reactbits/Galaxy';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LogoLoopSection } from './components/LogoLoopSection';
import { FeedSection } from './components/FeedSection';
import { FeedReaderModal } from './components/FeedReaderModal';
import { Footer } from './components/Footer';
import { loadFeeds } from './lib/feedLoader';

export default function App() {
  const [feeds, setFeeds] = useState([]);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const feedSectionRef = useRef(null);

  useEffect(() => {
    // Load markdown feeds dynamically from feeds/ directory
    const loaded = loadFeeds();
    setFeeds(loaded);
  }, []);

  const handleSelectFeed = (feed) => {
    setSelectedFeed(feed);
    setIsModalOpen(true);
  };

  const scrollToFeeds = () => {
    if (feedSectionRef.current) {
      feedSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#040407] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 1.3 Background Antariksa Interaktif (Galaxy) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
        <Galaxy
          density={0.8}
          glowIntensity={0.5}
          flareIntensity={0.8}
          starSpeed={0.3}
          starSize={0.85}
          mouseRepulsion={true}
          clickWarp={true}
          transparent={true}
          backgroundColor="#040407"
          className="w-full h-full"
        />
      </div>

      {/* Main Content Layers */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onExploreClick={scrollToFeeds} />

        <main className="flex-1">
          {/* Section 1: Hero Section (60% left, 40% right) */}
          <HeroSection onExploreClick={scrollToFeeds} />

          {/* Section 2: Logo loop section */}
          <LogoLoopSection />

          {/* Section 3: Feed Section (2-row grid of markdown cards) */}
          <FeedSection
            feeds={feeds}
            onSelectFeed={handleSelectFeed}
            feedSectionRef={feedSectionRef}
          />
        </main>

        {/* Section 4: Footer */}
        <Footer />
      </div>

      {/* Research Paper / Article Markdown Reader Modal */}
      <FeedReaderModal
        feed={selectedFeed}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
