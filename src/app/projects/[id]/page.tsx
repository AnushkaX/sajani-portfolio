import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { CollectionCaseStudy } from '@/components/collections/collection-case-study';
import { getSiteContent } from '@/lib/site-store';
import { getStoredProject, getStoredProjects } from '@/lib/projects-store';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getStoredProject(id).catch(() => null);
  if (!project || project.deletedAt) return { title: 'Collection' };
  const title = project.title;
  const description = project.description.trim() || `${project.title}, a fashion collection by Sajani Muthusinghe.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: project.coverImage ? [{ url: project.coverImage, alt: `${project.title} collection` }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const [project, projects, site] = await Promise.all([
    getStoredProject(id).catch(() => null),
    getStoredProjects().catch(() => []),
    getSiteContent(),
  ]);

  if (!project || project.deletedAt) notFound();

  const index = projects.findIndex((item) => item.id === project.id);
  const previous = index > 0 ? projects[index - 1] : null;
  const next = index >= 0 && index < projects.length - 1 ? projects[index + 1] : null;

  return (
    <>
      <Header social={site.social} cv={site.resume.cvUrl ? { url: site.resume.cvUrl, name: site.resume.cvDownloadName } : null} />
      <main id="content" className="overflow-x-clip pt-20">
        <CollectionCaseStudy project={project} previous={previous} next={next} />
      </main>
      <Footer name={site.hero.name} />
    </>
  );
}
