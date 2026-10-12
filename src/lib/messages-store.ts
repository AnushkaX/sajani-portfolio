import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { assertWritableStore, getSupabaseAdmin, isSupabaseConfigured } from './supabase';

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

type MessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

function fromRow(row: MessageRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.created_at,
  };
}

async function readFileMessages(): Promise<ContactMessage[]> {
  try {
    const raw = await readFile(MESSAGES_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as ContactMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  if (!isSupabaseConfigured()) {
    const messages = await readFileMessages();
    return messages.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('contact_messages')
    .select('id, name, email, message, created_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as MessageRow[]).map(fromRow);
}

export async function createContactMessage(input: {
  name: string;
  email: string;
  message: string;
}): Promise<ContactMessage> {
  const message: ContactMessage = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    message: input.message,
    createdAt: new Date().toISOString(),
  };

  if (!isSupabaseConfigured()) {
    assertWritableStore();
    const messages = await readFileMessages();
    messages.push(message);
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
    return message;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase.from('contact_messages').insert({
    id: message.id,
    name: message.name,
    email: message.email,
    message: message.message,
    created_at: message.createdAt,
  });
  if (error) throw new Error(error.message);
  return message;
}
