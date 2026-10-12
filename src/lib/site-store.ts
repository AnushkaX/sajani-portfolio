import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { defaultSiteContent, normalizeSiteContent, type SiteContent } from './site-content';
import { assertWritableStore, getSupabaseAdmin, isSupabaseConfigured } from './supabase';

const DATA_DIR = path.join(process.cwd(), 'data');
const SITE_FILE = path.join(DATA_DIR, 'site.json');
const SITE_ID = 'main';

function missingTable(message: string): boolean {
  return /site_content/i.test(message);
}

async function readFileSite(): Promise<SiteContent> {
  try {
    const raw = await readFile(SITE_FILE, 'utf-8');
    return normalizeSiteContent(JSON.parse(raw));
  } catch {
    return defaultSiteContent;
  }
}

async function writeFileSite(content: SiteContent): Promise<void> {
  assertWritableStore();
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(SITE_FILE, JSON.stringify(content, null, 2), 'utf-8');
}

export async function getSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured()) return readFileSite();
  const supabase = getSupabaseAdmin();
  if (!supabase) return readFileSite();

  const { data, error } = await supabase
    .from('site_content')
    .select('content')
    .eq('id', SITE_ID)
    .maybeSingle();
  if (error) {
    if (missingTable(error.message)) return readFileSite();
    throw new Error(error.message);
  }
  if (!data?.content) return defaultSiteContent;
  return normalizeSiteContent(data.content);
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  const normalized = normalizeSiteContent(content);
  if (!isSupabaseConfigured()) {
    await writeFileSite(normalized);
    return normalized;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase.from('site_content').upsert({
    id: SITE_ID,
    content: normalized,
    updated_at: new Date().toISOString(),
  });
  if (error && missingTable(error.message)) {
    throw new Error('The site content table is missing. Run supabase/schema.sql again in the Supabase SQL editor.');
  }
  if (error) throw new Error(error.message);
  return normalized;
}
