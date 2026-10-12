'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Category = {
  id: string;
  name: string;
};

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function load() {
    const response = await fetch('/api/categories');
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !Array.isArray(data)) {
      setError(data.error ?? 'Could not load categories');
      setCategories([]);
      return;
    }
    setError('');
    setCategories(data);
    setDrafts(Object.fromEntries(data.map((category: Category) => [category.id, category.name])));
  }

  useEffect(() => {
    load()
      .catch(() => setError('Could not load categories'))
      .finally(() => setLoading(false));
  }, []);

  async function addCategory(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setPendingId('new');
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? 'Could not add category');
        return;
      }
      setName('');
      await load();
    } catch {
      setError('Could not add category');
    } finally {
      setPendingId(null);
    }
  }

  async function saveCategory(id: string) {
    setError('');
    setPendingId(id);
    try {
      const response = await fetch(`/api/categories/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: drafts[id] ?? '' }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? 'Could not rename category');
        return;
      }
      await load();
    } catch {
      setError('Could not rename category');
    } finally {
      setPendingId(null);
    }
  }

  async function removeCategory(id: string) {
    setError('');
    setPendingId(id);
    try {
      const response = await fetch(`/api/categories/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? 'Could not delete category');
        return;
      }
      await load();
    } catch {
      setError('Could not delete category');
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Categories</h2>
      <p className="text-sm text-muted-foreground">
        These names appear in the portfolio filters and the project form. Renaming a category updates the projects that use it.
      </p>
      <form onSubmit={addCategory} className="flex max-w-xl flex-col gap-3 sm:flex-row">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="New category"
          aria-label="New category"
          disabled={pendingId === 'new'}
        />
        <Button type="submit" disabled={pendingId === 'new' || !name.trim()}>
          {pendingId === 'new' ? 'Adding…' : 'Add'}
        </Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <ul className="max-w-xl space-y-3">
          {categories.map((category) => {
            const busy = pendingId === category.id;
            const unchanged = (drafts[category.id] ?? '') === category.name;
            return (
              <li key={category.id} className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={drafts[category.id] ?? ''}
                  onChange={(event) => setDrafts((current) => ({ ...current, [category.id]: event.target.value }))}
                  aria-label={`Rename ${category.name}`}
                  disabled={busy}
                />
                <div className="flex gap-2">
                  <Button type="button" variant="outline" disabled={busy || unchanged || !(drafts[category.id] ?? '').trim()} onClick={() => saveCategory(category.id)}>
                    Save
                  </Button>
                  <Button type="button" variant="ghost" disabled={busy} onClick={() => removeCategory(category.id)}>
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
