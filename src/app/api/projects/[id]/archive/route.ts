import { NextResponse } from 'next/server';
import { setProjectDeleted } from '@/lib/projects-store';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function setDeleted(
  params: Promise<{ id: string }>,
  deleted: boolean,
) {
  const ok = await isAdmin();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const project = await setProjectDeleted(id, deleted);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return setDeleted(params, true);
}
