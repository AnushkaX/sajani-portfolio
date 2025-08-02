"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ProjectDetail } from './project-detail';
import { Badge } from '../ui/badge';
import { type Project, projects } from '@/lib/projects';

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
            className="overflow-hidden cursor-pointer group border-0 rounded-lg"
            onClick={() => setSelectedProject(project)}
          >
            <CardContent className="p-0 relative">
              <div className="absolute inset-0 bg-black/50 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-center p-4">
                <div className="text-white">
                  <h3 className="font-bold text-lg">{project.title}</h3>
                  <p className="text-sm">{project.category}</p>
                </div>
              </div>
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
          </Card>
        ))}
      </div>
    );
  };

  return (
    <section id="portfolio" className="py-16 md:py-24 lg:py-32 bg-secondary">
      <div className="container">
        <div className="flex flex-col items-center text-center mb-12">
            <Badge>Portfolio</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mt-4">My Collections</h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
                A selection of my work, from runway-ready pieces to the sketches that started them all.
            </p>
        </div>
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
             {selectedProject && (
              <>
                <DialogTitle className="sr-only">{selectedProject.title}</DialogTitle>
                <ProjectDetail project={selectedProject} />
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
