import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import About from '@/components/sections/about';
import Portfolio from '@/components/sections/portfolio';
import Resume from '@/components/sections/resume';
import Contact from '@/components/sections/contact';
import { getSiteContent } from '@/lib/site-store';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const site = await getSiteContent();

  return (
    <>
      <Header social={site.social} />
      <main>
        <Hero hero={site.hero} />
        <div className="relative z-10 bg-background">
          <About about={site.about} />
          <Portfolio />
          <Resume resume={site.resume} />
          <Contact contact={site.contact} social={site.social} />
        </div>
      </main>
      <Footer name={site.hero.name} />
    </>
  );
}
