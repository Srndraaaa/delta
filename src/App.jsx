import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeedSection } from './components/FeedSection';
import { FeedReaderModal } from './components/FeedReaderModal';
import { Footer } from './components/Footer';
import { loadFeeds } from './lib/feedLoader';
import { useMagneticScroll } from './hooks/useMagneticScroll';

const READ_COUNTS_KEY = 'delta-feed-local-read-counts';
const READ_COUNT_KEY_PREFIX = `${READ_COUNTS_KEY}:`;

function readCountKey(slug) {
  return `${READ_COUNT_KEY_PREFIX}${encodeURIComponent(slug)}`;
}

function loadLocalReadCounts(feeds) {
  const counts = {};
  try {
    const stored = JSON.parse(window.localStorage.getItem(READ_COUNTS_KEY) || '{}');
    if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
      for (const [slug, count] of Object.entries(stored)) {
        if (Number.isSafeInteger(count) && count >= 0) counts[slug] = count;
      }
    }
  } catch {
    // Ignore unavailable or invalid legacy storage.
  }
  for (const { slug } of feeds) {
    try {
      const stored = window.localStorage.getItem(readCountKey(slug));
      if (stored !== null) {
        const count = JSON.parse(stored);
        if (Number.isSafeInteger(count) && count >= 0) counts[slug] = count;
      }
    } catch {
      // Fall back to the legacy count if this entry cannot be read.
    }
  }
  return counts;
}

function withReadCounts(feeds, counts) {
  return feeds.map((feed) => {
    const localReadCount = counts[feed.slug] || 0;
    return {
      ...feed,
      localReadCount,
      ...(feed.readerCount != null ? { readerCount: feed.readerCount + localReadCount } : {}),
    };
  });
}

export default function App() {
  const [baseFeeds] = useState(loadFeeds);
  const [localReadCounts, setLocalReadCounts] = useState(() => loadLocalReadCounts(baseFeeds));
  const readCountsRef = useRef(localReadCounts);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const feedSectionRef = useRef(null);
  const openedLinkRef = useRef(false);
  const feeds = withReadCounts(baseFeeds, localReadCounts);
  const selectedFeed = feeds.find((feed) => feed.slug === selectedSlug);

  const syncFeedUrl = (slug) => {
    const url = new URL(window.location.href);
    const current = url.searchParams.get('feed');
    if ((slug || null) === current) return;
    if (slug) {
      url.searchParams.set('feed', slug);
    } else {
      url.searchParams.delete('feed');
    }
    window.history.pushState({ feed: slug || null }, '', url);
  };

  const recordRead = (slug) => {
    const persisted = loadLocalReadCounts(baseFeeds);
    const counts = { ...readCountsRef.current };
    for (const [key, value] of Object.entries(persisted)) {
      counts[key] = Math.max(counts[key] || 0, value);
    }
    counts[slug] = (counts[slug] || 0) + 1;
    readCountsRef.current = counts;
    setLocalReadCounts(counts);
    try {
      window.localStorage.setItem(readCountKey(slug), JSON.stringify(counts[slug]));
    } catch {
      // Keep the count available for this session if storage is unavailable.
    }
  };

  useEffect(() => {
    const syncReadCounts = (event) => {
      if (event.storageArea !== window.localStorage || (event.key !== null && event.key !== READ_COUNTS_KEY && !event.key.startsWith(READ_COUNT_KEY_PREFIX))) return;
      const counts = loadLocalReadCounts(baseFeeds);
      readCountsRef.current = counts;
      setLocalReadCounts(counts);
    };
    window.addEventListener('storage', syncReadCounts);
    return () => window.removeEventListener('storage', syncReadCounts);
  }, [baseFeeds]);

  // Activate magnetic scroll between Hero and Feed sections
  useMagneticScroll({
    feedRef: feedSectionRef,
    enabled: !isModalOpen,
    navbarHeight: 64,
  });

  useEffect(() => {
    if (openedLinkRef.current) return;
    openedLinkRef.current = true;
    const slug = new URLSearchParams(window.location.search).get('feed');
    const linkedFeed = baseFeeds.find((feed) => feed.slug === slug);
    if (linkedFeed) {
      recordRead(linkedFeed.slug);
      setSelectedSlug(linkedFeed.slug);
      setIsModalOpen(true);
    }
  }, [baseFeeds]);

  useEffect(() => {
    const handlePopState = () => {
      const slug = new URLSearchParams(window.location.search).get('feed');
      const linkedFeed = baseFeeds.find((feed) => feed.slug === slug);
      if (linkedFeed) {
        setSelectedSlug(linkedFeed.slug);
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [baseFeeds]);

  const handleSelectFeed = (feed) => {
    recordRead(feed.slug);
    setSelectedSlug(feed.slug);
    setIsModalOpen(true);
    syncFeedUrl(feed.slug);
  };

  const handleModalOpenChange = (nextOpen) => {
    setIsModalOpen(nextOpen);
    if (!nextOpen) {
      syncFeedUrl(null);
    }
  };

  const scrollToFeeds = () => {
    if (feedSectionRef.current) {
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      feedSectionRef.current.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const handleSelectTag = (tag) => {
    setSearchQuery(tag);
    handleModalOpenChange(false);
    scrollToFeeds();
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
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
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
        feeds={feeds}
        onSelectFeed={handleSelectFeed}
        onSelectTag={handleSelectTag}
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
      />
    </div>
  );
}
