import { z } from 'zod';

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(150).optional().or(z.literal('')),
  content: z.string().trim().min(10).max(1000),
  rating: z.number().int().min(1).max(5).default(5),
  image: z.string().trim().optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const testimonialUpdateSchema = testimonialSchema.partial();

export type TestimonialInput = z.infer<typeof testimonialSchema>;
