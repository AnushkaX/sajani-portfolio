import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { SectionHeading } from './section-heading';
import type { SiteContent } from '@/lib/site-content';

export default function Resume({ resume }: { resume: SiteContent['resume'] }) {
  return (
    <section id="resume" className="section scroll-mt-24">
      <div className="container">
        <SectionHeading
          eyebrow={resume.eyebrow}
          title={resume.title}
          description={resume.description}
        />
        {resume.cvUrl ? (
        <div className="mb-20 text-center">
          <Button asChild className="h-12 rounded-none px-8 font-sans text-[0.7rem] uppercase tracking-[0.22em]">
            <a href={resume.cvUrl} download={resume.cvDownloadName}>
              <Download className="mr-2 h-4 w-4" />
              Download CV
            </a>
          </Button>
        </div>
        ) : null}

        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="reveal-on-scroll border-t border-foreground/15 pt-8 lg:col-span-4">
            <h3 className="text-3xl">Education</h3>
            <div className="mt-8 space-y-8">
              {resume.education.map((item) => (
                <div key={`${item.school}-${item.years}`}>
                  <p className="font-medium tracking-wide">{item.degree}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.school}</p>
                  <p className="text-sm text-muted-foreground">{item.years}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal-on-scroll border-t border-foreground/15 pt-8 lg:col-span-4 lg:mt-16">
            <h3 className="text-3xl">Experience</h3>
            <div className="mt-8 space-y-8">
              {resume.experience.map((item) => (
                <div key={`${item.company}-${item.duration}`}>
                  <p className="font-medium tracking-wide">{item.role}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.company}</p>
                  <p className="text-sm text-muted-foreground">{item.duration}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal-on-scroll border-t border-foreground/15 pt-8 lg:col-span-4">
            <h3 className="text-3xl">Skills</h3>
            <ul className="mt-8 space-y-3">
              {resume.skills.map((skill) => (
                <li key={skill} className="text-sm uppercase tracking-[0.18em] text-muted-foreground">{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
