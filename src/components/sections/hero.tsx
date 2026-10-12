import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { SafeImage } from '@/components/ui/safe-image';
import type { SiteContent } from '@/lib/site-content';

export default function Hero({ hero }: { hero: SiteContent['hero'] }) {
  return (
    <section id="home" className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden sm:items-center">
      <SafeImage
        src={hero.image}
        alt={hero.name}
        fill
        sizes="100vw"
        priority
        className="animate-kenburns object-cover object-[center_20%]"
      />
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
    </section>
  );
}
