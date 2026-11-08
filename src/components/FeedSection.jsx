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
import { Search, Clock, ArrowUpRight, Filter, BookOpen } from '@keyline-icons/react';

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
        className="absolute inset-0 z-10 w-full h-full rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-cyan-600"
      />

      {/* Media section with image and cutout corners */}
      <CutoutCardMedia className="h-60 sm:h-64">
        <CutoutCardImage
          alt={feed.title}
          src={feed.image}
        />
        <CutoutCardOverlay className="bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Pin badge at top-right with cutout corners in light theme */}
        {feed.badge && (
          <CutoutCardPin className="bg-slate-900 text-white top-0 right-0 rounded-bl-[16px] px-3.5 py-1 text-xs font-sans font-semibold shadow-md z-10">
            {feed.badge}
            <CutoutCorner
              className="text-slate-900 absolute top-0 -left-[23px] -rotate-90"
              size={24}
            />
            <CutoutCorner
              className="text-slate-900 absolute right-0 -bottom-[23px] -rotate-90"
              size={24}
            />
          </CutoutCardPin>
        )}
      </CutoutCardMedia>

      {/* Card Content with motion stagger animation (Light theme) */}
      <CutoutCardContent className="flex-1 flex flex-col justify-between p-6 bg-white">
        <motion.div
          animate="show"
          className="contents"
          initial="hidden"
          variants={stagger.container}
        >
          <div>
            <motion.h2
              className="text-slate-900 mb-2 text-xl font-display leading-snug font-semibold group-hover/cutout:text-cyan-600 transition-colors line-clamp-2"
              variants={stagger.item}
            >
              {feed.title}
            </motion.h2>

            <motion.p
              className="text-slate-600 mb-4 text-xs font-sans leading-relaxed line-clamp-3"
              variants={stagger.item}
            >
              {feed.summary}
            </motion.p>
          </div>

          <motion.div variants={stagger.item} className="space-y-4">
            {/* Tags in light mode */}
            <div className="flex flex-wrap gap-1.5">
              {feed.tags.slice(0, 3).map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="text-[10px] font-sans px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Reading Time Footer */}
            <CutoutCardFooter className="border-slate-100 border-t pt-4 justify-end">
              <span className="text-slate-500 text-xs font-sans tabular-nums flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3 text-cyan-600" />
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
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-4 py-1.5 text-xs font-sans font-semibold shadow-md transition-transform duration-150 active:scale-95 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
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
    <section
      ref={feedSectionRef}
      id="feeds"
      className="relative bg-slate-50 text-slate-900 py-20 px-4 sm:px-6 lg:px-8 transition-colors snap-start scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200/80 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-cyan-600"></span>
              <span className="text-xs font-sans uppercase tracking-widest text-cyan-700 font-semibold">
                Research Repository
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Agentic AI Research Feeds
            </h2>
            <p className="text-slate-600 text-sm mt-2 font-sans max-w-2xl">
              Directly parsed from markdown dispatches located in the{' '}
              <code className="text-cyan-800 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200 font-medium">
                feeds/
              </code>{' '}
              directory, presented in Cutout Card format.
            </p>
          </div>

          {/* Search input (Light Theme) */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              aria-label="Search research feeds"
              placeholder="Search papers, tags, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-xs bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-900 focus-visible:border-slate-900 shadow-xs"
            />
          </div>
        </div>

        {/* Category Pills Filter (Light Theme) */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <span className="text-xs font-sans text-slate-500 flex items-center gap-1.5 mr-2 font-medium">
            <Filter className="w-3.5 h-3.5 text-cyan-600" />
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
                className={`min-h-11 px-3.5 py-1.5 rounded-xl text-xs font-sans transition-all duration-200 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-xs'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Card Grid in Light Theme */}
        {filteredFeeds.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-slate-200 bg-white shadow-xs">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="font-display text-lg text-slate-800 font-medium">
              {feeds.length ? 'No research feeds match your search' : 'No research feeds yet'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
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
                className="mt-4 min-h-11 bg-white border-slate-300 text-slate-800 hover:bg-slate-50"
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
        <div className="mt-8 flex items-center justify-between text-xs font-sans text-slate-500 border-t border-slate-200/80 pt-4">
          <span>Showing {filteredFeeds.length} research publications</span>
        </div>
      </div>
    </section>
  );
}
