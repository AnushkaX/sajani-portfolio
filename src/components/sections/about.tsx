import { SafeImage } from '@/components/ui/safe-image';
import { SectionHeading } from './section-heading';
import type { SiteContent } from '@/lib/site-content';

export default function About({ about }: { about: SiteContent['about'] }) {
  return (
    <section id="about" className="section scroll-mt-24">
      <div className="container">
        <div className="grid items-start gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="reveal-on-scroll relative lg:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <SafeImage
                src={about.image}
                alt={about.title}
                fill
                sizes="(max-width: 1024px) 90vw, 42vw"
                className="object-cover object-[center_15%]"
              />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-24">
            <SectionHeading
              eyebrow={about.eyebrow}
              title={about.title}
              description={about.summary}
              align="left"
            />
            <div className="reveal-on-scroll max-w-measure space-y-6 text-base leading-8 tracking-wide text-muted-foreground md:text-lg">
              <p>{about.paragraphOne}</p>
              <p>{about.paragraphTwo}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
