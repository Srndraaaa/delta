import React from 'react';
import { Sparkles, Terminal, Globe, Heart, Shield, Layers, FileCode } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#030306] pt-16 pb-12 overflow-hidden text-slate-400">
      {/* Decorative gradient beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          
          {/* Col 1: Delta Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-display font-bold">
                Δ
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">Delta Feed</span>
            </div>
            
            <p className="text-sm text-slate-400 max-w-md leading-relaxed font-sans">
              Reasearch news for the latest Agentics AI. Open laboratory dispatches, benchmarks, and multi-agent systems analysis.
            </p>

            <div className="text-xs font-mono text-cyan-300/80 italic font-serif">
              Curated by D.Rendra ~ 2026
            </div>
          </div>

          {/* Col 2: Free Hosting & Deployment */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-white tracking-wider uppercase">
              Free Deployment
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-400">
              <li className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cloudflare Pages (Zero-config)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Vercel / Netlify Free Tier</span>
              </li>
              <li className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>GitHub Pages (Actions)</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Markdown Architecture */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-white tracking-wider uppercase">
              Markdown Driven
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Add any <code className="text-cyan-400 font-mono">.md</code> file with frontmatter into <code className="text-cyan-400 font-mono">feeds/</code> to publish research instantly.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03] border border-white/5 text-[11px] font-mono text-emerald-400">
              <FileCode className="w-3 h-3" />
              <span>Static Feed Engine</span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © 2026 Delta Feed. Architectural design by D.Rendra. Free & Open-Source.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Autonomous Protocol: Online
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
