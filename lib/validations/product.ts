import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().trim().min(2).max(150),
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().trim().min(10),
  shortDescription: z.string().trim().min(5).max(240),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional(),
  images: z.array(z.string().trim().min(1)).default([]),
  category: z.string().trim().length(24).optional().or(z.literal('')),
  sku: z.string().trim().min(1).max(60),
  inventory: z.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  seoTitle: z.string().trim().max(70).optional().or(z.literal('')),
  seoDescription: z.string().trim().max(160).optional().or(z.literal('')),
});

export const productUpdateSchema = productSchema.partial();

export type ProductInput = z.infer<typeof productSchema>;
