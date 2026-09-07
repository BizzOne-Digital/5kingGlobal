import { z } from 'zod';

export const blogPostSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(220).regex(/^[a-z0-9-]+$/).optional(),
  excerpt: z.string().trim().min(10).max(300),
  content: z.string().trim().min(20),
  featuredImage: z.string().trim().optional().or(z.literal('')),
  category: z.string().trim().max(80).optional().or(z.literal('')),
  tags: z.array(z.string().trim().min(1)).default([]),
  author: z.string().trim().min(2).max(100),
  status: z.enum(['draft', 'published']).default('draft'),
  seoTitle: z.string().trim().max(70).optional().or(z.literal('')),
  seoDescription: z.string().trim().max(160).optional().or(z.literal('')),
});

export const blogPostUpdateSchema = blogPostSchema.partial();

export type BlogPostInput = z.infer<typeof blogPostSchema>;
