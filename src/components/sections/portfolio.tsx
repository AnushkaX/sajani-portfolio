"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ProjectDetail } from './project-detail';
import { SectionHeading } from './section-heading';
import { SafeImage } from '@/components/ui/safe-image';
import { type Project, projects as defaultProjects, DEFAULT_CATEGORIES } from '@/lib/projects';

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [categories, setCategories] = useState<string[]>([...DEFAULT_CATEGORIES]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Project[]) => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(() => {});
    fetch('/api/categories')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: { name: string }[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data.map((category) => category.name));
        }
      })
      .catch(() => {});
  }, []);

  const renderProjectGrid = (filter?: Project['category']) => {
    const filteredProjects = filter ? projects.filter((project) => project.category === filter) : projects;
    if (filteredProjects.length === 0) {
      return (
        <p className="py-16 text-center text-muted-foreground">No projects in this category yet.</p>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {filteredProjects.map((project) => (
          <button
            key={project.id}
            type="button"
            className="reveal-on-scroll group w-full text-left"
            onClick={() => setSelectedProject(project)}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <SafeImage
                src={project.coverImage}
                alt={project.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-100 transition duration-500 md:opacity-0 md:group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white transition duration-500 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-white/80">{project.category}</p>
                <h3 className="mt-1 text-2xl tracking-wide">{project.title}</h3>
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <section id="portfolio" className="scroll-mt-24 bg-secondary py-20 md:py-28 lg:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Portfolio"
          title="Collections"
          description="Runway-ready pieces, and the studies that led to them."
        />
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mx-auto mb-10 flex h-auto w-full max-w-2xl flex-wrap justify-center gap-1 bg-background/80 p-1">
            <TabsTrigger value="all" className="tracking-wide">All</TabsTrigger>
            {Array.from(new Set([...categories, ...projects.map((project) => project.category)])).map((category) => (
              <TabsTrigger key={category} value={category} className="tracking-wide">{category}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">{renderProjectGrid()}</TabsContent>
          {Array.from(new Set([...categories, ...projects.map((project) => project.category)])).map((category) => (
            <TabsContent key={category} value={category}>{renderProjectGrid(category)}</TabsContent>
          ))}
        </Tabs>

        <Dialog open={!!selectedProject} onOpenChange={(isOpen) => !isOpen && setSelectedProject(null)}>
          <DialogContent className="max-h-[92vh] w-[94vw] max-w-5xl overflow-hidden p-0">
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
