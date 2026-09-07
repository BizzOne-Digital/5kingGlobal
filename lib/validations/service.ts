import { z } from 'zod';

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only').optional(),
  shortDescription: z.string().trim().min(10).max(240),
  description: z.string().trim().min(20),
  category: z.string().trim().min(2).max(80),
  image: z.string().trim().optional().or(z.literal('')),
  icon: z.string().trim().optional().or(z.literal('')),
  features: z.array(z.string().trim().min(1)).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  seoTitle: z.string().trim().max(70).optional().or(z.literal('')),
  seoDescription: z.string().trim().max(160).optional().or(z.literal('')),
});

export const serviceUpdateSchema = serviceSchema.partial();

export type ServiceInput = z.infer<typeof serviceSchema>;
