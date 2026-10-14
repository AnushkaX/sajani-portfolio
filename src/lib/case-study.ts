import { z } from 'zod';

const text = z.string().max(5000).optional();
const images = z.array(z.string()).optional();

export const caseStudySchema = z.object({
  concept: z
    .object({
      philosophy: text,
      research: images,
      moodboards: images,
    })
    .optional(),
  development: z
    .object({
      notes: text,
      sketches: images,
      silhouettes: images,
      illustrations: images,
      iterations: images,
    })
    .optional(),
  materials: z
    .object({
      notes: text,
      textiles: images,
      fabrics: images,
      surface: images,
      construction: images,
    })
    .optional(),
  garment: z
    .object({
      notes: text,
      patterns: images,
      process: images,
      progress: images,
    })
    .optional(),
  final: z
    .object({
      notes: text,
      details: images,
    })
    .optional(),
});

export type CaseStudy = z.infer<typeof caseStudySchema>;

type FieldKind = 'text' | 'images';

export type CaseStudyField = {
  key: string;
  label: string;
  kind: FieldKind;
  hint: string;
};

export type CaseStudySectionDefinition = {
  key: 'concept' | 'development' | 'materials' | 'garment' | 'final';
  title: string;
  fields: CaseStudyField[];
};

export const CASE_STUDY_SECTIONS: CaseStudySectionDefinition[] = [
  {
    key: 'concept',
    title: 'Concept and Inspiration',
    fields: [
      { key: 'philosophy', label: 'Design philosophy', kind: 'text', hint: 'The idea behind the collection, in your own words.' },
      { key: 'research', label: 'Research images', kind: 'images', hint: 'Reference and research photographs.' },
      { key: 'moodboards', label: 'Moodboards', kind: 'images', hint: 'Boards that set the palette, mood, and direction.' },
    ],
  },
  {
    key: 'development',
    title: 'Design Development',
    fields: [
      { key: 'notes', label: 'Development notes', kind: 'text', hint: 'How the idea moved from research into design.' },
      { key: 'sketches', label: 'Initial sketches', kind: 'images', hint: 'First drawings.' },
      { key: 'silhouettes', label: 'Silhouette exploration', kind: 'images', hint: 'Shape studies.' },
      { key: 'illustrations', label: 'Fashion illustrations', kind: 'images', hint: 'Illustrated looks.' },
      { key: 'iterations', label: 'Design iterations', kind: 'images', hint: 'Later revisions of the design.' },
    ],
  },
  {
    key: 'materials',
    title: 'Material Exploration',
    fields: [
      { key: 'notes', label: 'Material notes', kind: 'text', hint: 'What you tested and why.' },
      { key: 'textiles', label: 'Textile manipulation', kind: 'images', hint: 'Manipulated textile samples.' },
      { key: 'fabrics', label: 'Fabric experimentation', kind: 'images', hint: 'Fabric trials.' },
      { key: 'surface', label: 'Embroidery and surface design', kind: 'images', hint: 'Surface and embroidery studies.' },
      { key: 'construction', label: 'Construction techniques', kind: 'images', hint: 'Technique samples.' },
    ],
  },
  {
    key: 'garment',
    title: 'Garment Development',
    fields: [
      { key: 'notes', label: 'Construction notes', kind: 'text', hint: 'How the garment was built.' },
      { key: 'patterns', label: 'Pattern making', kind: 'images', hint: 'Patterns and toiles.' },
      { key: 'process', label: 'Construction process', kind: 'images', hint: 'Making the garment.' },
      { key: 'progress', label: 'Work-in-progress photographs', kind: 'images', hint: 'The piece while it was still in progress.' },
    ],
  },
  {
    key: 'final',
    title: 'Final Collection',
    fields: [
      { key: 'notes', label: 'Collection notes', kind: 'text', hint: 'Anything you want to say about the finished work.' },
      { key: 'details', label: 'Detailed garment images', kind: 'images', hint: 'Close studies of the finished garments. The main gallery is edited separately.' },
    ],
  },
];

