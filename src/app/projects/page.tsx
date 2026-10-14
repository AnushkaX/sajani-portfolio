import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ProjectGrid } from '@/components/collections/project-grid';
import { getSiteContent } from '@/lib/site-store';
import { getStoredProjects } from '@/lib/projects-store';
import { isVideoUrl } from '@/lib/media';

export const dynamic = 'force-dynamic';

const title = 'Projects';
const description = 'Fashion collections by Sajani Muthusinghe.';

export async function generateMetadata(): Promise<Metadata> {
  const projects = await getStoredProjects().catch(() => []);
  const cover = projects.find((project) => project.coverImage && !isVideoUrl(project.coverImage))?.coverImage;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: cover ? [{ url: cover, alt: 'Sajani Muthusinghe collections' }] : undefined,
    },
  };
}

export default async function ProjectsPage() {
  const [site, projects] = await Promise.all([
    getSiteContent(),
    getStoredProjects().catch(() => []),
  ]);

  return (
    <>
      <Header social={site.social} cv={site.resume.cvUrl ? { url: site.resume.cvUrl, name: site.resume.cvDownloadName } : null} />
      <main id="content" className="overflow-x-clip pt-20">
        <section className="container pb-16 pt-12 md:pb-20 md:pt-16">
          <div className="reveal-on-scroll mx-auto mb-8 max-w-measure text-center md:mb-10">
            <p className="eyebrow">Portfolio</p>
            <h1 className="mt-5 break-words text-[clamp(2.35rem,7vw,4.75rem)] leading-[0.95]">Projects</h1>
            <p className="mt-6 text-base leading-relaxed tracking-wide text-muted-foreground md:text-lg">
              Runway-ready pieces, and the studies that led to them.
            </p>
          </div>
          {projects.length === 0 ? (
            <p className="text-center text-muted-foreground">No collections published yet.</p>
          ) : (
            <ProjectGrid projects={projects} priorityCount={1} />
          )}
        </section>
      </main>
      <Footer name={site.hero.name} />
    </>
  );
}
