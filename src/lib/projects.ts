export const DEFAULT_CATEGORIES = ['Haute Couture', 'Casual', 'Sketches'] as const;

export type Project = {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  coverImage: string;
  images: string[];
  deletedAt?: string | null;
};

export const projects: Project[] = [
  { id: '1', title: 'Ephemeral Bloom', category: 'Haute Couture', date: 'Spring 2023', description: 'A collection inspired by the fleeting beauty of cherry blossoms, featuring hand-embroidered details and delicate silks.', coverImage: '/images/project1/1.jpg', images: ['/images/project1/2.jpg', '/images/project1/8.jpg', '/images/project1/13.jpg', '/images/project1/7.jpg'], },
  { id: '2', title: 'Urban Nomad', category: 'Casual', date: 'Fall 2022', description: 'Functional and stylish everyday wear designed for the modern city dweller. Focuses on durable fabrics and versatile silhouettes.', coverImage: '/images/project1/8.jpg', images: ['/images/project1/7.jpg', '/images/project1/13.jpg'], },
  // { id: '3', title: 'Concept Sketches', category: 'Sketches', date: 'Ongoing', description: '...', coverImage: '...', images: [...] },
];
