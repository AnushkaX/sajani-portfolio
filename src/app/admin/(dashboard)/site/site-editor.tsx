'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { SiteContent } from '@/lib/site-content';
import { ImageList } from '../projects/image-list';
import { MEDIA_ACCEPT, uploadMediaFile } from '@/lib/media-upload';

function Field({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {textarea ? (
        <Textarea value={value} rows={4} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <Input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  );
}

async function uploadDocument(file: File): Promise<string> {
  const body = new FormData();
  body.append('file', file);
  const response = await fetch('/api/upload', { method: 'POST', body });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? 'Upload failed');
  return data.url as string;
}

export function SiteEditor() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');

  useEffect(() => {
    fetch('/api/site')
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error ?? 'Could not load site details');
        setContent(data);
      })
      .catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'Could not load site details'));
  }, []);

  function update<K extends keyof SiteContent>(section: K, patch: Partial<SiteContent[K]>) {
    setContent((current) => current ? { ...current, [section]: { ...current[section], ...patch } } : current);
    setSaved(false);
  }

  async function onUpload(section: 'hero' | 'about' | 'cv', file: File | undefined) {
    if (!file || !content) return;
    setUploading(section);
    setError('');
    try {
      const url = section === 'cv' ? await uploadDocument(file) : await uploadMediaFile(file);
      if (section === 'cv') update('resume', { cvUrl: url, cvDownloadName: file.name || content.resume.cvDownloadName });
      if (section === 'hero') update('hero', { slides: [...content.hero.slides, url] });
      if (section === 'about') update('about', { image: url });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed');
    } finally {
      setUploading('');
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!content) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const response = await fetch('/api/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error ?? 'Could not save');
      setContent(data);
      setSaved(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save');
    } finally {
      setSaving(false);
    }
  }

  if (!content) return <p className="text-muted-foreground">{error || 'Loading…'}</p>;

  return (
    <form onSubmit={save} className="max-w-3xl space-y-10">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Hero</h2>
        <Field label="Eyebrow" value={content.hero.eyebrow} onChange={(eyebrow) => update('hero', { eyebrow })} />
        <Field label="Name" value={content.hero.name} onChange={(name) => update('hero', { name })} />
        <Field label="Tagline" value={content.hero.tagline} onChange={(tagline) => update('hero', { tagline })} textarea />
        <div className="space-y-2">
          <Label>Banner carousel</Label>
          <ImageList
            images={content.hero.slides}
            onChange={(slides) => update('hero', { slides })}
            onUseAsCover={() => {}}
            allowCover={false}
            emptyLabel="Add at least one banner image or video."
          />
        </div>
        <Input
          type="file"
          accept={MEDIA_ACCEPT}
          aria-label="Upload banner image or video"
          disabled={uploading === 'hero'}
          onChange={(event) => onUpload('hero', event.target.files?.[0])}
        />
        {uploading === 'hero' && <p className="text-sm text-muted-foreground">Uploading banner media…</p>}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">About</h2>
        <Field label="Eyebrow" value={content.about.eyebrow} onChange={(eyebrow) => update('about', { eyebrow })} />
        <Field label="Title" value={content.about.title} onChange={(title) => update('about', { title })} />
        <Field label="Summary" value={content.about.summary} onChange={(summary) => update('about', { summary })} textarea />
        <Field label="First paragraph" value={content.about.paragraphOne} onChange={(paragraphOne) => update('about', { paragraphOne })} textarea />
        <Field label="Second paragraph" value={content.about.paragraphTwo} onChange={(paragraphTwo) => update('about', { paragraphTwo })} textarea />
        <Field label="Portrait URL" value={content.about.image} onChange={(image) => update('about', { image })} />
        <Input type="file" accept="image/*" aria-label="Upload portrait" disabled={uploading === 'about'} onChange={(event) => onUpload('about', event.target.files?.[0])} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Resume and CV</h2>
        <Field label="Eyebrow" value={content.resume.eyebrow} onChange={(eyebrow) => update('resume', { eyebrow })} />
        <Field label="Title" value={content.resume.title} onChange={(title) => update('resume', { title })} />
        <Field label="Description" value={content.resume.description} onChange={(description) => update('resume', { description })} textarea />
        <Field label="CV file URL" value={content.resume.cvUrl} onChange={(cvUrl) => update('resume', { cvUrl })} />
        <Field label="Download file name" value={content.resume.cvDownloadName} onChange={(cvDownloadName) => update('resume', { cvDownloadName })} />
        <Input type="file" accept="application/pdf" aria-label="Upload CV" disabled={uploading === 'cv'} onChange={(event) => onUpload('cv', event.target.files?.[0])} />
        {uploading === 'cv' && <p className="text-sm text-muted-foreground">Uploading CV…</p>}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Education</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => update('resume', { education: [...content.resume.education, { degree: '', school: '', years: '' }] })}>Add</Button>
          </div>
          {content.resume.education.map((item, index) => (
            <div key={`education-${index}`} className="grid gap-2 border p-3 sm:grid-cols-3">
              <Input aria-label="Degree" placeholder="Degree" value={item.degree} onChange={(event) => update('resume', { education: content.resume.education.map((entry, entryIndex) => entryIndex === index ? { ...entry, degree: event.target.value } : entry) })} />
              <Input aria-label="School" placeholder="School" value={item.school} onChange={(event) => update('resume', { education: content.resume.education.map((entry, entryIndex) => entryIndex === index ? { ...entry, school: event.target.value } : entry) })} />
              <div className="flex gap-2">
                <Input aria-label="Years" placeholder="Years" value={item.years} onChange={(event) => update('resume', { education: content.resume.education.map((entry, entryIndex) => entryIndex === index ? { ...entry, years: event.target.value } : entry) })} />
                <Button type="button" variant="ghost" onClick={() => update('resume', { education: content.resume.education.filter((_, entryIndex) => entryIndex !== index) })}>Remove</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Experience</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => update('resume', { experience: [...content.resume.experience, { role: '', company: '', duration: '' }] })}>Add</Button>
          </div>
          {content.resume.experience.map((item, index) => (
            <div key={`experience-${index}`} className="grid gap-2 border p-3 sm:grid-cols-3">
              <Input aria-label="Role" placeholder="Role" value={item.role} onChange={(event) => update('resume', { experience: content.resume.experience.map((entry, entryIndex) => entryIndex === index ? { ...entry, role: event.target.value } : entry) })} />
              <Input aria-label="Company" placeholder="Company" value={item.company} onChange={(event) => update('resume', { experience: content.resume.experience.map((entry, entryIndex) => entryIndex === index ? { ...entry, company: event.target.value } : entry) })} />
              <div className="flex gap-2">
                <Input aria-label="Duration" placeholder="Duration" value={item.duration} onChange={(event) => update('resume', { experience: content.resume.experience.map((entry, entryIndex) => entryIndex === index ? { ...entry, duration: event.target.value } : entry) })} />
                <Button type="button" variant="ghost" onClick={() => update('resume', { experience: content.resume.experience.filter((_, entryIndex) => entryIndex !== index) })}>Remove</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label>Skills</Label>
          <Textarea
            rows={5}
            value={content.resume.skills.join('\n')}
            onChange={(event) => update('resume', { skills: event.target.value.split('\n') })}
          />
          <p className="text-xs text-muted-foreground">One skill per line.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Social links</h2>
        <Field label="Instagram" value={content.social.instagram} onChange={(instagram) => update('social', { instagram })} />
        <Field label="LinkedIn" value={content.social.linkedin} onChange={(linkedin) => update('social', { linkedin })} />
        <Field label="Behance" value={content.social.behance} onChange={(behance) => update('social', { behance })} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Contact</h2>
        <Field label="Eyebrow" value={content.contact.eyebrow} onChange={(eyebrow) => update('contact', { eyebrow })} />
        <Field label="Title" value={content.contact.title} onChange={(title) => update('contact', { title })} />
        <Field label="Description" value={content.contact.description} onChange={(description) => update('contact', { description })} textarea />
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm text-muted-foreground">Saved. Refresh the public site to see it.</p>}
      <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save details'}</Button>
    </form>
  );
}
