"use client";

import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollArea } from '@/components/ui/scroll-area';
import { type Project } from '@/lib/projects';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full max-h-full overflow-hidden">
      <div className="bg-muted flex items-center justify-center p-4 md:p-8">
        <Carousel className="w-full max-w-md">
          <CarouselContent>
            {project.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-square relative">
                  <Image src={image} alt={`${project.title} - Image ${index + 1}`} fill sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw" className="object-contain" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="relative">
      <ScrollArea className="h-full">
        <div className="p-8 md:p-12 space-y-6">
            <h2 className="font-headline text-3xl md:text-4xl text-primary">{project.title}</h2>
            <p className="text-sm text-muted-foreground font-medium">{project.date}</p>
            <p className="text-base leading-relaxed">{project.description}</p>
        </div>
        </ScrollArea>
      </div>
    </div>
  );
}
