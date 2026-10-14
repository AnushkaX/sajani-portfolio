import Link from 'next/link';
import { SafeImage } from '@/components/ui/safe-image';
import { isVideoUrl } from '@/lib/media';
import type { Project } from '@/lib/projects';

export function CollectionEntry({ project, priority = false }: { project: Project; priority?: boolean }) {
  const href = `/projects/${project.id}`;
  const meta = [project.category, project.date].filter(Boolean).join('  ·  ');

  return (
    <article className="reveal-on-scroll">
      <Link
        href={href}
        className="group block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          {isVideoUrl(project.coverImage) ? (
            <video
              src={project.coverImage}
              className="h-full w-full object-cover transition duration-editorial ease-editorial motion-safe:group-hover:scale-[1.03]"
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          ) : (
            <SafeImage
              src={project.coverImage}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 46vw"
              priority={priority}
              className="object-cover object-center transition duration-editorial ease-editorial motion-safe:group-hover:scale-[1.03]"
            />
          )}
        </div>
        <h3 className="mt-4 break-words font-display text-2xl leading-tight md:text-[1.75rem]">{project.title}</h3>
        {meta ? <p className="mt-2 font-sans text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">{meta}</p> : null}
        <span className="mt-3 inline-flex items-center gap-3 font-sans text-[0.65rem] uppercase tracking-[0.28em]">
          View project
          <span aria-hidden="true" className="block h-px w-6 bg-current transition-all duration-editorial ease-editorial motion-safe:group-hover:w-10" />
        </span>
      </Link>
    </article>
  );
}
