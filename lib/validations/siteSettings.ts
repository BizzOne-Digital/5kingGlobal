import { z } from 'zod';

export const siteSettingsSchema = z.object({
  businessName: z.string().trim().min(2).max(150),
  phone: z.string().trim().min(5).max(30),
  email: z.string().trim().email(),
  logo: z.string().trim().optional().or(z.literal('')),
  favicon: z.string().trim().optional().or(z.literal('')),
  socialLinks: z
    .object({
      facebook: z.string().trim().optional().or(z.literal('')),
      instagram: z.string().trim().optional().or(z.literal('')),
      linkedin: z.string().trim().optional().or(z.literal('')),
      twitter: z.string().trim().optional().or(z.literal('')),
      youtube: z.string().trim().optional().or(z.literal('')),
    })
    .default({}),
  address: z.string().trim().max(300).optional().or(z.literal('')),
  serviceAreas: z.array(z.string().trim().min(1)).default([]),
  businessHours: z
    .array(z.object({ day: z.string().trim(), hours: z.string().trim() }))
    .default([]),
  footerText: z.string().trim().max(500).optional().or(z.literal('')),
  defaultSeoTitle: z.string().trim().min(2).max(70),
  defaultSeoDescription: z.string().trim().min(2).max(160),
  primaryColor: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/).default('#0a1730'),
  secondaryColor: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/).default('#c19620'),
});

export const siteSettingsUpdateSchema = siteSettingsSchema.partial();

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
