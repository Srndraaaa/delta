import React, { useState, useRef, useEffect } from 'react';
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
      
      {/* Main Content Layers */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onExploreClick={scrollToFeeds} />

        <main className="flex-1">
          {/* Section 1: Hero Section (with 1.3 Galaxy background, 60% Left, 40% Right) */}
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
