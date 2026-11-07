import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Clock, Calendar, User, ArrowUpRight, Filter, BookOpen } from 'lucide-react';

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
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Live Research Repository
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Agentic AI Research Feeds
          </h2>
          <p className="text-slate-400 text-sm mt-2 font-sans max-w-2xl">
            Directly parsed from markdown dispatches located in the <code className="text-cyan-300 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-500/30">feeds/</code> directory.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search papers, tags, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-xs"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-10">
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          Filter:
        </span>
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 border ${
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
          <h3 className="font-display text-lg text-slate-300 font-medium">No research feeds match your search</h3>
          <p className="text-sm text-slate-500 mt-1">Try resetting the search keyword or filter.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeeds.map((feed, index) => (
            <Card
              key={feed.slug || index}
              onClick={() => onSelectFeed(feed)}
              className="cursor-pointer flex flex-col justify-between group"
            >
              {/* Card Thumbnail Image */}
              <div className="relative w-full h-44 overflow-hidden bg-slate-950">
                <img
                  src={feed.image}
                  alt={feed.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Badges on top of image */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <Badge variant="default" className="text-[11px] bg-slate-950/80 backdrop-blur-md">
                    {feed.category}
                  </Badge>
                  {feed.badge && (
                    <Badge variant="emerald" className="text-[11px] bg-slate-950/80 backdrop-blur-md">
                      {feed.badge}
                    </Badge>
                  )}
                </div>

                <div className="absolute bottom-2.5 left-3 flex items-center gap-2 text-[11px] font-mono text-slate-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {feed.readingTime}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <CardHeader className="flex-1 pb-3">
                <CardTitle className="text-lg line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors">
                  {feed.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 text-xs text-slate-400 mt-2">
                  {feed.summary}
                </CardDescription>
              </CardHeader>

              {/* Tags */}
              <div className="px-6 pb-4 flex flex-wrap gap-1.5">
                {feed.tags.slice(0, 3).map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Card Footer */}
              <CardFooter className="pt-3 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-2 text-slate-400">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs truncate max-w-[140px]">{feed.author}</span>
                </div>

                <div className="flex items-center gap-1 text-cyan-400 font-mono text-xs font-medium group-hover:translate-x-1 transition-transform">
                  <span>Read Paper</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Grid Rows Indicator note */}
      <div className="mt-8 flex items-center justify-between text-xs font-mono text-slate-500 border-t border-white/5 pt-4">
        <span>Showing {filteredFeeds.length} research publications (2-row grid architecture)</span>
        <span className="text-cyan-400">feeds/*.md sync active</span>
      </div>
    </section>
  );
}