export function emptyCaseStudy(): Required<{
  concept: NonNullable<CaseStudy['concept']>;
  development: NonNullable<CaseStudy['development']>;
  materials: NonNullable<CaseStudy['materials']>;
  garment: NonNullable<CaseStudy['garment']>;
  final: NonNullable<CaseStudy['final']>;
}> {
  return {
    concept: { philosophy: '', research: [], moodboards: [] },
    development: { notes: '', sketches: [], silhouettes: [], illustrations: [], iterations: [] },
    materials: { notes: '', textiles: [], fabrics: [], surface: [], construction: [] },
    garment: { notes: '', patterns: [], process: [], progress: [] },
    final: { notes: '', details: [] },
  };
}

export function mergeCaseStudy(value?: CaseStudy): ReturnType<typeof emptyCaseStudy> {
  const empty = emptyCaseStudy();
  if (!value) return empty;
  return {
    concept: { ...empty.concept, ...value.concept },
    development: { ...empty.development, ...value.development },
    materials: { ...empty.materials, ...value.materials },
    garment: { ...empty.garment, ...value.garment },
    final: { ...empty.final, ...value.final },
  };
}

function cleanText(value?: string) {
  const next = value?.trim() ?? '';
  return next || undefined;
}

function cleanImages(value?: string[]) {
  const next = (value ?? []).map((item) => item.trim()).filter(Boolean);
  return next.length > 0 ? next : undefined;
}

export function compactCaseStudy(value?: CaseStudy): CaseStudy | undefined {
  if (!value) return undefined;
  const concept = {
    philosophy: cleanText(value.concept?.philosophy),
    research: cleanImages(value.concept?.research),
    moodboards: cleanImages(value.concept?.moodboards),
  };
  const development = {
    notes: cleanText(value.development?.notes),
    sketches: cleanImages(value.development?.sketches),
    silhouettes: cleanImages(value.development?.silhouettes),
    illustrations: cleanImages(value.development?.illustrations),
    iterations: cleanImages(value.development?.iterations),
  };
  const materials = {
    notes: cleanText(value.materials?.notes),
    textiles: cleanImages(value.materials?.textiles),
    fabrics: cleanImages(value.materials?.fabrics),
    surface: cleanImages(value.materials?.surface),
    construction: cleanImages(value.materials?.construction),
  };
  const garment = {
    notes: cleanText(value.garment?.notes),
    patterns: cleanImages(value.garment?.patterns),
    process: cleanImages(value.garment?.process),
    progress: cleanImages(value.garment?.progress),
  };
  const final = {
    notes: cleanText(value.final?.notes),
    details: cleanImages(value.final?.details),
  };
  const next: CaseStudy = {};
  if (Object.values(concept).some(Boolean)) next.concept = concept;
  if (Object.values(development).some(Boolean)) next.development = development;
  if (Object.values(materials).some(Boolean)) next.materials = materials;
  if (Object.values(garment).some(Boolean)) next.garment = garment;
  if (Object.values(final).some(Boolean)) next.final = final;
  return Object.keys(next).length > 0 ? next : undefined;
}

export function parseCaseStudy(value: unknown): CaseStudy | undefined {
  const parsed = caseStudySchema.safeParse(value ?? undefined);
  if (!parsed.success) return undefined;
  return compactCaseStudy(parsed.data);
}

export function caseStudyImages(study?: CaseStudy): string[] {
  if (!study) return [];
  return [
    ...(study.concept?.research ?? []),
    ...(study.concept?.moodboards ?? []),
    ...(study.development?.sketches ?? []),
    ...(study.development?.silhouettes ?? []),
    ...(study.development?.illustrations ?? []),
    ...(study.development?.iterations ?? []),
    ...(study.materials?.textiles ?? []),
    ...(study.materials?.fabrics ?? []),
    ...(study.materials?.surface ?? []),
    ...(study.materials?.construction ?? []),
    ...(study.garment?.patterns ?? []),
    ...(study.garment?.process ?? []),
    ...(study.garment?.progress ?? []),
    ...(study.final?.details ?? []),
  ].filter(Boolean);
}

export function sectionHasContent(section: CaseStudySectionDefinition, study?: CaseStudy): boolean {
  const block = study?.[section.key] as Record<string, string | string[] | undefined> | undefined;
  if (!block) return false;
  return section.fields.some((field) => {
    const value = block[field.key];
    if (typeof value === 'string') return value.trim().length > 0;
    return Array.isArray(value) && value.some(Boolean);
  });
}
