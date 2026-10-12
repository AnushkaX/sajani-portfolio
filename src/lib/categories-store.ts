import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { DEFAULT_CATEGORIES } from './projects';
import { getStoredProjects, renameProjectCategory } from './projects-store';
import { assertWritableStore, getSupabaseAdmin, isSupabaseConfigured } from './supabase';

export type Category = {
  id: string;
  name: string;
};

type CategoryRow = {
  id: string;
  name: string;
  sort_order: number;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

const DEFAULTS: Category[] = DEFAULT_CATEGORIES.map((name, index) => ({
  id: slugify(name) || `category-${index + 1}`,
  name,
}));

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniqueId(name: string, existing: Category[]): string {
  const base = slugify(name) || 'category';
  if (!existing.some((category) => category.id === base)) return base;
  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

async function readFileCategories(): Promise<Category[]> {
  try {
    const raw = await readFile(CATEGORIES_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Category[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

async function writeFileCategories(categories: Category[]): Promise<void> {
  assertWritableStore();
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8');
}

function friendlyError(message: string): string {
  if (message.toLowerCase().includes('categories')) {
    return 'The categories table is missing. Run supabase/schema.sql again in the Supabase SQL editor, then refresh.';
  }
  return message;
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return readFileCategories();
  const supabase = getSupabaseAdmin();
  if (!supabase) return readFileCategories();

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, sort_order')
    .order('sort_order', { ascending: true });
  if (error) throw new Error(friendlyError(error.message));

  const rows = (data ?? []) as CategoryRow[];
  if (rows.length > 0) return rows.map(({ id, name }) => ({ id, name }));

  const seeded = DEFAULTS.map((category, index) => ({ ...category, sort_order: index }));
  const { error: insertError } = await supabase.from('categories').insert(seeded);
  if (insertError) throw new Error(friendlyError(insertError.message));
  return DEFAULTS;
}

export async function createCategory(name: string): Promise<Category> {
  const trimmed = name.trim();
  const existing = await getCategories();
  if (existing.some((category) => category.name.toLowerCase() === trimmed.toLowerCase())) {
    throw new Error('That category already exists');
  }
  const category: Category = { id: uniqueId(trimmed, existing), name: trimmed };

  if (!isSupabaseConfigured()) {
    await writeFileCategories([...existing, category]);
    return category;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase.from('categories').insert({
    id: category.id,
    name: category.name,
    sort_order: existing.length,
  });
  if (error) throw new Error(friendlyError(error.message));
  return category;
}

export async function renameCategory(id: string, name: string): Promise<Category> {
  const trimmed = name.trim();
  const existing = await getCategories();
  const current = existing.find((category) => category.id === id);
  if (!current) throw new Error('Category not found');
  if (existing.some((category) => category.id !== id && category.name.toLowerCase() === trimmed.toLowerCase())) {
    throw new Error('That category already exists');
  }

  if (!isSupabaseConfigured()) {
    await writeFileCategories(existing.map((category) => (category.id === id ? { ...category, name: trimmed } : category)));
  } else {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error('Supabase is not configured');
    const { error } = await supabase.from('categories').update({ name: trimmed }).eq('id', id);
    if (error) throw new Error(friendlyError(error.message));
  }

  await renameProjectCategory(current.name, trimmed);
  return { id, name: trimmed };
}

export async function deleteCategory(id: string): Promise<void> {
  const existing = await getCategories();
  const current = existing.find((category) => category.id === id);
  if (!current) throw new Error('Category not found');
  if (existing.length === 1) throw new Error('Keep at least one category');

  const projects = await getStoredProjects();
  const inUse = projects.some((project) => project.category === current.name);
  if (inUse) throw new Error('Move the projects in this category before deleting it');

  if (!isSupabaseConfigured()) {
    await writeFileCategories(existing.filter((category) => category.id !== id));
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(friendlyError(error.message));
}
