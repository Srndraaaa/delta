import React from 'react';
import Galaxy from './reactbits/Galaxy';
import TechText from './reactbits/TechText';
import DitherVeil from './reactbits/DitherVeil';
import { ArrowDown, Sparkles, Cpu, BookOpen, Orbit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HeroSection({ onExploreClick }) {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden pt-6 pb-16 px-4 sm:px-6 lg:px-8">
      
      {/* ======================================================== */}
      {/* 1.3 Background Antariksa Interaktif (Galaxy)             */}
      {/* Sesuai DESIGN.md: background yang digunakan adalah        */}
      {/* sebuah antariksa interaktif yang perintah-nya bisa        */}
      {/* dilihat di @hero-background.md                            */}
      {/* ======================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
        <Galaxy
          density={1.2}
          glowIntensity={0.8}
          flareIntensity={1.2}
          starSpeed={0.5}
          starSize={1.1}
          mouseRepulsion={true}
          clickWarp={true}
          transparent={false}
          backgroundColor="#040409"
          starColors={['#06b6d4', '#38bdf8', '#818cf8', '#ffffff']}
          className="w-full h-full"
        />
        {/* Soft bottom vignette to blend smoothly into subsequent sections */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#040407]" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* 60% Left / 40% Right Layout (Grid 12 cols: 7 cols left = 58.3% ~ 60%, 5 cols right = 41.7% ~ 40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ======================================================== */}
          {/* 1.1 Bagian Kiri (60%) */}
          {/* 3 Hirarki Text: Judul ("Delta Feed" via TechText),      */}
          {/* Sub-Judul ("Reasearch news for the latest Agentics AI"), */}
          {/* Author text ("D.Rendra ~ 2026" italic)                  */}
          {/* Dengan animasi masuk simple                             */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">
            
            {/* Top pill indicator (animasi masuk stagger 1) */}
            <div className="animate-fade-in opacity-0 [animation-delay:100ms] flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin [animation-duration:8s]" />
                Next-Gen Agentic Intelligence Research
              </span>
            </div>

            {/* 1. HIRARKI 1: Judul "Delta Feed" menggunakan component TechText */}
            <div className="animate-fade-in opacity-0 [animation-delay:200ms] relative w-full h-[100px] sm:h-[130px] md:h-[150px] -my-2">
              <TechText
                text="Delta Feed"
                fontWeight={700}
                fontSize={120}
                align="left"
                color="#f8fafc"
                accentColor="#06b6d4"
                reveal="letter"
                dashLength={5}
                dashGap={3}
                specks={16}
                intro="assemble"
                introDuration={1.8}
                clickKick={true}
                draggable={true}
                className="w-full h-full"
              />
            </div>

            {/* 2. HIRARKI 2: Sub-Judul */}
            <div className="animate-fade-in opacity-0 [animation-delay:350ms]">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-100 to-slate-300 leading-snug">
                Reasearch news for the latest Agentics AI
              </h2>
            </div>

            {/* 3. HIRARKI 3: Author text (italic) */}
            <div className="animate-fade-in opacity-0 [animation-delay:500ms] flex items-center gap-3">
              <div className="h-px w-8 bg-cyan-500/40" />
              <p className="font-serif italic text-base sm:text-lg text-cyan-300/90 font-light tracking-wide">
                D.Rendra ~ 2026
              </p>
              <div className="h-px w-8 bg-cyan-500/40" />
            </div>

            {/* Brief descriptor and CTA buttons */}
            <div className="animate-fade-in opacity-0 [animation-delay:650ms] pt-2 space-y-5">
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl font-sans">
                Curated laboratory dispatches, empirical benchmarks, and architectural paradigms covering autonomous swarms, test-time compute, and standard MCP integrations.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={onExploreClick}
                  className="font-sans text-sm font-semibold tracking-wide"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explore Research Feeds
                  <ArrowDown className="w-4 h-4 ml-2 animate-bounce" />
                </Button>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-400 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>6 Markdown Dispatches</span>
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400">Live Static Feed</span>
                </div>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* 1.2 Bagian Kanan (40%)                                   */}
          {/* Component interaktif keren DitherVeil                    */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 animate-fade-in opacity-0 [animation-delay:400ms] relative">
            
            {/* Ambient decorative back-glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition duration-1000 -z-10" />

            <div className="relative rounded-2xl border border-cyan-500/30 bg-slate-950/70 p-2 shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-xl">
              
              {/* Top window bar simulation */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 text-xs font-mono text-slate-400 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></span>
                  <span className="ml-2 text-slate-300 font-sans text-xs font-medium">Neural Veil • Interactive Vision</span>
                </div>
                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  DITHER SHADER
                </span>
              </div>

              {/* DitherVeil Canvas Container */}
              <div className="relative w-full h-[360px] sm:h-[420px] rounded-xl overflow-hidden cursor-crosshair">
                <DitherVeil
                  src="https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop"
                  pattern="floyd"
                  pixelSize={2}
                  inkColor="#050508"
                  paperColor="#38bdf8"
                  revealRadius={190}
                  softness={0.65}
                  linger={1.2}
                  clickBurst={true}
                  className="w-full h-full"
                />

                {/* Floating interactive hint overlay */}
                <div className="absolute bottom-3 left-3 right-3 pointer-events-none flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                    Interact: Hover cursor & click to burst
                  </span>
                  <span className="text-cyan-400">OGL 2.0</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
