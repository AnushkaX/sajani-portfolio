import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { createContactMessage, listContactMessages } from '@/lib/messages-store';
import { contactSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export async function GET() {
  const ok = await isAdmin();
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const messages = await listContactMessages();
    return NextResponse.json(messages);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load messages';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (body && typeof body === 'object' && 'company' in body && String((body as { company?: string }).company ?? '').trim()) {
    return NextResponse.json({ ok: true });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the form and try again.' }, { status: 400 });
  }
  try {
    await createContactMessage(parsed.data);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not send message';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
