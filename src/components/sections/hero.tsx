import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero() {
  return (
    <section id="home" className="relative h-[calc(100vh-4rem)] w-full">
      <Image
        src="https://placehold.co/1920x1080.png"
        alt="Featured fashion design"
        data-ai-hint="fashion design"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl drop-shadow-md">
          Alexia Dubois
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl font-body drop-shadow">
          Emerging Fashion Designer
        </p>
        <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="#portfolio">View Portfolio</Link>
        </Button>
      </div>
    </section>
  );
}
