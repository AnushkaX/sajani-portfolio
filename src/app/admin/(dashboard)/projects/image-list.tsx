'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isVideoUrl, mediaLabel } from '@/lib/media';

function moveItem(items: string[], from: number, to: number): string[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function ImageList({
  images,
  onChange,
  onUseAsCover,
  allowCover = true,
  emptyLabel = 'No gallery media yet.',
}: {
  images: string[];
  onChange: (images: string[]) => void;
  onUseAsCover?: (url: string) => void;
  allowCover?: boolean;
  emptyLabel?: string;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [url, setUrl] = useState('');

  function addUrl() {
    const next = url.trim();
    if (!next) return;
    onChange([...images, next]);
    setUrl('');
  }

  return (
    <div className="space-y-3">
      {images.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ul className="space-y-2">
          {images.map((image, index) => {
            const video = isVideoUrl(image);
            return (
            <li
              key={`${image}-${index}`}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragIndex === null) return;
                onChange(moveItem(images, dragIndex, index));
                setDragIndex(null);
              }}
              className="flex items-center gap-3 border bg-background p-2"
            >
              {video ? (
                <video src={image} className="h-16 w-12 shrink-0 bg-black object-cover" muted preload="metadata" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="" className="h-16 w-12 shrink-0 object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-muted-foreground">{mediaLabel(image)}</p>
                <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground/70">{video ? 'Video' : 'Image'}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button type="button" variant="ghost" size="icon" aria-label="Move image up" disabled={index === 0} onClick={() => onChange(moveItem(images, index, index - 1))}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Move image down" disabled={index === images.length - 1} onClick={() => onChange(moveItem(images, index, index + 1))}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                {allowCover && onUseAsCover && !video ? (
                  <Button type="button" variant="outline" size="sm" onClick={() => onUseAsCover(image)}>
                    Cover
                  </Button>
                ) : null}
                <Button type="button" variant="ghost" size="icon" aria-label="Remove image" onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
            );
          })}
        </ul>
      )}
      <div className="flex gap-2">
        <Input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addUrl();
            }
          }}
          placeholder="Or paste an image or video URL"
          aria-label="Media URL"
        />
        <Button type="button" variant="outline" disabled={!url.trim()} onClick={addUrl}>Add</Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Drag a row, or use the arrows, to change the order. MP4, WEBM, OGG, and MOV URLs are displayed as videos.
      </p>
    </div>
  );
}
