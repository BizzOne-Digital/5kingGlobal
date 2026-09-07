import { type NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import Service from '@/models/Service';
import { requireAdmin } from '@/lib/auth/current-user';
import { serviceSchema } from '@/lib/validations/service';
import { generateUniqueSlug } from '@/lib/utils/unique-slug';
import { jsonOk, jsonServerError } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const search = request.nextUrl.searchParams.get('search') || undefined;
    const query: Record<string, unknown> = {};
    if (search) {
      query.title = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    }

    const services = await Service.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return jsonOk(JSON.parse(JSON.stringify(services)));
  } catch (error) {
    return jsonServerError(error, 'Unable to load services');
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = serviceSchema.parse(body);

    await connectToDatabase();
    const slug = data.slug ? data.slug : await generateUniqueSlug(Service, data.title);

    const service = await Service.create({ ...data, slug });
    return jsonOk(JSON.parse(JSON.stringify(service)), 201);
  } catch (error) {
    return jsonServerError(error, 'Unable to create service');
  }
}
