import Link from 'next/link';
import { SafeImage } from '@/components/ui/safe-image';
import { CASE_STUDY_SECTIONS, sectionHasContent, type CaseStudySectionDefinition } from '@/lib/case-study';
import { isVideoUrl } from '@/lib/media';
import type { Project } from '@/lib/projects';
import { CollectionGallery } from './collection-gallery';
import { StudyImages } from './study-images';

function fieldText(project: Project, section: CaseStudySectionDefinition, key: string) {
  const block = project.caseStudy?.[section.key] as Record<string, string | string[] | undefined> | undefined;
  const value = block?.[key];
  return typeof value === 'string' ? value.trim() : '';
}

function fieldImages(project: Project, section: CaseStudySectionDefinition, key: string) {
  const block = project.caseStudy?.[section.key] as Record<string, string | string[] | undefined> | undefined;
  const value = block?.[key];
  return Array.isArray(value) ? value.filter((src) => src && src !== project.coverImage) : [];
}

function ProcessSection({ project, section }: { project: Project; section: CaseStudySectionDefinition }) {
  if (!sectionHasContent(section, project.caseStudy)) return null;

  return (
    <section aria-labelledby={`section-${section.key}`} className="border-t border-foreground/10 py-16 md:py-24">
      <div className="container max-w-wide reveal-on-scroll">
        <h2 id={`section-${section.key}`} className="text-4xl leading-[0.95] md:text-6xl">
          {section.title}
        </h2>
        <div className="mt-12 space-y-16 md:mt-16">
          {section.fields.map((field) => {
            if (field.kind === 'text') {
              const text = fieldText(project, section, field.key);
              if (!text) return null;
              return (
                <p key={field.key} className="max-w-3xl text-base leading-8 tracking-wide text-muted-foreground md:text-lg">
                  {text}
                </p>
              );
            }
            const images = fieldImages(project, section, field.key);
            if (images.length === 0) return null;
            return <StudyImages key={field.key} label={field.label} images={images} />;
          })}
        </div>
      </div>
    </section>
  );
}

export function CollectionCaseStudy({
  project,
  previous,
  next,
}: {
  project: Project;
  previous: Project | null;
  next: Project | null;
}) {
  const gallery = project.images.filter((src) => src && src !== project.coverImage);
  const finalSection = CASE_STUDY_SECTIONS.find((section) => section.key === 'final');
  const finalNotes = finalSection ? fieldText(project, finalSection, 'notes') : '';
  const details = finalSection ? fieldImages(project, finalSection, 'details') : [];
  const showFinalNotes = Boolean(finalNotes) || details.length > 0;

  return (
    <article>
      <header className="flex flex-col gap-8 px-6 py-8 lg:h-[calc(100svh-5rem)] lg:justify-between lg:gap-5 lg:px-12 lg:py-6 xl:px-16">
        <div className="grid min-h-0 flex-1 items-center gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-12">
          {project.coverImage ? (
            <div className="relative mx-auto h-[min(42svh,22rem)] w-full max-w-md bg-muted lg:mx-0 lg:h-full lg:max-w-none">
              {isVideoUrl(project.coverImage) ? (
                <video
                  src={project.coverImage}
                  className="h-full w-full object-contain"
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={`${project.title} collection film`}
                />
              ) : (
                <SafeImage
                  src={project.coverImage}
                  alt={`${project.title} collection`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-contain"
                />
              )}
            </div>
          ) : null}
          <div className="flex min-w-0 flex-col justify-center lg:min-h-0 lg:overflow-y-auto">
            {project.category ? <p className="eyebrow">{project.category}</p> : null}
            <h1 className="mt-3 break-words text-[clamp(1.75rem,3.4vw,3.25rem)] leading-[0.95]">{project.title}</h1>
            {project.date ? (
              <p className="mt-4 font-sans text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">{project.date}</p>
            ) : null}
            {project.description ? (
              <p className="mt-5 max-w-xl text-sm leading-7 tracking-wide text-muted-foreground md:text-base">{project.description}</p>
            ) : null}
          </div>
        </div>
        {gallery.length > 0 ? <CollectionGallery title={project.title} media={gallery} variant="fit" /> : null}
      </header>

      {CASE_STUDY_SECTIONS.filter((section) => section.key !== 'final').map((section) => (
        <ProcessSection key={section.key} project={project} section={section} />
      ))}

      {showFinalNotes ? (
        <section aria-labelledby="section-final" className="border-t border-foreground/10 py-16 md:py-24">
          <div className="container max-w-wide reveal-on-scroll">
            <h2 id="section-final" className="text-4xl leading-[0.95] md:text-6xl">
              Final Collection
            </h2>
            {finalNotes ? (
              <p className="mt-8 max-w-3xl text-base leading-8 tracking-wide text-muted-foreground md:text-lg">{finalNotes}</p>
            ) : null}
          </div>
          {details.length > 0 ? (
            <div className="container mt-16 max-w-wide">
              <StudyImages label="Detailed garment images" images={details} />
            </div>
          ) : null}
        </section>
      ) : null}

      <nav aria-label="Other collections" className="border-t border-foreground/10">
        <div className="container reveal-on-scroll grid max-w-wide gap-8 py-12 md:grid-cols-3 md:items-end md:py-16">
          {previous ? (
            <Link href={`/projects/${previous.id}`} className="group block">
              <span className="font-sans text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">Previous</span>
              <span className="mt-3 block break-words font-display text-2xl leading-tight transition-colors duration-editorial group-hover:text-accent md:text-3xl">
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/#portfolio"
            className="justify-self-start font-sans text-[0.7rem] uppercase tracking-[0.32em] md:justify-self-center"
          >
            All collections
          </Link>
          {next ? (
            <Link href={`/projects/${next.id}`} className="group block md:text-right">
              <span className="font-sans text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">Next</span>
              <span className="mt-3 block break-words font-display text-2xl leading-tight transition-colors duration-editorial group-hover:text-accent md:text-3xl">
                {next.title}
              </span>
            </Link>
          ) : null}
        </div>
      </nav>
    </article>
  );
}
