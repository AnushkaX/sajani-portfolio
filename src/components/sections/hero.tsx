'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { SafeImage } from '@/components/ui/safe-image';
import type { SiteContent } from '@/lib/site-content';
import { isVideoUrl } from '@/lib/media';

export default function Hero({ hero }: { hero: SiteContent['hero'] }) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const slides = hero.slides.length > 0 ? hero.slides : hero.image ? [hero.image] : [];

  useEffect(() => {
    if (!playing || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [playing, slides.length]);

  useEffect(() => {
    if (current >= slides.length) setCurrent(0);
  }, [current, slides.length]);

  const activeMedia = slides[current];

  return (
    <section id="home" className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden sm:items-center">
      {activeMedia && isVideoUrl(activeMedia) ? (
        <video
          key={activeMedia}
          src={activeMedia}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${hero.name} featured video`}
        />
      ) : activeMedia ? (
        <SafeImage
          key={activeMedia}
          src={activeMedia}
          alt={hero.name}
          fill
          sizes="100vw"
          priority={current === 0}
          className="animate-kenburns object-cover object-[center_20%]"
        />
      ) : null}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/25 to-black/15" />
      <div className="relative z-20 w-full px-6 pb-28 sm:px-10 md:px-16">
        <div className="mx-auto max-w-wide">
          <p className="animate-fade-up font-sans text-[0.7rem] uppercase tracking-[0.42em] text-white/80">{hero.eyebrow}</p>
          <h1 className="animate-fade-up mt-6 max-w-5xl text-6xl leading-[0.9] text-white sm:text-7xl lg:text-8xl xl:text-9xl" style={{ animationDelay: '120ms' }}>
            {hero.name}
          </h1>
          <p className="animate-fade-up mt-8 max-w-measure font-display text-xl italic leading-snug text-white/85 md:text-2xl" style={{ animationDelay: '240ms' }}>
            {hero.tagline}
          </p>
          <div className="animate-fade-up mt-10 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '380ms' }}>
            <Button asChild size="lg" className="h-12 rounded-none bg-background px-8 font-sans text-[0.7rem] uppercase tracking-[0.22em] text-foreground hover:bg-background/90">
              <Link href="#portfolio">View the work</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-none border-white/70 bg-transparent px-8 font-sans text-[0.7rem] uppercase tracking-[0.22em] text-white hover:bg-white hover:text-foreground">
              <Link href="#contact">Get in touch</Link>
            </Button>
          </div>
        </div>
      </div>
      <a href="#about" aria-label="Scroll to about section" className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-white">
        <ArrowDown className="h-6 w-6 animate-bounce" />
      </a>
      {slides.length > 1 ? (
        <div className="absolute bottom-8 right-6 z-30 flex items-center gap-2 sm:right-10 md:right-16">
          <button
            type="button"
            onClick={() => setCurrent((index) => (index - 1 + slides.length) % slides.length)}
            className="grid h-10 w-10 place-items-center border border-white/40 text-white transition duration-editorial ease-editorial hover:bg-white hover:text-foreground"
            aria-label="Previous banner slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-1.5 px-2" aria-label="Banner slides">
            {slides.map((slide, index) => (
              <button
                key={`${slide}-${index}`}
                type="button"
                onClick={() => setCurrent(index)}
                className={`h-1.5 transition-all ${current === index ? 'w-7 bg-white' : 'w-3 bg-white/45 hover:bg-white/75'}`}
                aria-label={`Show banner slide ${index + 1}`}
                aria-current={current === index}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            className="grid h-10 w-10 place-items-center border border-white/40 text-white transition duration-editorial ease-editorial hover:bg-white hover:text-foreground"
            aria-label={playing ? 'Pause banner carousel' : 'Play banner carousel'}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setCurrent((index) => (index + 1) % slides.length)}
            className="grid h-10 w-10 place-items-center border border-white/40 text-white transition duration-editorial ease-editorial hover:bg-white hover:text-foreground"
            aria-label="Next banner slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
