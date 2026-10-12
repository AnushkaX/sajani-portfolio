import { NextResponse } from 'next/server';
import { deleteCategory, renameCategory } from '@/lib/categories-store';
import { isAdmin } from '@/lib/auth';
import { categoryNameSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await isAdmin();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = categoryNameSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a category name' }, { status: 400 });
  }
  try {
    const category = await renameCategory(id, parsed.data.name);
    return NextResponse.json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not rename category';
    const status = message === 'Category not found' ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await isAdmin();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    await deleteCategory(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not delete category';
    const status = message === 'Category not found' ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
