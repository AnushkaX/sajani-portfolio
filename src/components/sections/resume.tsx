import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

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
    <section id="resume" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline mb-4">Resume / CV</h2>
          <Button asChild>
            <a href="/placeholder-cv.pdf" download="Alexia_Dubois_CV.pdf">
              <Download className="mr-2 h-4 w-4" />
              Download Full CV
            </a>
          </Button>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.education.map((edu, i) => (
                <div key={i}>
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-sm text-muted-foreground">{edu.school} | {edu.years}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.experience.map((exp, i) => (
                <div key={i}>
                  <p className="font-semibold">{exp.role}</p>
                  <p className="text-sm text-muted-foreground">{exp.company} | {exp.duration}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {resumeData.skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
