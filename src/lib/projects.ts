
export type Project = {
  id: number;
  title: string;
  category: 'Haute Couture' | 'Casual' | 'Sketches';
  date: string;
  description: string;
  coverImage: string;
  images: string[];
};

export const projects: Project[] = [
  { id: 1, title: 'Ephemeral Bloom', category: 'Haute Couture', date: 'Spring 2023', description: 'A collection inspired by the fleeting beauty of cherry blossoms, featuring hand-embroidered details and delicate silks.', coverImage: '/images/project1/1.jpg', images: ['/images/project1/2.jpg', '/images/project1/8.jpg', '/images/project1/13.jpg', '/images/project1/7.jpg'], },
  { id: 2, title: 'Urban Nomad', category: 'Casual', date: 'Fall 2022', description: 'Functional and stylish everyday wear designed for the modern city dweller. Focuses on durable fabrics and versatile silhouettes.', coverImage: '/images/project1/8.jpg', images: ['https://placehold.co/1200x800.png', 'https://placehold.co/1200x800.png'], },
  // { id: 3, title: 'Concept Sketches', category: 'Sketches', date: 'Ongoing', description: 'A collection of initial concepts, mood boards, and illustrations that form the foundation of my design process.', coverImage: 'https://placehold.co/600x800.png', images: ['https://placehold.co/1200x800.png', 'https://placehold.co/1200x800.png'], },
  // { id: 4, title: 'Midnight Garden', category: 'Haute Couture', date: 'Winter 2022', description: 'An evening wear collection that plays with dark florals, rich velvets, and dramatic draping.', coverImage: 'https://placehold.co/600x800.png', images: ['https://placehold.co/1200x800.png', 'https://placehold.co/1200x800.png'], },
  // { id: 5, title: 'Weekend Ease', category: 'Casual', date: 'Summer 2023', description: 'Lightweight, breathable fabrics in relaxed fits, perfect for leisure and travel.', coverImage: 'https://placehold.co/600x800.png', images: ['https://placehold.co/1200x800.png', 'https://placehold.co/1200x800.png'], },
  // { id: 6, title: 'Form & Figure', category: 'Sketches', date: 'Ongoing', description: 'Exploratory sketches focusing on silhouette, form, and human anatomy in fashion.', coverImage: 'https://placehold.co/600x800.png', images: ['https://placehold.co/1200x800.png', 'https://placehold.co/1200x800.png'], },
];
