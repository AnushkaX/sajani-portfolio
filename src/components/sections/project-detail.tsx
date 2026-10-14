"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollArea } from '@/components/ui/scroll-area';
import { SafeImage } from '@/components/ui/safe-image';
import { type Project } from '@/lib/projects';
import { isVideoUrl } from '@/lib/media';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const displayImages = project.images.length > 0 ? project.images : [project.coverImage];
  return (
    <div className="grid max-h-[92vh] grid-cols-1 overflow-y-auto bg-background md:grid-cols-2 md:overflow-hidden">
      <div className="flex items-center justify-center bg-secondary p-6 md:p-12">
        <Carousel className="w-full max-w-md">
          <CarouselContent>
            {displayImages.map((media, index) => (
              <CarouselItem key={`${project.id}-img-${index}`}>
                <div className="relative aspect-[3/4] bg-background">
                  {isVideoUrl(media) ? (
                    <video
                      src={media}
                      className="h-full w-full bg-black object-contain"
                      controls
                      playsInline
                      preload="metadata"
                      aria-label={`${project.title} — video ${index + 1}`}
                    />
                  ) : (
                    <SafeImage
                      src={media}
                      alt={`${project.title} — image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 90vw, 40vw"
                      className="object-contain"
                    />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {displayImages.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </div>
      <ScrollArea className="h-full">
        <div className="space-y-6 p-8 md:p-14">
          <p className="eyebrow">{project.category}</p>
          <h2 className="text-4xl md:text-5xl">{project.title}</h2>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{project.date}</p>
          <p className="text-base leading-8 tracking-wide text-foreground/90 md:text-lg">{project.description}</p>
        </div>
      </ScrollArea>
    </div>
  );
}
