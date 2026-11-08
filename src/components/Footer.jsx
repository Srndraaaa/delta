import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#030306] py-12 px-4 sm:px-6 lg:px-8 text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-3">
          <span className="font-display font-bold text-xl text-white">Delta Feed</span>
          <p className="text-sm max-w-md">Research news for the latest Agentic AI.</p>
          <p className="text-sm italic text-cyan-300">Curated by D.Rendra ~ 2026</p>
        </div>
        <p className="text-xs text-slate-400">© 2026 Delta Feed</p>
      </div>
    </footer>
  );
}
