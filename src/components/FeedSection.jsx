import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  CutoutCard,
  CutoutCardAction,
  CutoutCardContent,
  CutoutCardFooter,
  CutoutCardImage,
  CutoutCardMedia,
  CutoutCardOverlay,
  CutoutCardPin,
  CutoutCorner,
  cutoutCardSurfaceClassName,
  useCutoutContentStaggerVariants,
} from '@/components/ui/cutout-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Clock, ArrowUpRight, Filter, BookOpen, Sparkles } from '@keyline-icons/react';

function FeedCardItem({ feed, onSelectFeed }) {
  const stagger = useCutoutContentStaggerVariants();

  return (
    <CutoutCard
      className={cutoutCardSurfaceClassName}
      onClick={() => onSelectFeed(feed)}
    >
      <button
        type="button"
        aria-label={`Read ${feed.title}`}
        onClick={() => onSelectFeed(feed)}
        className="absolute inset-0 z-10 w-full h-full rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-cyan-300"
      />

      {/* Media section with image and cutout corners */}
      <CutoutCardMedia className="h-60 sm:h-64">
        <CutoutCardImage
          alt={feed.title}
          src={feed.image}
        />
        <CutoutCardOverlay />

        {/* Pin badge at top-right with cutout corners */}
        {feed.badge && (
          <CutoutCardPin className="bg-cyan-500 text-slate-950 top-0 right-0 rounded-bl-[16px] px-3.5 py-1 text-xs font-sans font-bold shadow-lg shadow-cyan-500/20 z-10">
            {feed.badge}
            <CutoutCorner
              className="text-cyan-500 absolute top-0 -left-[23px] -rotate-90"
              size={24}
            />
            <CutoutCorner
              className="text-cyan-500 absolute right-0 -bottom-[23px] -rotate-90"
              size={24}
            />
          </CutoutCardPin>
        )}
      </CutoutCardMedia>

      {/* Card Content with motion stagger animation */}
      <CutoutCardContent className="flex-1 flex flex-col justify-between p-6">
        <motion.div
          animate="show"
          className="contents"
          initial="hidden"
          variants={stagger.container}
        >
          <div>
            <motion.h2
              className="text-white mb-2 text-xl font-display leading-snug font-semibold group-hover/cutout:text-cyan-300 transition-colors line-clamp-2"
              variants={stagger.item}
            >
              {feed.title}
            </motion.h2>

            <motion.p
              className="text-slate-400 mb-4 text-xs font-sans leading-relaxed line-clamp-3"
              variants={stagger.item}
            >
              {feed.summary}
            </motion.p>
          </div>

          <motion.div variants={stagger.item} className="space-y-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {feed.tags.slice(0, 3).map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="text-[10px] font-sans px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <CutoutCardFooter className="border-white/10 border-t pt-4 justify-end">
              <span className="text-slate-400 text-xs font-sans tabular-nums flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                {feed.readingTime}
              </span>
            </CutoutCardFooter>
          </motion.div>
        </motion.div>
      </CutoutCardContent>

      {/* Action button revealed on hover */}
      <CutoutCardAction className="right-5 bottom-4 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectFeed(feed);
          }}
          className="bg-blue-700 text-white rounded-full px-4 py-1.5 text-xs font-sans font-semibold shadow-lg shadow-cyan-500/25 transition-transform duration-150 active:scale-95 hover:brightness-110 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
          type="button"
          aria-label={`Read ${feed.title}`}
        >
          <span>Read Paper</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </CutoutCardAction>
    </CutoutCard>
  );
}

export function FeedSection({ feeds, onSelectFeed, feedSectionRef }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(['All']);
    feeds.forEach((feed) => {
      if (feed.category) set.add(feed.category);
    });
    return Array.from(set);
  }, [feeds]);

  // Filter feeds based on search query and category
  const filteredFeeds = useMemo(() => {
    return feeds.filter((feed) => {
      const matchesCategory = selectedCategory === 'All' || feed.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        feed.title.toLowerCase().includes(q) ||
        feed.summary.toLowerCase().includes(q) ||
        feed.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        feed.author.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [feeds, searchQuery, selectedCategory]);

  return (
    <section ref={feedSectionRef} id="feeds" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-sans uppercase tracking-widest text-cyan-400">
              Research Repository
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Agentic AI Research Feeds
          </h2>
          <p className="text-slate-400 text-sm mt-2 font-sans max-w-2xl">
            Directly parsed from markdown dispatches located in the{' '}
            <code className="text-cyan-300 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-500/30">
              feeds/
            </code>{' '}
            directory, presented in Cutout Card format.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            aria-label="Search research feeds"
            placeholder="Search papers, tags, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-xs"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-10">
        <span className="text-xs font-sans text-slate-400 flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          Filter:
        </span>
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelectedCategory(category)}
              className={`min-h-11 px-3 py-1.5 rounded-xl text-xs font-sans transition-all duration-200 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-semibold'
                  : 'bg-white/[0.02] text-slate-400 border-white/5 hover:bg-white/[0.05] hover:text-slate-200'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* 2-Row Feed Card Grid (3 cards per row on large screens = 2 clean rows) */}
      {filteredFeeds.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-white/5 bg-slate-900/30">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="font-display text-lg text-slate-300 font-medium">
            {feeds.length ? 'No research feeds match your search' : 'No research feeds yet'}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {feeds.length
              ? 'Try resetting the search keyword or filter.'
              : 'Add a Markdown file to feeds/ and rebuild the site.'}
          </p>
          {feeds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 min-h-11"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeeds.map((feed, index) => (
            <FeedCardItem
              key={feed.slug || index}
              feed={feed}
              onSelectFeed={onSelectFeed}
            />
          ))}
        </div>
      )}

      {/* Grid Rows Indicator note */}
      <div className="mt-8 flex items-center justify-between text-xs font-sans text-slate-500 border-t border-white/5 pt-4">
        <span>Showing {filteredFeeds.length} research publications</span>
      </div>
    </section>
  );
}
