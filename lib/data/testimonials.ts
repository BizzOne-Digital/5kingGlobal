import 'server-only';
import connectToDatabase from '@/lib/db';
import Testimonial, { type ITestimonial } from '@/models/Testimonial';

export async function getActiveTestimonials(featuredOnly = false) {
  await connectToDatabase();
  const query: Record<string, unknown> = { isActive: true };
  if (featuredOnly) query.isFeatured = true;
  const items = await Testimonial.find(query).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(items)) as ITestimonial[];
}
