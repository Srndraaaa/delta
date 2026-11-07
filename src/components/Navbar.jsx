import React from 'react';
import { Sparkles, Terminal, Rss, Github, Radio } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function Navbar({ onExploreClick }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#050508]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <span className="font-display font-extrabold text-cyan-400 text-lg tracking-wider">Δ</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-white tracking-tight">Delta Feed</span>
              <Badge variant="default" className="text-[10px] px-2 py-0 border-cyan-500/30">
                v2026.11
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-mono">Agentics AI Dispatch</p>
          </div>
        </div>

        {/* Center: Live telemetry status */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02]">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono text-slate-400">
            Node status: <span className="text-emerald-300 font-medium">Synchronized</span>
          </span>
          <span className="text-xs text-slate-600">|</span>
          <span className="text-xs font-mono text-cyan-400/90">Autonomous Protocol Live</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExploreClick}
            className="hidden sm:inline-flex text-xs font-mono text-slate-300 hover:text-cyan-300"
          >
            <Radio className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            Live Feed
          </Button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Source Code"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
