import { z } from 'zod';

export const bookingSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(120),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(7, 'Please enter a valid phone number')
    .max(20)
    .regex(/^[0-9+()\-.\s]+$/, 'Please enter a valid phone number'),
  customerType: z.enum(['residential', 'commercial', 'professional']),
  service: z.string().trim().min(2).max(120),
  preferredDate: z.string().trim().optional().or(z.literal('')),
  preferredTime: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  // Honeypot field — real users never fill this in; bots often do.
  website: z.string().max(0).optional().or(z.literal('')),
});

export const bookingStatusSchema = z.object({
  status: z.enum(['pending', 'contacted', 'confirmed', 'completed', 'cancelled']),
});

export type BookingInput = z.infer<typeof bookingSchema>;
