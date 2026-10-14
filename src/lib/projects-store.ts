import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { caseStudyImages, compactCaseStudy, parseCaseStudy } from './case-study';
import type { Project } from './projects';
import { projects as fallbackProjects } from './projects';
import { projectCreateSchema, projectsArraySchema, type ProjectCreateSchema, type ProjectUpdateSchema } from './schemas';
import { assertWritableStore, getSupabaseAdmin, isSupabaseConfigured } from './supabase';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

type ProjectRow = {
  id: string;
  title: string;
  category: Project['category'];
  date: string;
  description: string;
  cover_image: string;
  images: string[] | null;
  case_study?: unknown;
  deleted_at?: string | null;
};

const PROJECT_COLUMNS = 'id, title, category, date, description, cover_image, images, case_study, deleted_at';
const PROJECT_COLUMNS_WITHOUT_CASE = 'id, title, category, date, description, cover_image, images, deleted_at';
const PROJECT_COLUMNS_LEGACY = 'id, title, category, date, description, cover_image, images';

function missingColumn(message: string, column: string): boolean {
  return new RegExp(column, 'i').test(message);
}

function missingDeletedColumn(message: string): boolean {
  return missingColumn(message, 'deleted_at');
}

function fromRow(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    date: row.date,
    description: row.description,
    coverImage: row.cover_image,
    images: row.images ?? [],
    caseStudy: parseCaseStudy(row.case_study),
    deletedAt: row.deleted_at ?? null,
  };
}

function toRow(project: Project): ProjectRow {
  return {
    id: project.id,
    title: project.title,
    category: project.category,
    date: project.date,
    description: project.description,
    cover_image: project.coverImage,
    images: project.images,
    case_study: compactCaseStudy(project.caseStudy) ?? {},
  };
}

export function projectMediaUrls(project: Pick<Project, 'coverImage' | 'images' | 'caseStudy'>): string[] {
  return [project.coverImage, ...project.images, ...caseStudyImages(project.caseStudy)].filter(Boolean);
}

