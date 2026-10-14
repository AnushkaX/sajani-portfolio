export const MEDIA_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/ogg,video/quicktime';

type SignedUpload = {
  signedUrl: string;
  publicUrl: string;
};

export async function uploadMediaFile(file: File): Promise<string> {
  const signResponse = await fetch('/api/upload/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: file.name,
      type: file.type,
      size: file.size,
    }),
  });
  const signed = await signResponse.json().catch(() => ({})) as Partial<SignedUpload> & { error?: string };
  if (!signResponse.ok || !signed.signedUrl || !signed.publicUrl) {
    throw new Error(signed.error ?? 'Could not prepare the upload');
  }

  const body = new FormData();
  body.append('cacheControl', '3600');
  body.append('', file);
  const uploadResponse = await fetch(signed.signedUrl, {
    method: 'PUT',
    headers: { 'x-upsert': 'false' },
    body,
  });
  if (!uploadResponse.ok) {
    const details = await uploadResponse.text().catch(() => '');
    throw new Error(details || 'Upload failed');
  }
  return signed.publicUrl;
}
