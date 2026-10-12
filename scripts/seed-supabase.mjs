import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  }
  if (key.startsWith('sb_publishable_')) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is a publishable key. Use the secret key (sb_secret_...) instead.');
  }

  const projects = JSON.parse(await readFile(new URL('../data/projects.json', import.meta.url), 'utf8'));
  const rows = projects.map((project) => ({
    id: project.id,
    title: project.title,
    category: project.category,
    date: project.date,
    description: project.description,
    cover_image: project.coverImage,
    images: project.images,
  }));

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from('projects').upsert(rows);
  if (error) throw new Error(error.message);

  console.log(`Upserted ${rows.length} projects`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
