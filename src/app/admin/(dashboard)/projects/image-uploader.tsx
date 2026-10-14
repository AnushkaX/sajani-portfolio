'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { MEDIA_ACCEPT, uploadMediaFile } from '@/lib/media-upload';

export function ImageUploader({
  label,
  onUploaded,
  allowVideo = false,
}: {
  label: string;
  onUploaded: (url: string) => void;
  allowVideo?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      onUploaded(await uploadMediaFile(file));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1">
      <Input
        type="file"
        accept={allowVideo ? MEDIA_ACCEPT : 'image/*'}
        aria-label={label}
        disabled={uploading}
        onChange={handleFile}
      />
      {uploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
