'use client';

import { useState } from 'react';
import { SafeImage } from '@/components/ui/safe-image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { isVideoUrl } from '@/lib/media';
import { ImageLightbox } from './image-lightbox';

function GalleryFrame({
  title,
  src,
  index,
  stills,
  onOpen,
  fitted = false,
}: {
  title: string;
  src: string;
  index: number;
  stills: string[];
  onOpen: (index: number) => void;
  fitted?: boolean;
}) {
  return (
    <figure
      className={`gallery-frame flex items-center justify-center overflow-hidden bg-muted ${
        fitted ? 'h-[28vw] max-h-40 sm:h-36 lg:h-[min(16svh,9.5rem)] lg:max-h-none' : 'h-[min(46svh,26rem)]'
      }`}
    >
      {isVideoUrl(src) ? (
        <video
          src={src}
          className="h-full w-full object-contain"
          controls
          playsInline
          preload="none"
          aria-label={`${title}, film ${index + 1}`}
        />
      ) : (
        <button
          type="button"
          className="relative h-full w-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          onClick={() => onOpen(stills.indexOf(src))}
          aria-label={`Open ${title}, image ${index + 1}`}
        >
          <SafeImage
            src={src}
            alt={`${title}, look ${index + 1}`}
            fill
            sizes={fitted ? '(max-width: 1024px) 46vw, 16vw' : '(max-width: 640px) 86vw, (max-width: 1024px) 46vw, 32vw'}
            className="object-contain"
          />
        </button>
      )}
    </figure>
  );
}

export function CollectionGallery({
  title,
  media,
  variant = 'strip',
}: {
  title: string;
  media: string[];
  variant?: 'strip' | 'fit';
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const stills = media.filter((src) => src && !isVideoUrl(src));
  if (media.length === 0) return null;

  if (variant === 'fit') {
    return (
      <div>
        <ul
          className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-3 ${
            media.length <= 2 ? 'lg:grid-cols-2' : media.length <= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-6'
          }`}
          aria-label={`${title} gallery`}
        >
          {media.map((src, index) => (
            <li key={`${src}-${index}`} className="min-w-0">
              <GalleryFrame title={title} src={src} index={index} stills={stills} onOpen={setOpenIndex} fitted />
            </li>
          ))}
        </ul>
        <ImageLightbox
          images={stills}
          labels={stills.map((_, index) => `${title}, image ${index + 1} of ${stills.length}`)}
          index={openIndex}
          onIndex={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      </div>
    );
  }

  return (
    <Carousel
      opts={{ align: 'start', containScroll: 'trimSnaps', dragFree: true }}
      className="mt-8 w-full min-w-0 max-w-full px-6 md:mt-10 md:px-10 lg:px-16"
      aria-label={`${title} gallery`}
    >
      <CarouselContent className="-ml-3 md:-ml-5">
        {media.map((src, index) => (
          <CarouselItem
            key={`${src}-${index}`}
            className="basis-[86%] pl-3 transition-opacity duration-300 sm:basis-[46%] md:basis-[34%] md:pl-5 lg:basis-[30%]"
          >
            <GalleryFrame title={title} src={src} index={index} stills={stills} onOpen={setOpenIndex} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {media.length > 1 ? (
        <>
          <CarouselPrevious className="left-3 border-0 bg-background/80 shadow-none hover:bg-background" />
          <CarouselNext className="right-3 border-0 bg-background/80 shadow-none hover:bg-background" />
        </>
      ) : null}
      <ImageLightbox
        images={stills}
        labels={stills.map((_, index) => `${title}, image ${index + 1} of ${stills.length}`)}
        index={openIndex}
        onIndex={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </Carousel>
  );
}
