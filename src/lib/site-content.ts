import { z } from 'zod';

const text = (max = 500) => z.string().trim().max(max);

export const siteContentSchema = z.object({
  hero: z.object({
    eyebrow: text(80),
    name: text(120),
    tagline: text(400),
    image: text(2000),
  }),
  about: z.object({
    eyebrow: text(80),
    title: text(160),
    summary: text(500),
    paragraphOne: text(2000),
    paragraphTwo: text(2000),
    image: text(2000),
  }),
  resume: z.object({
    eyebrow: text(80),
    title: text(160),
    description: text(500),
    cvUrl: text(2000),
    cvDownloadName: text(160),
    education: z.array(z.object({
      degree: text(160),
      school: text(160),
      years: text(80),
    })),
    experience: z.array(z.object({
      role: text(160),
      company: text(160),
      duration: text(80),
    })),
    skills: z.array(text(80)),
  }),
  social: z.object({
    instagram: text(500),
    linkedin: text(500),
    behance: text(500),
  }),
  contact: z.object({
    eyebrow: text(80),
    title: text(160),
    description: text(500),
  }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;

export const defaultSiteContent: SiteContent = {
  hero: {
    eyebrow: 'Fashion design',
    name: 'Sajani Muthusinghe',
    tagline: 'Narratives cut in cloth — sustainable silhouettes with an avant-garde hand.',
    image: '/images/project1/1.jpg',
  },
  about: {
    eyebrow: 'About',
    title: 'A story in every stitch',
    summary: 'Fashion as wearable art — researched, experimental, and made to last on the person who wears it.',
    paragraphOne: "I'm Sajani Muthusinghe, a fashion design student with a keen eye for detail and a love for storytelling through textiles. My work sits where classic tailoring meets modern, sustainable practice.",
    paragraphTwo: 'Each collection starts in research: unconventional materials, careful construction, and silhouettes that feel current without chasing a season. The aim is clothing that carries a feeling, not just a trend.',
    image: '/images/project1/2.jpg',
  },
  resume: {
    eyebrow: 'Resume',
    title: 'Journey and craft',
    description: 'Education, studio experience, and the skills behind the collections.',
    cvUrl: '/placeholder-cv.pdf',
    cvDownloadName: 'Sajani_Muthusinghe_CV.pdf',
    education: [
      { degree: 'B.A. in Fashion Design', school: 'Prestigious Design University', years: '2020 - 2024' },
      { degree: 'Foundation in Art & Design', school: 'City Arts College', years: '2019 - 2020' },
    ],
    experience: [
      { role: 'Design Intern', company: 'Acclaimed Fashion House', duration: 'Summer 2023' },
      { role: 'Freelance Illustrator', company: 'Self-Employed', duration: '2021 - Present' },
    ],
    skills: ['Pattern Making', 'Draping', 'Adobe Illustrator & Photoshop', 'Textile Design', 'Sustainable Fashion Practices', 'Concept Development'],
  },
  social: {
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    behance: 'https://behance.net',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Start a conversation',
    description: 'Commissions, collaborations, and studio questions are welcome.',
  },
};

export function normalizeSiteContent(input: unknown): SiteContent {
  const source = input && typeof input === 'object' ? input as Partial<SiteContent> : {};
  const resume = source.resume ?? defaultSiteContent.resume;
  return siteContentSchema.parse({
    hero: { ...defaultSiteContent.hero, ...source.hero },
    about: { ...defaultSiteContent.about, ...source.about },
    resume: {
      ...defaultSiteContent.resume,
      ...resume,
      education: Array.isArray(resume.education) ? resume.education : defaultSiteContent.resume.education,
      experience: Array.isArray(resume.experience) ? resume.experience : defaultSiteContent.resume.experience,
      skills: (Array.isArray(resume.skills) ? resume.skills : defaultSiteContent.resume.skills)
        .map((skill) => skill.trim())
        .filter(Boolean),
    },
    social: { ...defaultSiteContent.social, ...source.social },
    contact: { ...defaultSiteContent.contact, ...source.contact },
  });
}
