import React from 'react';
import Galaxy from './reactbits/Galaxy';
import TechText from './reactbits/TechText';
import DitherVeil from './reactbits/DitherVeil';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection({ onExploreClick }) {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden pt-6 pb-16 px-4 sm:px-6 lg:px-8">
      
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
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">

            {/* 1. HIRARKI 1: Judul "Delta Feed" menggunakan component TechText */}
            <h1 className="sr-only">Delta Feed</h1>
            <div aria-hidden="true" className="animate-fade-in opacity-0 [animation-delay:200ms] relative w-full h-[100px] sm:h-[130px] md:h-[150px] -my-2">
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
                Research news for the latest Agentic AI
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
                Research notes on autonomous agents, test-time compute, and MCP integrations.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={onExploreClick}
                  className="font-sans text-sm font-semibold tracking-wide"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Research Feeds
                </Button>
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 animate-fade-in opacity-0 [animation-delay:400ms] relative">
              <div className="relative w-full h-[360px] sm:h-[420px] overflow-hidden cursor-crosshair">
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

              </div>
          </div>

        </div>
      </div>
    </section>
  );
}
