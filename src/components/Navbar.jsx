import React from 'react';
import { BookOpen } from '@keyline-icons/react';
import { Button } from '@/components/ui/button';

export function Navbar({ onExploreClick }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#050508]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <span className="font-display font-extrabold text-cyan-400 text-lg tracking-wider">Δ</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-white tracking-tight">Delta Feed</span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-sans">Agentics AI Dispatch</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExploreClick}
            className="min-h-11 text-xs font-sans text-slate-300 hover:text-cyan-300"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            Research Feed
          </Button>
        </div>
      </div>
    </header>
  );
}