async function readFileProjects(): Promise<Project[]> {
  try {
    const raw = await readFile(PROJECTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as unknown;
    const result = projectsArraySchema.safeParse(parsed);
    if (result.success) return result.data;
    return fallbackProjects;
  } catch {
    return fallbackProjects;
  }
}

async function writeFileProjects(projects: Project[]): Promise<void> {
  assertWritableStore();
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

function visibleProjects(projects: Project[], includeDeleted: boolean): Project[] {
  if (includeDeleted) return projects;
  return projects.filter((project) => !project.deletedAt);
}

async function selectProjects(filterId?: string): Promise<Project[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return readFileProjects();

  const primary = filterId
    ? await supabase.from('projects').select(PROJECT_COLUMNS).eq('id', filterId)
    : await supabase.from('projects').select(PROJECT_COLUMNS).order('created_at', { ascending: true });

  let data = primary.data as ProjectRow[] | null;
  let error = primary.error;
  if (error && missingColumn(error.message, 'case_study')) {
    const withoutCase = filterId
      ? await supabase.from('projects').select(PROJECT_COLUMNS_WITHOUT_CASE).eq('id', filterId)
      : await supabase.from('projects').select(PROJECT_COLUMNS_WITHOUT_CASE).order('created_at', { ascending: true });
    data = withoutCase.data as ProjectRow[] | null;
    error = withoutCase.error;
  }
  if (error && missingDeletedColumn(error.message)) {
    const legacy = filterId
      ? await supabase.from('projects').select(PROJECT_COLUMNS_LEGACY).eq('id', filterId)
      : await supabase.from('projects').select(PROJECT_COLUMNS_LEGACY).order('created_at', { ascending: true });
    data = legacy.data as ProjectRow[] | null;
    error = legacy.error;
  }
  if (error) throw new Error(error.message);
  return (data ?? []).map(fromRow);
}

export async function getStoredProjects(options?: { includeDeleted?: boolean }): Promise<Project[]> {
  const includeDeleted = options?.includeDeleted ?? false;
  if (!isSupabaseConfigured()) return visibleProjects(await readFileProjects(), includeDeleted);
  return visibleProjects(await selectProjects(), includeDeleted);
}

export async function getStoredProject(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    const projects = await readFileProjects();
    return projects.find((project) => project.id === id) ?? null;
  }
  const projects = await selectProjects(id);
  return projects[0] ?? null;
}

export async function setProjectDeleted(id: string, deleted: boolean): Promise<Project | null> {
  const deletedAt = deleted ? new Date().toISOString() : null;
  if (!isSupabaseConfigured()) {
    const projects = await readFileProjects();
    const index = projects.findIndex((project) => project.id === id);
    if (index === -1) return null;
    projects[index] = { ...projects[index], deletedAt };
    await writeFileProjects(projects);
    return projects[index];
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase
    .from('projects')
    .update({ deleted_at: deletedAt })
    .eq('id', id)
    .select(PROJECT_COLUMNS)
    .maybeSingle();
  if (error && missingColumn(error.message, 'case_study')) {
    const retry = await supabase.from('projects').update({ deleted_at: deletedAt }).eq('id', id).select(PROJECT_COLUMNS_WITHOUT_CASE).maybeSingle();
    if (retry.error && missingDeletedColumn(retry.error.message)) {
      throw new Error('Run supabase/schema.sql again in the Supabase SQL editor so projects can be archived.');
    }
    if (retry.error) throw new Error(retry.error.message);
    if (!retry.data) return null;
    return fromRow(retry.data as ProjectRow);
  }
  if (error && missingDeletedColumn(error.message)) {
    throw new Error('Run supabase/schema.sql again in the Supabase SQL editor so projects can be archived.');
  }
  if (error) throw new Error(error.message);
  if (!data) return null;
  return fromRow(data as ProjectRow);
}

export async function createStoredProject(input: ProjectCreateSchema): Promise<Project> {
  const parsed = projectCreateSchema.parse(input);
  const project: Project = { ...parsed, caseStudy: compactCaseStudy(parsed.caseStudy), id: crypto.randomUUID() };

  if (!isSupabaseConfigured()) {
    const projects = await readFileProjects();
    projects.push(project);
    await writeFileProjects(projects);
    return project;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase is not configured');
  const row = toRow(project);
  const inserted = await supabase.from('projects').insert(row);
  if (inserted.error && missingColumn(inserted.error.message, 'case_study')) {
    if (project.caseStudy) {
      throw new Error('Run supabase/schema.sql again in the Supabase SQL editor so collection case studies can be saved.');
    }
    const { case_study: _caseStudy, ...legacyRow } = row;
    const retry = await supabase.from('projects').insert(legacyRow);
    if (retry.error) throw new Error(retry.error.message);
    return project;
  }
  if (inserted.error) throw new Error(inserted.error.message);
  return project;
}

export async function updateStoredProject(id: string, patch: ProjectUpdateSchema): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    const projects = await readFileProjects();
    const index = projects.findIndex((project) => project.id === id);
    if (index === -1) return null;
    projects[index] = {
      ...projects[index],
      ...patch,
      caseStudy: patch.caseStudy !== undefined ? compactCaseStudy(patch.caseStudy) : projects[index].caseStudy,
      id,
    };
    await writeFileProjects(projects);
    return projects[index];
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase is not configured');
  const row: Partial<ProjectRow> = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.category !== undefined) row.category = patch.category;
  if (patch.date !== undefined) row.date = patch.date;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.coverImage !== undefined) row.cover_image = patch.coverImage;
  if (patch.images !== undefined) row.images = patch.images;
  if (patch.caseStudy !== undefined) row.case_study = compactCaseStudy(patch.caseStudy) ?? {};

  const { data, error } = await supabase
    .from('projects')
    .update(row)
    .eq('id', id)
    .select(PROJECT_COLUMNS)
    .maybeSingle();
  if (error && missingColumn(error.message, 'case_study')) {
    if (patch.caseStudy && compactCaseStudy(patch.caseStudy)) {
      throw new Error('Run supabase/schema.sql again in the Supabase SQL editor so collection case studies can be saved.');
    }
    delete row.case_study;
    const retry = await supabase.from('projects').update(row).eq('id', id).select(PROJECT_COLUMNS_WITHOUT_CASE).maybeSingle();
    if (retry.error) throw new Error(retry.error.message);
    if (!retry.data) return null;
    return fromRow(retry.data as ProjectRow);
  }
  if (error) throw new Error(error.message);
  if (!data) return null;
  return fromRow(data as ProjectRow);
}

export async function renameProjectCategory(from: string, to: string): Promise<void> {
  if (from === to) return;
  if (!isSupabaseConfigured()) {
    const projects = await readFileProjects();
    let changed = false;
    for (const project of projects) {
      if (project.category === from) {
        project.category = to;
        changed = true;
      }
    }
    if (changed) await writeFileProjects(projects);
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase.from('projects').update({ category: to }).eq('category', from);
  if (error) throw new Error(error.message);
}

export async function deleteStoredProject(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const projects = await readFileProjects();
    const filtered = projects.filter((project) => project.id !== id);
    if (filtered.length === projects.length) return false;
    await writeFileProjects(filtered);
    return true;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.from('projects').delete().eq('id', id).select('id');
  if (error) throw new Error(error.message);
  return (data?.length ?? 0) > 0;
}
