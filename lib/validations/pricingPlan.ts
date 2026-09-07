import { z } from 'zod';

export const pricingPlanSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(5).max(500),
  price: z.number().min(0).optional(),
  billingType: z.enum(['one-time', 'monthly', 'yearly', 'quote']).default('quote'),
  features: z.array(z.string().trim().min(1)).default([]),
  ctaText: z.string().trim().min(2).max(60).default('Request a Quote'),
  ctaUrl: z.string().trim().min(1).max(200).default('/booking'),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const pricingPlanUpdateSchema = pricingPlanSchema.partial();

export type PricingPlanInput = z.infer<typeof pricingPlanSchema>;
