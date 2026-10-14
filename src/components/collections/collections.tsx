import Link from 'next/link';
import { SectionHeading } from '@/components/sections/section-heading';
import type { Project } from '@/lib/projects';
import { ProjectGrid } from './project-grid';

const FEATURED_COUNT = 4;

export function Collections({ projects }: { projects: Project[] }) {
  const featured = projects.slice(0, FEATURED_COUNT);

  return (
    <section id="portfolio" className="scroll-mt-20 border-t border-foreground/10">
      <div className="container pb-16 pt-12 md:pb-20 md:pt-16">
        <SectionHeading
          className="mb-8 md:mb-10"
          eyebrow="Portfolio"
          title="Collections"
          description="Runway-ready pieces, and the studies that led to them."
        />
        {projects.length === 0 ? (
          <p className="text-center text-muted-foreground">No collections published yet.</p>
        ) : (
          <>
            <ProjectGrid projects={featured} />
            {projects.length > FEATURED_COUNT ? (
              <div className="mt-12 text-center md:mt-16">
                <Link
                  href="/projects"
                  className="editorial-link inline-flex py-2 font-sans text-[0.7rem] uppercase tracking-[0.28em]"
                >
                  View all projects
                </Link>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
