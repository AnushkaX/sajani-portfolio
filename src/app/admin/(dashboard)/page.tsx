'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Archive, RotateCcw, Trash2 } from 'lucide-react';
import { CategoriesManager } from './categories-manager';
import type { Project } from '@/lib/projects';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectError, setProjectError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function loadProjects() {
    const res = await fetch('/api/projects?includeDeleted=1');
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !Array.isArray(data)) {
      setProjectError(data.error ?? 'Could not load projects');
      setProjects([]);
      return;
    }
    setProjectError('');
    setProjects(data);
  }

  useEffect(() => {
    loadProjects()
      .catch(() => setProjectError('Could not load projects'))
      .finally(() => setLoading(false));

    fetch('/api/contact')
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setMessageError(data.error ?? 'Could not load messages');
          return;
        }
        setMessages(Array.isArray(data) ? data : []);
      })
      .catch(() => setMessageError('Could not load messages'));
  }, []);

  async function runProjectAction(id: string, action: 'archive' | 'restore' | 'delete', title: string) {
    const confirmMessage = action === 'delete'
      ? `Permanently delete “${title}” and its unused images? This cannot be undone.`
      : action === 'archive'
        ? `Hide “${title}” from the site? You can restore it later.`
        : `Restore “${title}” to the site?`;
    if (!window.confirm(confirmMessage)) return;
    setPendingId(id);
    setProjectError('');
    try {
      const response = await fetch(
        action === 'delete' ? `/api/projects/${id}` : `/api/projects/${id}/${action}`,
        { method: action === 'delete' ? 'DELETE' : 'POST' },
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setProjectError(data.error ?? 'Could not update project');
        return;
      }
      await loadProjects();
    } catch {
      setProjectError('Could not update project');
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-10">
      <CategoriesManager />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Add project
          </Link>
        </Button>
      </div>
      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : projectError ? (
        <p className="text-sm text-destructive">{projectError}</p>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No projects yet. Add your first project to get started.
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              <Card className="overflow-hidden">
                <div className="aspect-[3/2] bg-muted">
                  {/* Admin thumbnails can point at any stored URL, including Supabase. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.coverImage} alt="" className="h-full w-full object-cover" />
                </div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base">{project.title}</CardTitle>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/projects/${project.id}`} aria-label={`Edit ${project.title}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {project.category} · {project.date}
                    {project.deletedAt ? ' · Archived' : ''}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.deletedAt ? (
                      <>
                        <Button type="button" variant="outline" size="sm" disabled={pendingId === project.id} onClick={() => runProjectAction(project.id, 'restore', project.title)}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                        <Button type="button" variant="destructive" size="sm" disabled={pendingId === project.id} onClick={() => runProjectAction(project.id, 'delete', project.title)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete permanently
                        </Button>
                      </>
                    ) : (
                      <Button type="button" variant="outline" size="sm" disabled={pendingId === project.id} onClick={() => runProjectAction(project.id, 'archive', project.title)}>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Messages</h2>
        {messageError ? (
          <p className="text-sm text-destructive">{messageError}</p>
        ) : messages.length === 0 ? (
          <p className="text-muted-foreground">No messages yet.</p>
        ) : (
          <ul className="space-y-3">
            {messages.map((message) => (
              <li key={message.id}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{message.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{message.email} · {new Date(message.createdAt).toLocaleString()}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm">{message.message}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
