'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DEFAULT_CATEGORIES } from '@/lib/projects';
import { projectCreateSchema } from '@/lib/schemas';
import type { Project } from '@/lib/projects';
import type { z } from 'zod';
import { ImageList } from './image-list';
import { MEDIA_ACCEPT, uploadMediaFile } from '@/lib/media-upload';

type ProjectFormValues = z.infer<typeof projectCreateSchema>;

interface ProjectFormProps {
  project?: Project;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  isEdit?: boolean;
}

function ImageUploader({
  label,
  onUploaded,
  allowVideo = false,
}: {
  label: string;
  onUploaded: (url: string) => void;
  allowVideo?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      onUploaded(await uploadMediaFile(file));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1">
      <Input
        type="file"
        accept={allowVideo ? MEDIA_ACCEPT : 'image/*'}
        aria-label={label}
        disabled={uploading}
        onChange={handleFile}
      />
      {uploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function ProjectForm({ project, onSubmit, isEdit }: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectCreateSchema),
    defaultValues: project
      ? {
          title: project.title,
          category: project.category,
          date: project.date,
          description: project.description,
          coverImage: project.coverImage,
          images: project.images,
        }
      : {
          title: '',
          category: 'Haute Couture',
          date: '',
          description: '',
          coverImage: '',
          images: [],
        },
  });

  const [submitError, setSubmitError] = useState('');
  const [categories, setCategories] = useState<string[]>([...DEFAULT_CATEGORIES]);

  useEffect(() => {
    fetch('/api/categories')
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { name: string }[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data.map((category) => category.name));
        }
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(values: ProjectFormValues) {
    setSubmitError('');
    try {
      await onSubmit(values);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not save project');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-3xl space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Project title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from(new Set([field.value, ...categories].filter(Boolean))).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Spring 2023" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Project description" rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover image</FormLabel>
              <FormControl>
                <Input placeholder="/images/project1/1.jpg or https://..." {...field} />
              </FormControl>
              {field.value ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={field.value} alt="" className="h-24 w-16 object-cover" />
                  <Button type="button" variant="ghost" onClick={() => field.onChange('')}>
                    Remove cover
                  </Button>
                </div>
              ) : null}
              <ImageUploader label="Upload cover image" onUploaded={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gallery media</FormLabel>
              <ImageList
                images={field.value}
                onChange={field.onChange}
                onUseAsCover={(url) => form.setValue('coverImage', url, { shouldValidate: true })}
              />
              <ImageUploader
                label="Upload gallery image or video"
                allowVideo
                onUploaded={(url) => field.onChange([...field.value, url])}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        {submitError && <p className="text-sm text-destructive">{submitError}</p>}
        <div className="flex gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create project'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin">Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
