'use client';

import { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { SafeImage } from '@/components/ui/safe-image';
import { isVideoUrl } from '@/lib/media';

export function ImageLightbox({
  images,
  labels,
  index,
  onIndex,
  onClose,
}: {
  images: string[];
  labels: string[];
  index: number | null;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const open = index !== null && images[index];
  const current = open ? images[index] : '';
  const label = open ? labels[index] ?? `Image ${index + 1}` : '';

  useEffect(() => {
    if (index === null) return;
    const current = index;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onIndex((current + 1) % images.length);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onIndex((current - 1 + images.length) % images.length);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length, index, onIndex]);

  return (
    <Dialog open={index !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="flex h-[100svh] max-h-[100svh] w-screen max-w-none items-center justify-center border-0 bg-background p-4 sm:p-8">
        <DialogTitle className="sr-only">{label}</DialogTitle>
        {open && !isVideoUrl(current) ? (
          <div key={current} className="animate-gallery-in relative h-[min(82svh,52rem)] w-full max-w-5xl">
            <SafeImage src={current} alt={label} fill sizes="100vw" className="object-contain" />
          </div>
        ) : null}
        {open && isVideoUrl(current) ? (
          <video src={current} className="max-h-[82svh] w-full max-w-5xl object-contain" controls autoPlay playsInline aria-label={label} />
        ) : null}
        {images.length > 1 && index !== null ? (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-foreground/15 bg-background/80 transition-colors duration-300 hover:bg-background md:left-6"
              onClick={() => onIndex((index - 1 + images.length) % images.length)}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-foreground/15 bg-background/80 transition-colors duration-300 hover:bg-background md:right-6"
              onClick={() => onIndex((index + 1) % images.length)}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
        {index !== null ? (
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-sans text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
            {index + 1} / {images.length}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
