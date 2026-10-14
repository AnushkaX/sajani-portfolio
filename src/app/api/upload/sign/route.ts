import path from 'path';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const BUCKET = 'project-images';
const MAX_BYTES = 100 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/ogg': 'ogv',
  'video/quicktime': 'mov',
};

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase storage is not configured.' }, { status: 503 });
  }

  let body: { name?: string; type?: string; size?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid upload request' }, { status: 400 });
  }

  const extension = body.type ? EXTENSIONS[body.type] : undefined;
  if (!extension) {
    return NextResponse.json({ error: 'Use a JPG, PNG, WEBP, GIF, AVIF, MP4, WEBM, OGG, or MOV file.' }, { status: 400 });
  }
  if (!body.size || body.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Media files must be 100MB or smaller.' }, { status: 400 });
  }

  const original = path.basename(body.name ?? `media.${extension}`, path.extname(body.name ?? ''))
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  const objectPath = `media/${crypto.randomUUID()}-${original || 'file'}.${extension}`;
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase storage is not configured.' }, { status: 503 });
  }

  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(objectPath);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
  return NextResponse.json({
    signedUrl: data.signedUrl,
    publicUrl: publicData.publicUrl,
  });
}
