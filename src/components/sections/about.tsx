import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">About Me</h2>
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-2">
              <Image
                src="https://placehold.co/400x500.png"
                alt="Portrait of Alexia Dubois"
                data-ai-hint="fashion designer portrait"
                width={400}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-3 p-8 md:p-0">
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h3 className="text-2xl font-headline text-primary mb-2">Alexia Dubois</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A passionate and innovative fashion design student with a keen eye for detail and a love for storytelling through textiles. My work explores the intersection of classic tailoring and modern, sustainable practices.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-headline text-primary mb-2">Design Philosophy</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    I believe fashion is a form of wearable art that should not only be aesthetically pleasing but also evoke emotion and reflect individuality. My design process is deeply rooted in research, experimentation with unconventional materials, and a commitment to creating timeless pieces that empower the wearer.
                  </p>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
