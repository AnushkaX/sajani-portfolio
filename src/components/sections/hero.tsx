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
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/35 to-black/25" />
      <div className="relative z-20 w-full px-6 pb-24 sm:px-10 md:px-16">
        <div className="mx-auto max-w-screen-2xl">
          <p className="animate-fade-up text-xs uppercase tracking-[0.42em] text-white/80">{hero.eyebrow}</p>
          <h1 className="animate-fade-up mt-4 max-w-4xl text-5xl leading-[0.95] tracking-wide text-white sm:text-7xl lg:text-8xl" style={{ animationDelay: '120ms' }}>
            {hero.name}
          </h1>
          <p className="animate-fade-up mt-6 max-w-xl text-lg italic text-white/85 md:text-xl" style={{ animationDelay: '240ms' }}>
            {hero.tagline}
          </p>
          <div className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '380ms' }}>
            <Button asChild size="lg" className="rounded-none px-8 uppercase tracking-[0.18em]">
              <Link href="#portfolio">View the work</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-none border-white/80 bg-transparent px-8 uppercase tracking-[0.18em] text-white hover:bg-white hover:text-foreground">
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
            className="grid h-9 w-9 place-items-center border border-white/50 text-white transition hover:bg-white hover:text-foreground"
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
            className="grid h-9 w-9 place-items-center border border-white/50 text-white transition hover:bg-white hover:text-foreground"
            aria-label={playing ? 'Pause banner carousel' : 'Play banner carousel'}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setCurrent((index) => (index + 1) % slides.length)}
            className="grid h-9 w-9 place-items-center border border-white/50 text-white transition hover:bg-white hover:text-foreground"
            aria-label="Next banner slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
