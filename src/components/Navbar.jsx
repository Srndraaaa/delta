import React from 'react';
import { BookOpen } from '@keyline-icons/react';
import { Button } from '@/components/ui/button';

export function Navbar({ onExploreClick }) {
  return (
    <header className="sticky top-0 z-40 h-16 w-full px-2 sm:px-4 lg:px-6 pointer-events-none">
      <div className="h-full flex items-center">
        <nav
          aria-label="Primary"
          className="pointer-events-auto mx-auto flex h-[52px] w-full max-w-5xl items-center justify-between gap-2 rounded-full border border-white/10 bg-[#050508]/85 px-2.5 sm:px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          {/* Left: Brand */}
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <span className="font-display font-extrabold text-cyan-400 text-lg tracking-wider">Δ</span>
            </div>

            <div className="min-w-0">
              <span className="block truncate font-display font-bold text-lg text-white tracking-tight">Delta Feed</span>
              <p className="text-[11px] text-slate-400 hidden sm:block font-sans">Agentics AI Dispatch</p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex shrink-0 items-center">
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
        </nav>
      </div>
    </header>
  );
}