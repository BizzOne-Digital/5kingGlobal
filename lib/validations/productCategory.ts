import { z } from 'zod';

export const productCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  image: z.string().trim().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const productCategoryUpdateSchema = productCategorySchema.partial();

export type ProductCategoryInput = z.infer<typeof productCategorySchema>;
