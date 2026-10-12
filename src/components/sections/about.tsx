import { SafeImage } from '@/components/ui/safe-image';
import { SectionHeading } from './section-heading';
import type { SiteContent } from '@/lib/site-content';

export default function About({ about }: { about: SiteContent['about'] }) {
  return (
    <section id="about" className="scroll-mt-24 py-20 md:py-28 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="reveal-on-scroll relative mx-auto w-full max-w-md">
            <div className="absolute -left-3 -top-3 hidden h-full w-full border border-primary/25 sm:block" />
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <SafeImage
                src={about.image}
                alt={about.title}
                fill
                sizes="(max-width: 1024px) 90vw, 480px"
                className="object-cover object-[center_15%]"
              />
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow={about.eyebrow}
              title={about.title}
              description={about.summary}
              align="left"
            />
            <div className="reveal-on-scroll mx-auto max-w-xl space-y-5 text-lg leading-relaxed text-muted-foreground lg:mx-0">
              <p>{about.paragraphOne}</p>
              <p>{about.paragraphTwo}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
