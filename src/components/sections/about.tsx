import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <Badge>About Me</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">A Story in Every Stitch</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              I'm Sajani Muthusinghe, a passionate and innovative fashion design student with a keen eye for detail and a love for storytelling through textiles. My work explores the intersection of classic tailoring and modern, sustainable practices.
            </p>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              I believe fashion is a form of wearable art that should not only be aesthetically pleasing but also evoke emotion and reflect individuality. My design process is deeply rooted in research, experimentation with unconventional materials, and a commitment to creating timeless pieces that empower the wearer.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="https://placehold.co/550x550.png"
              alt="Portrait of Sajani Muthusinghe"
              data-ai-hint="fashion designer portrait"
              width={550}
              height={550}
              className="rounded-full object-cover w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
