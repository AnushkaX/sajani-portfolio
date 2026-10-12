import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let admin: SupabaseClient | null = null;

function isPlaceholder(value: string | undefined, placeholders: string[]): boolean {
  const trimmed = value?.trim() ?? '';
  return !trimmed || placeholders.some((placeholder) => trimmed === placeholder || trimmed.includes(placeholder));
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (isPlaceholder(url, ['YOUR_PROJECT.supabase.co'])) return false;
  if (isPlaceholder(key, ['your-service-role-key'])) return false;
  return true;
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!admin) {
    admin = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return admin;
}

export function assertWritableStore(): void {
  if (process.env.VERCEL && !isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Vercel.'
    );
  }
}
