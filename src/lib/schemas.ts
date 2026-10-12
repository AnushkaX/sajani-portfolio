import { z } from "zod";

export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  category: z.string().trim().min(1, "Category is required").max(80),
  date: z.string().min(1, "Date is required"),
  description: z.string(),
  coverImage: z.string().min(1, "Cover image is required"),
  images: z.array(z.string()),
  deletedAt: z.string().nullable().optional(),
});

export const projectCreateSchema = projectSchema.omit({ id: true, deletedAt: true });
export const projectUpdateSchema = projectCreateSchema.partial();

export const projectsArraySchema = z.array(projectSchema);

export const categoryNameSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().email('Enter a valid email').max(200),
  message: z.string().trim().min(1, 'Message is required').max(5000),
});

export type ProjectSchema = z.infer<typeof projectSchema>;
export type ProjectCreateSchema = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateSchema = z.infer<typeof projectUpdateSchema>;
