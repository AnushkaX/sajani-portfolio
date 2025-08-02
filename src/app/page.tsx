import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import About from '@/components/sections/about';
import Portfolio from '@/components/sections/portfolio';
import Resume from '@/components/sections/resume';
import Contact from '@/components/sections/contact';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <div className="relative z-10 bg-background">
          <About />
          <Portfolio />
          <Resume />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
