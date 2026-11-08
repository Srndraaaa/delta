import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeedSection } from './components/FeedSection';
import { FeedReaderModal } from './components/FeedReaderModal';
import { Footer } from './components/Footer';
import { loadFeeds } from './lib/feedLoader';
import { useMagneticScroll } from './hooks/useMagneticScroll';

export default function App() {
  const [feeds] = useState(loadFeeds);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const feedSectionRef = useRef(null);

  // Activate magnetic scroll between Hero and Feed sections
  useMagneticScroll({
    feedRef: feedSectionRef,
    enabled: !isModalOpen,
    navbarHeight: 64,
  });

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('feed');
    const linkedFeed = feeds.find((feed) => feed.slug === slug);
    if (linkedFeed) {
      setSelectedFeed(linkedFeed);
      setIsModalOpen(true);
    }
  }, [feeds]);

  const handleSelectFeed = (feed) => {
    setSelectedFeed(feed);
    setIsModalOpen(true);
  };

  const scrollToFeeds = () => {
    if (feedSectionRef.current) {
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      feedSectionRef.current.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#040407] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Main Content Layers */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onExploreClick={scrollToFeeds} />

        <main className="flex-1">
          {/* Section 1: Hero Section (with Galaxy background, 60% Left, 40% Right, and Logo Loop at bottom) */}
          <HeroSection onExploreClick={scrollToFeeds} />

          {/* Soft black to white gradient transition */}
          <div
            aria-hidden="true"
            className="w-full h-32 sm:h-44 lg:h-56 pointer-events-none -mb-px"
            style={{
              background: 'linear-gradient(to bottom, #040407 0%, #070b16 12%, #0f172a 25%, #1e293b 40%, #334155 54%, #64748b 67%, #94a3b8 78%, #cbd5e1 87%, #e2e8f0 94%, #f8fafc 100%)',
            }}
          />

          {/* Section 2: Feed Section (Light Theme) */}
          <FeedSection
            feeds={feeds}
            onSelectFeed={handleSelectFeed}
            feedSectionRef={feedSectionRef}
          />

          {/* Soft white to black gradient transition to footer */}
          <div
            aria-hidden="true"
            className="w-full h-28 sm:h-40 pointer-events-none -mt-px"
            style={{
              background: 'linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 15%, #cbd5e1 32%, #94a3b8 50%, #475569 68%, #1e293b 82%, #0f172a 92%, #030306 100%)',
            }}
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
