import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';
import { SectionHeading } from './section-heading';
import type { SiteContent } from '@/lib/site-content';

export default function Resume({ resume }: { resume: SiteContent['resume'] }) {
  return (
    <section id="resume" className="scroll-mt-24 py-20 md:py-28 lg:py-32">
      <div className="container">
        <SectionHeading
          eyebrow={resume.eyebrow}
          title={resume.title}
          description={resume.description}
        />
        {resume.cvUrl ? (
        <div className="mb-12 text-center">
          <Button asChild className="rounded-none px-8 uppercase tracking-[0.16em]">
            <a href={resume.cvUrl} download={resume.cvDownloadName}>
              <Download className="mr-2 h-4 w-4" />
              Download CV
            </a>
          </Button>
        </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="reveal-on-scroll border-border/70 shadow-none transition duration-500 hover:-translate-y-1 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <GraduationCap className="h-6 w-6 text-primary" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {resume.education.map((item) => (
                <div key={`${item.school}-${item.years}`} className="border-l border-primary/30 pl-4">
                  <p className="font-medium">{item.degree}</p>
                  <p className="text-sm text-muted-foreground">{item.school}</p>
                  <p className="text-sm text-muted-foreground">{item.years}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="reveal-on-scroll border-border/70 shadow-none transition duration-500 hover:-translate-y-1 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Briefcase className="h-6 w-6 text-primary" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {resume.experience.map((item) => (
                <div key={`${item.company}-${item.duration}`} className="border-l border-primary/30 pl-4">
                  <p className="font-medium">{item.role}</p>
                  <p className="text-sm text-muted-foreground">{item.company}</p>
                  <p className="text-sm text-muted-foreground">{item.duration}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="reveal-on-scroll border-border/70 shadow-none transition duration-500 hover:-translate-y-1 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-primary" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="rounded-none px-3 py-1 font-normal tracking-wide">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
