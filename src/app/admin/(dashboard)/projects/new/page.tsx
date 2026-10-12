'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProjectForm } from '../project-form';
import type { ProjectCreateSchema } from '@/lib/schemas';

export default function NewProjectPage() {
  const router = useRouter();

  async function handleSubmit(values: ProjectCreateSchema) {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? 'Failed to create project');
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">New project</h1>
      </div>
      <ProjectForm onSubmit={handleSubmit} isEdit={false} />
    </div>
  );
}
