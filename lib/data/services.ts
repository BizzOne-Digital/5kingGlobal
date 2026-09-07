import 'server-only';
import connectToDatabase from '@/lib/db';
import Service, { type IService } from '@/models/Service';

export async function getActiveServices(category?: string) {
  await connectToDatabase();
  const query: Record<string, unknown> = { isActive: true };
  if (category) query.category = category;
  const services = await Service.find(query).sort({ sortOrder: 1, createdAt: 1 }).lean();
  return JSON.parse(JSON.stringify(services)) as IService[];
}

export async function getFeaturedServices(limit = 6) {
  await connectToDatabase();
  const services = await Service.find({ isActive: true, isFeatured: true })
    .sort({ sortOrder: 1 })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(services)) as IService[];
}

export async function getServiceBySlug(slug: string) {
  await connectToDatabase();
  const service = await Service.findOne({ slug, isActive: true }).lean();
  return service ? (JSON.parse(JSON.stringify(service)) as IService) : null;
}

export async function getServiceCategories() {
  await connectToDatabase();
  const categories = await Service.distinct('category', { isActive: true });
  return categories as string[];
}
