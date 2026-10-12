import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getSiteContent, saveSiteContent } from '@/lib/site-store';
import { normalizeSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load site details';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const ok = await isAdmin();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const content = await saveSiteContent(normalizeSiteContent(body));
    return NextResponse.json(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not save site details';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
