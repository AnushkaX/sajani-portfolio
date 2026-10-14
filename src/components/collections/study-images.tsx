'use client';

import { useState } from 'react';
import { SafeImage } from '@/components/ui/safe-image';
import { isVideoUrl } from '@/lib/media';
import { ImageLightbox } from './image-lightbox';

export function StudyImages({
  images,
  label,
}: {
  images: string[];
  label: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const photos = images.filter(Boolean);
  const stills = photos.filter((src) => !isVideoUrl(src));
  if (photos.length === 0) return null;

  return (
    <div>
      <h3 className="font-display text-2xl md:text-3xl">{label}</h3>
      <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {photos.map((src, index) => (
          <li key={`${src}-${index}`}>
            {isVideoUrl(src) ? (
              <video
                src={src}
                className="aspect-[3/4] w-full bg-muted object-contain"
                controls
                playsInline
                preload="metadata"
                aria-label={`${label}, film ${index + 1}`}
              />
            ) : (
              <button
                type="button"
                className="gallery-frame relative block aspect-[3/4] w-full overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                onClick={() => setOpenIndex(stills.indexOf(src))}
                aria-label={`Open ${label}, image ${index + 1}`}
              >
                <SafeImage
                  src={src}
                  alt={`${label}, image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-contain"
                />
              </button>
            )}
          </li>
        ))}
      </ul>
      <ImageLightbox
        images={stills}
        labels={stills.map((_, index) => `${label}, image ${index + 1} of ${stills.length}`)}
        index={openIndex}
        onIndex={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </div>
  );
}
