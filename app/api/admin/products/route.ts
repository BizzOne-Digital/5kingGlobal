import { type NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth/current-user';
import { productSchema } from '@/lib/validations/product';
import { generateUniqueSlug } from '@/lib/utils/unique-slug';
import { isValidObjectId } from '@/lib/utils/objectId';
import { jsonError, jsonOk, jsonServerError } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const search = request.nextUrl.searchParams.get('search') || undefined;
    const query: Record<string, unknown> = {};
    if (search) {
      query.name = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    }

    const products = await Product.find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .populate('category', 'name slug')
      .lean();
    return jsonOk(JSON.parse(JSON.stringify(products)));
  } catch (error) {
    return jsonServerError(error, 'Unable to load products');
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = productSchema.parse(body);

    if (data.category && !isValidObjectId(data.category)) {
      return jsonError('Invalid category', 400);
    }

    await connectToDatabase();
    const slug = data.slug ? data.slug : await generateUniqueSlug(Product, data.name);

    const product = await Product.create({
      ...data,
      slug,
      category: data.category || undefined,
    });
    return jsonOk(JSON.parse(JSON.stringify(product)), 201);
  } catch (error) {
    return jsonServerError(error, 'Unable to create product');
  }
}
