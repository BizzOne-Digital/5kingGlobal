import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(120),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().max(20).optional().or(z.literal('')),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(10, 'Please provide a bit more detail').max(3000),
  website: z.string().max(0).optional().or(z.literal('')),
});

export const contactMessageStatusSchema = z.object({
  status: z.enum(['unread', 'read', 'replied', 'archived']),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
