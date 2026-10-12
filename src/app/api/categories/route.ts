import { NextResponse } from 'next/server';
import { createCategory, getCategories } from '@/lib/categories-store';
import { isAdmin } from '@/lib/auth';
import { categoryNameSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load categories';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const ok = await isAdmin();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
    const category = await createCategory(parsed.data.name);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not create category';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
