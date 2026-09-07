import { z } from 'zod';

export const mediaUpdateSchema = z.object({
  alt: z.string().trim().max(200).optional(),
  folder: z.string().trim().max(80).optional(),
});

export const externalMediaSchema = z.object({
  externalSource: z.enum(['youtube', 'vimeo']),
  externalId: z.string().trim().min(1).max(60),
  filename: z.string().trim().min(1).max(200),
  alt: z.string().trim().max(200).optional().or(z.literal('')),
  folder: z.string().trim().max(80).optional().or(z.literal('')),
});

export type MediaUpdateInput = z.infer<typeof mediaUpdateSchema>;
export type ExternalMediaInput = z.infer<typeof externalMediaSchema>;
