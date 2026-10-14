'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { SafeImage } from '@/components/ui/safe-image';
import type { SiteContent } from '@/lib/site-content';
import { isVideoUrl } from '@/lib/media';

function subtitleFrom(eyebrow: string) {
  const value = eyebrow.trim() || 'Fashion design';
  return /portfolio/i.test(value) ? value : `${value} portfolio`;
}

export default function Hero({ hero }: { hero: SiteContent['hero'] }) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const slides = hero.slides.length > 0 ? hero.slides : hero.image ? [hero.image] : [];
  const nameLines = hero.name.trim().split(/\s+/);

  useEffect(() => {
    if (!playing || slides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
    <section
      id="home"
      aria-label="Introduction"
      className="relative isolate flex min-h-[100svh] w-full items-end overflow-hidden bg-foreground text-background"
    >
      <div key={activeMedia} className="animate-hero-media absolute inset-0 -z-10">
        {activeMedia && isVideoUrl(activeMedia) ? (
          <video
            src={activeMedia}
            className="h-full w-full object-cover object-[center_25%]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={`${hero.name} featured film`}
          />
        ) : activeMedia ? (
          <SafeImage
            src={activeMedia}
            alt={`${hero.name}, featured look from the portfolio`}
            fill
            sizes="100vw"
            priority={current === 0}
            className="object-cover object-[64%_30%] md:object-[60%_22%]"
          />
        ) : null}
      </div>

      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-black/10 md:bg-gradient-to-r md:from-black/65 md:via-black/25 md:to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

      <div className="container relative max-w-wide pb-32 md:pb-28 lg:pb-32">
        <div className="max-w-[72rem]">
          <p
            className="animate-hero-text max-w-full break-words font-sans text-[0.62rem] font-medium uppercase tracking-[0.22em] text-background/80 sm:tracking-[0.36em] md:text-[0.72rem]"
            style={{ animationDelay: '300ms' }}
          >
            {subtitleFrom(hero.eyebrow)}
          </p>

          <h1 className="mt-6 max-w-full break-words font-display text-[clamp(1.65rem,11vw,8.5rem)] font-normal uppercase leading-[0.88] tracking-[-0.02em] md:mt-8">
            {nameLines.map((line, index) => (
              <span key={`${line}-${index}`} className="block overflow-hidden pb-[0.06em]">
                <span
                  className="animate-hero-line block"
                  style={{ animationDelay: `${450 + index * 160}ms` }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between md:gap-16">
            <p
              className="animate-hero-text max-w-md font-display text-xl italic leading-snug text-background/90 md:text-2xl lg:text-[1.75rem]"
              style={{ animationDelay: '900ms' }}
            >
              {hero.tagline}
            </p>
            <Link
              href="/#portfolio"
              className="animate-hero-text group inline-flex w-fit max-w-full items-center gap-4 py-3 font-sans text-[0.68rem] font-medium uppercase tracking-[0.18em] text-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-background focus-visible:ring-offset-4 focus-visible:ring-offset-transparent sm:tracking-[0.28em]"
              style={{ animationDelay: '1050ms' }}
            >
              Explore collections
              <span aria-hidden="true" className="block h-px w-10 bg-background transition-all duration-editorial ease-editorial group-hover:w-16" />
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-5 z-30 grid grid-cols-[1fr_auto_1fr] items-end gap-3 md:inset-x-10 md:bottom-8">
        <span />
        <a
          href="#about"
          className="animate-hero-text flex flex-col items-center gap-3 font-sans text-[0.6rem] uppercase tracking-[0.22em] text-background/80 transition-colors hover:text-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-background focus-visible:ring-offset-4 sm:tracking-[0.32em]"
          style={{ animationDelay: '1300ms' }}
        >
          <span>Scroll</span>
          <span aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-background/25">
            <span className="animate-scroll-cue absolute inset-x-0 top-0 block h-1/2 bg-background" />
          </span>
        </a>
        {slides.length > 1 ? (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setCurrent((index) => (index - 1 + slides.length) % slides.length)}
              className="grid h-10 w-10 place-items-center border border-background/40 transition duration-editorial ease-editorial hover:bg-background hover:text-foreground"
              aria-label="Previous banner slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="hidden gap-1.5 px-1 sm:flex" aria-label="Banner slides">
              {slides.map((slide, index) => (
                <button
                  key={`${slide}-${index}`}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className={`h-px py-2 transition-all duration-editorial ease-editorial ${current === index ? 'w-8' : 'w-4 opacity-50 hover:opacity-80'}`}
                  aria-label={`Show banner slide ${index + 1}`}
                  aria-current={current === index}
                >
                  <span className="block h-px w-full bg-background" />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              className="grid h-10 w-10 place-items-center border border-background/40 transition duration-editorial ease-editorial hover:bg-background hover:text-foreground"
              aria-label={playing ? 'Pause banner carousel' : 'Play banner carousel'}
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setCurrent((index) => (index + 1) % slides.length)}
              className="grid h-10 w-10 place-items-center border border-background/40 transition duration-editorial ease-editorial hover:bg-background hover:text-foreground"
              aria-label="Next banner slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : <span />}
      </div>
    </section>
  );
}
