import { SafeImage } from '@/components/ui/safe-image';
import type { SiteContent } from '@/lib/site-content';

export default function About({ about, name }: { about: SiteContent['about']; name: string }) {
  return (
    <section id="about" aria-labelledby="about-title" className="section scroll-mt-20">
      <div className="container max-w-wide">
        <div className="grid items-end gap-14 lg:grid-cols-12 lg:gap-0">
          <figure className="reveal-on-scroll lg:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
              <SafeImage
                src={about.image}
                alt={`Portrait of ${name}`}
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover object-[center_18%]"
              />
            </div>
          </figure>

          <div className="reveal-on-scroll lg:col-span-5 lg:col-start-8 lg:pb-8">
            <div className="stagger-copy">
            {about.eyebrow ? <p className="eyebrow">{about.eyebrow}</p> : null}
            <h2 id="about-title" className="mt-5 break-words text-[clamp(2.4rem,8vw,4.5rem)] leading-[0.95]">
              {about.title}
            </h2>
            {about.summary ? (
              <p className="mt-8 font-display text-xl italic leading-snug text-foreground/85 md:text-2xl">
                {about.summary}
              </p>
            ) : null}
            <div className="mt-8 max-w-measure space-y-5 text-base leading-8 tracking-wide text-muted-foreground">
              {about.paragraphOne ? <p>{about.paragraphOne}</p> : null}
              {about.paragraphTwo ? <p>{about.paragraphTwo}</p> : null}
            </div>

            <p className="mt-10 font-signature text-5xl leading-none text-foreground md:text-6xl" aria-hidden="true">
              {name}
            </p>
            </div>

            <dl className="mt-12 grid gap-8 border-t border-foreground/15 pt-8">
              {about.studyLine ? (
                <div className="grid gap-3 sm:grid-cols-[7rem_1fr] sm:items-baseline">
                  <dt className="eyebrow">Studying</dt>
                  <dd className="text-sm tracking-wide text-foreground">{about.studyLine}</dd>
                </div>
              ) : null}
              {about.expertise.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-[7rem_1fr] sm:items-baseline">
                  <dt className="eyebrow">Practice</dt>
                  <dd>
                    <ul className="grid gap-x-8 gap-y-2 text-sm tracking-wide text-muted-foreground sm:grid-cols-2">
                      {about.expertise.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
