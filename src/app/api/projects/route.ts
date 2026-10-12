import { NextResponse } from 'next/server';
import { createStoredProject, getStoredProjects } from '@/lib/projects-store';
import { isAdmin } from '@/lib/auth';
import { projectCreateSchema } from '@/lib/schemas';
import { getCategories } from '@/lib/categories-store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const includeDeleted = new URL(request.url).searchParams.get('includeDeleted') === '1' && await isAdmin();
    const projects = await getStoredProjects({ includeDeleted });
    return NextResponse.json(projects);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load projects';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const ok = await isAdmin();
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = projectCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const categories = await getCategories();
    if (!categories.some((category) => category.name === parsed.data.category)) {
      return NextResponse.json({ error: 'Choose a category from the list' }, { status: 400 });
    }
    const project = await createStoredProject(parsed.data);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not create project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
