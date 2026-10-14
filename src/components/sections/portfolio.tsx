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
      <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-12">
        {filteredProjects.map((project, index) => {
          const span = index % 5 === 0 ? 'md:col-span-7' : index % 5 === 1 ? 'md:col-span-5 md:mt-24' : 'md:col-span-4';
          return (
            <button
              key={project.id}
              type="button"
              className={`reveal-on-scroll group w-full text-left ${span}`}
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <SafeImage
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-editorial ease-editorial group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-6">
                <h3 className="text-2xl md:text-3xl">{project.title}</h3>
                <p className="eyebrow shrink-0">{project.category}</p>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <section id="portfolio" className="section scroll-mt-24 border-y border-foreground/10 bg-secondary">
      <div className="container">
        <SectionHeading
          eyebrow="Portfolio"
          title="Collections"
          description="Runway-ready pieces, and the studies that led to them."
        />
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mx-auto mb-16 flex h-auto w-full flex-wrap justify-center gap-x-8 gap-y-3 bg-transparent p-0">
            <TabsTrigger value="all" className="rounded-none border-b border-transparent bg-transparent px-0 pb-2 font-sans text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground shadow-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none">All</TabsTrigger>
            {Array.from(new Set([...categories, ...projects.map((project) => project.category)])).map((category) => (
              <TabsTrigger key={category} value={category} className="rounded-none border-b border-transparent bg-transparent px-0 pb-2 font-sans text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground shadow-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none">{category}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">{renderProjectGrid()}</TabsContent>
          {Array.from(new Set([...categories, ...projects.map((project) => project.category)])).map((category) => (
            <TabsContent key={category} value={category}>{renderProjectGrid(category)}</TabsContent>
          ))}
        </Tabs>

        <Dialog open={!!selectedProject} onOpenChange={(isOpen) => !isOpen && setSelectedProject(null)}>
          <DialogContent className="max-h-[92vh] w-[94vw] max-w-wide overflow-hidden rounded-none border-foreground/10 p-0 shadow-none">
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
