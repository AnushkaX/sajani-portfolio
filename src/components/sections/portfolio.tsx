"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectDetail } from './project-detail';

type Project = {
  id: number;
  title: string;
  category: 'Haute Couture' | 'Casual' | 'Sketches';
  date: string;
  description: string;
  coverImage: string;
  images: string[];
};

const projects: Project[] = [
  { id: 1, title: 'Ephemeral Bloom', category: 'Haute Couture', date: 'Spring 2023', description: 'A collection inspired by the fleeting beauty of cherry blossoms, featuring hand-embroidered details and delicate silks.', coverImage: 'https://placehold.co/600x800.png', images: ['https://placehold.co/1200x800.png', 'https://placehold.co/1200x800.png', 'https://placehold.co/800x1200.png'], },
  { id: 2, title: 'Urban Nomad', category: 'Casual', date: 'Fall 2022', description: 'Functional and stylish everyday wear designed for the modern city dweller. Focuses on durable fabrics and versatile silhouettes.', coverImage: 'https://placehold.co/600x800.png', images: ['https://placehold.co/1200x800.png', 'https://placehold.co/1200x800.png'], },
  { id: 3, title: 'Concept Sketches', category: 'Sketches', date: 'Ongoing', description: 'A collection of initial concepts, mood boards, and illustrations that form the foundation of my design process.', coverImage: 'https://placehold.co/600x800.png', images: ['https://placehold.co/1200x800.png', 'https://placehold.co/1200x800.png'], },
  { id: 4, title: 'Midnight Garden', category: 'Haute Couture', date: 'Winter 2022', description: 'An evening wear collection that plays with dark florals, rich velvets, and dramatic draping.', coverImage: 'https://placehold.co/600x800.png', images: ['https://placehold.co/1200x800.png', 'https://placehold.co/1200x800.png'], },
  { id: 5, title: 'Weekend Ease', category: 'Casual', date: 'Summer 2023', description: 'Lightweight, breathable fabrics in relaxed fits, perfect for leisure and travel.', coverImage: 'https://placehold.co/600x800.png', images: ['https://placehold.co/1200x800.png', 'https://placehold.co/1200x800.png'], },
  { id: 6, title: 'Form & Figure', category: 'Sketches', date: 'Ongoing', description: 'Exploratory sketches focusing on silhouette, form, and human anatomy in fashion.', coverImage: 'https://placehold.co/600x800.png', images: ['https://placehold.co/1200x800.png', 'https://placehold.co/1200x800.png'], },
];

const categories: Project['category'][] = ['Haute Couture', 'Casual', 'Sketches'];

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const renderProjectGrid = (filter?: Project['category']) => {
    const filteredProjects = filter ? projects.filter(p => p.category === filter) : projects;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <Card 
            key={project.id} 
            className="overflow-hidden cursor-pointer group"
            onClick={() => setSelectedProject(project)}
          >
            <CardContent className="p-0">
              <div className="aspect-[3/4] overflow-hidden">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  data-ai-hint={`fashion ${project.category.toLowerCase()}`}
                  width={600}
                  height={800}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
            </CardContent>
            <CardFooter className="p-4 bg-background">
              <div>
                <h3 className="font-headline text-lg text-primary">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.category}</p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <section id="portfolio" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Portfolio</h2>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mx-auto max-w-lg mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map(cat => <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>)}
          </TabsList>
          <TabsContent value="all">{renderProjectGrid()}</TabsContent>
          {categories.map(cat => <TabsContent key={cat} value={cat}>{renderProjectGrid(cat)}</TabsContent>)}
        </Tabs>

        <Dialog open={!!selectedProject} onOpenChange={(isOpen) => !isOpen && setSelectedProject(null)}>
          <DialogContent className="max-w-4xl w-[90vw] h-[90vh] p-0">
            {selectedProject && <ProjectDetail project={selectedProject} />}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
