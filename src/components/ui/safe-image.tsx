'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

type SafeImageProps = Omit<ImageProps, 'src' | 'alt' | 'onError'> & {
  src: string;
  alt: string;
};

function canOptimize(src: string): boolean {
  if (src.startsWith('/')) return true;
  try {
    const host = new URL(src).hostname;
    return (
      host === 'images.pexels.com' ||
      host === 'pexels.com' ||
      host === 'placehold.co' ||
      host.endsWith('.supabase.co')
    );
  } catch {
    return false;
  }
}

export function SafeImage({ src, alt, className, fill, ...rest }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground',
          fill && 'absolute inset-0',
          className
        )}
        role="img"
        aria-label={alt}
      >
        Image unavailable
      </div>
    );
  }

  if (!canOptimize(src)) {
    return (
      // Remote hosts outside next.config are rendered directly so a blocked CDN cannot fail the optimizer.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn(fill && 'absolute inset-0 h-full w-full', className)}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
