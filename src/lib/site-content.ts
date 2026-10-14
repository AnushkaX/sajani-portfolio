import { z } from 'zod';

const text = (max = 500) => z.string().trim().max(max);

export const siteContentSchema = z.object({
  hero: z.object({
    eyebrow: text(80),
    name: text(120),
    tagline: text(400),
    image: text(2000).optional(),
    slides: z.array(text(2000)).min(1),
  }),
  about: z.object({
    eyebrow: text(80),
    title: text(160),
    summary: text(500),
    paragraphOne: text(2000),
    paragraphTwo: text(2000),
    image: text(2000),
    studyLine: text(200),
    expertise: z.array(text(80)),
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
    slides: ['/images/project1/1.jpg'],
  },
  about: {
    eyebrow: 'About',
    title: 'Behind the Designs',
    summary: 'A third-year Fashion Design student at NIBM, exploring a new concept, material, and technique with every project.',
    paragraphOne: "I'm Sajani Muthusinghe. My work moves between design, styling, and editorial projects, and each one is shaped by its own research and concept rather than a single signature theme.",
    paragraphTwo: 'In the studio I work hands-on: drafting patterns, constructing garments, and manipulating textiles and surfaces until an idea holds its shape. I am looking for an internship where I can bring that range to a working design team.',
    image: '/images/project1/2.jpg',
    studyLine: 'Third-year Fashion Design student, NIBM',
    expertise: [
      'Garment construction',
      'Pattern making',
      'Textile manipulation',
      'Embroidery and surface design',
      'Adobe Illustrator and Photoshop',
      'Concept development and research',
    ],
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
  const hero = source.hero ?? defaultSiteContent.hero;
  const resume = source.resume ?? defaultSiteContent.resume;
  return siteContentSchema.parse({
    hero: {
      ...defaultSiteContent.hero,
      ...hero,
      slides: Array.isArray(hero.slides) && hero.slides.length > 0
        ? hero.slides
        : [hero.image || defaultSiteContent.hero.slides[0]],
    },
    about: {
      ...defaultSiteContent.about,
      ...source.about,
      expertise: (Array.isArray(source.about?.expertise) ? source.about.expertise : defaultSiteContent.about.expertise)
        .map((item) => item.trim())
        .filter(Boolean),
    },
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
