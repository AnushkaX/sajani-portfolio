/**
 * Site content URLs and links. Override via environment variables.
 * Use NEXT_PUBLIC_ prefix for values needed in client components.
 */
export const siteConfig = {
  social: {
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? 'https://instagram.com',
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? 'https://linkedin.com',
    behance: process.env.NEXT_PUBLIC_SOCIAL_BEHANCE ?? 'https://behance.net',
  },
  images: {
    hero: process.env.NEXT_PUBLIC_IMAGE_HERO ?? '/images/project1/1.jpg',
    aboutPortrait: process.env.NEXT_PUBLIC_IMAGE_ABOUT ?? '/images/project1/2.jpg',
  },
  resume: {
    cvUrl: process.env.NEXT_PUBLIC_CV_URL ?? '/placeholder-cv.pdf',
    cvDownloadName: process.env.NEXT_PUBLIC_CV_DOWNLOAD_NAME ?? 'Sajani_Muthusinghe_CV.pdf',
  },
} as const;
