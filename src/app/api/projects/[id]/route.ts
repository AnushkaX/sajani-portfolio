import { NextResponse } from 'next/server';
import { deleteStoredProject, getStoredProject, projectMediaUrls, setProjectDeleted, updateStoredProject } from '@/lib/projects-store';
import { isAdmin } from '@/lib/auth';
import { projectUpdateSchema } from '@/lib/schemas';
import { getCategories } from '@/lib/categories-store';
import { deleteUnusedImages } from '@/lib/media-cleanup';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const project = await getStoredProject(id);
    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await isAdmin();
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = projectUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }
  try {
    if (parsed.data.category) {
      const categories = await getCategories();
      if (!categories.some((category) => category.name === parsed.data.category)) {
        return NextResponse.json({ error: 'Choose a category from the list' }, { status: 400 });
      }
    }
    const previous = await getStoredProject(id);
    const project = await updateStoredProject(id, parsed.data);
    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (previous) {
      const kept = new Set(projectMediaUrls(project));
      const removed = projectMediaUrls(previous).filter((url) => !kept.has(url));
      await deleteUnusedImages(removed);
    }
    return NextResponse.json(project);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await isAdmin();
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const previous = await getStoredProject(id);
    const deleted = await deleteStoredProject(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (previous) {
      await deleteUnusedImages(projectMediaUrls(previous));
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not delete project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
