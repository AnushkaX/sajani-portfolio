import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import About from '@/components/sections/about';
import { Collections } from '@/components/collections/collections';
import Resume from '@/components/sections/resume';
import Contact from '@/components/sections/contact';
import { getSiteContent } from '@/lib/site-store';
import { getStoredProjects } from '@/lib/projects-store';
import { isVideoUrl } from '@/lib/media';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent().catch(() => null);
  const name = site?.hero.name?.trim() || 'Sajani Muthusinghe';
  const description = site?.hero.tagline?.trim() || 'Portfolio of Sajani Muthusinghe, a fashion design student at NIBM.';
  const image = site?.hero.slides.find((slide) => slide && !isVideoUrl(slide)) || site?.hero.image;
  return {
    title: { absolute: name },
    description,
    openGraph: {
      title: name,
      description,
      images: image ? [{ url: image, alt: `${name} portfolio` }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Home() {
  const [site, projects] = await Promise.all([
    getSiteContent(),
    getStoredProjects().catch(() => []),
  ]);

  return (
    <>
      <Header social={site.social} />
      <main id="content" className="overflow-x-clip">
        <Hero hero={site.hero} />
        <div className="relative z-10 bg-background">
          <About about={site.about} name={site.hero.name} />
          <Collections projects={projects} />
          <Resume resume={site.resume} />
          <Contact contact={site.contact} social={site.social} />
        </div>
      </main>
      <Footer name={site.hero.name} />
    </>
  );
}
