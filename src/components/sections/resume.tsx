import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';

const resumeData = {
  education: [
    { degree: 'B.A. in Fashion Design', school: 'Prestigious Design University', years: '2020 - 2024' },
    { degree: 'Foundation in Art & Design', school: 'City Arts College', years: '2019 - 2020' },
  ],
  experience: [
    { role: 'Design Intern', company: 'Acclaimed Fashion House', duration: 'Summer 2023' },
    { role: 'Freelance Illustrator', company: 'Self-Employed', duration: '2021 - Present' },
  ],
  skills: ['Pattern Making', 'Draping', 'Adobe Illustrator & Photoshop', 'Textile Design', 'Sustainable Fashion Practices', 'Concept Development'],
};

export default function Resume() {
  return (
    <section id="resume" className="py-16 md:py-24 lg:py-32">
      <div className="container">
        <div className="text-center mb-12">
            <Badge>Resume</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mt-4">My Journey & Skills</h2>
            <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                A brief look at my qualifications, experience, and the skills I bring to the table.
            </p>
            <Button asChild className="mt-6">
                <a href="/placeholder-cv.pdf" download="Alexia_Dubois_CV.pdf">
                <Download className="mr-2 h-4 w-4" />
                Download Full CV
                </a>
            </Button>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary"/>
                <span className="text-2xl font-bold">Education</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.education.map((edu, i) => (
                <div key={i}>
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-sm text-muted-foreground">{edu.school}</p>
                  <p className="text-sm text-muted-foreground">{edu.years}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-primary"/>
                    <span className="text-2xl font-bold">Experience</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.experience.map((exp, i) => (
                <div key={i}>
                  <p className="font-semibold">{exp.role}</p>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">{exp.duration}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary"/>
                    <span className="text-2xl font-bold">Skills</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                    ))}
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
