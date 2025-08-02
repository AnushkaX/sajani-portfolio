import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <Image
        src="https://placehold.co/1920x1080.png"
        alt="Featured fashion design"
        data-ai-hint="fashion runway model"
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-20 flex h-full flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Alexia Dubois
        </h1>
        <p className="mt-4 max-w-xl text-lg text-primary-foreground/80 md:text-xl">
          An innovative fashion designer crafting narratives through sustainable and avant-garde collections.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="#portfolio">View My Work</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-background">
                <Link href="#contact">Get In Touch</Link>
            </Button>
        </div>
      </div>
       <div className="absolute bottom-10 z-20 text-white">
          <a href="#about" aria-label="Scroll to about section">
            <ArrowDown className="h-8 w-8 animate-bounce" />
          </a>
       </div>
    </section>
  );
}
