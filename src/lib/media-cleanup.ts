import { unlink } from 'fs/promises';
import path from 'path';
import { getStoredProjects, projectMediaUrls } from './projects-store';
import { getSupabaseAdmin, isSupabaseConfigured } from './supabase';

const BUCKET = 'project-images';

function storageObjectPath(url: string): string | null {
  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const index = parsed.pathname.indexOf(marker);
    if (index === -1) return null;
    const objectPath = decodeURIComponent(parsed.pathname.slice(index + marker.length));
    if (!objectPath || objectPath.includes('..')) return null;
    return objectPath;
  } catch {
    return null;
  }
}

function localImageFile(url: string): string | null {
  if (!url.startsWith('/images/') || url.includes('..')) return null;
  const root = path.resolve(process.cwd(), 'public', 'images');
  const file = path.resolve(process.cwd(), 'public', url.slice(1));
  const relative = path.relative(root, file);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return file;
}

export async function deleteUnusedImages(urls: string[]): Promise<void> {
  const unique = Array.from(new Set(urls.filter(Boolean)));
  if (unique.length === 0) return;

  const projects = await getStoredProjects({ includeDeleted: true });
  const used = new Set<string>();
  for (const project of projects) {
    for (const url of projectMediaUrls(project)) used.add(url);
  }

  const storagePaths: string[] = [];
  for (const url of unique) {
    if (used.has(url)) continue;
    const objectPath = storageObjectPath(url);
    if (objectPath) {
      storagePaths.push(objectPath);
      continue;
    }
    const file = localImageFile(url);
    if (!file) continue;
    await unlink(file).catch(() => {});
  }

  if (storagePaths.length === 0 || !isSupabaseConfigured()) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  const { error } = await supabase.storage.from(BUCKET).remove(storagePaths);
  if (error) console.error(error.message);
}
