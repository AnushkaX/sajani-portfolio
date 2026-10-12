'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProjectForm } from '../project-form';
import type { Project } from '@/lib/projects';
import type { ProjectCreateSchema } from '@/lib/schemas';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(setProject)
      .catch(() => setError('Project not found'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(values: ProjectCreateSchema) {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? 'Failed to update project');
    }
    router.push('/admin');
    router.refresh();
  }

  async function runAction(action: 'archive' | 'restore' | 'delete') {
    if (!project) return;
    const confirmMessage = action === 'delete'
      ? `Permanently delete “${project.title}” and its unused images? This cannot be undone.`
      : action === 'archive'
        ? `Hide “${project.title}” from the site? You can restore it later.`
        : `Restore “${project.title}” to the site?`;
    if (!window.confirm(confirmMessage)) return;
    setActionError('');
    const response = await fetch(
      action === 'delete' ? `/api/projects/${id}` : `/api/projects/${id}/${action}`,
      { method: action === 'delete' ? 'DELETE' : 'POST' },
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setActionError(data.error ?? 'Could not update project');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;
  if (error || !project) return <p className="text-destructive">{error || 'Project not found'}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Link href="/admin" className="text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">Edit project</h1>
        {project.deletedAt ? (
          <>
            <Button type="button" variant="outline" onClick={() => runAction('restore')}>Restore</Button>
            <Button type="button" variant="destructive" onClick={() => runAction('delete')}>Delete permanently</Button>
          </>
        ) : (
          <Button type="button" variant="outline" onClick={() => runAction('archive')}>Archive</Button>
        )}
      </div>
      {actionError && <p className="text-sm text-destructive">{actionError}</p>}
      <ProjectForm project={project} onSubmit={handleSubmit} isEdit />
    </div>
  );
}
