'use client';

import { useFormContext, type FieldPath } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { CASE_STUDY_SECTIONS } from '@/lib/case-study';
import type { ProjectCreateSchema } from '@/lib/schemas';
import { ImageList } from './image-list';
import { ImageUploader } from './image-uploader';

export function CaseStudyFields() {
  const form = useFormContext<ProjectCreateSchema>();

  return (
    <div className="space-y-10 border-t border-foreground/10 pt-8">
      <div>
        <h2 className="font-display text-3xl">Case study</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Each part below is a place for material you already have. A section appears on the collection page only after it has text or images. Leave unused parts empty.
        </p>
      </div>
      {CASE_STUDY_SECTIONS.map((section) => (
        <fieldset key={section.key} className="space-y-6">
          <legend className="font-display text-2xl">{section.title}</legend>
          {section.fields.map((field) => {
            const name = `caseStudy.${section.key}.${field.key}` as FieldPath<ProjectCreateSchema>;
            if (field.kind === 'text') {
              return (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field: input }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <p className="text-xs leading-5 text-muted-foreground">{field.hint}</p>
                      <FormControl>
                        <Textarea rows={4} value={typeof input.value === 'string' ? input.value : ''} onChange={input.onChange} onBlur={input.onBlur} name={input.name} ref={input.ref} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }
            return (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field: input }) => {
                  const images = Array.isArray(input.value) ? input.value : [];
                  return (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <p className="text-xs leading-5 text-muted-foreground">{field.hint}</p>
                      <ImageList
                        images={images}
                        onChange={input.onChange}
                        allowCover={false}
                        emptyLabel="Nothing added yet."
                      />
                      <ImageUploader
                        label={`Upload ${field.label}`}
                        onUploaded={(url) => input.onChange([...images, url])}
                      />
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            );
          })}
        </fieldset>
      ))}
    </div>
  );
}
