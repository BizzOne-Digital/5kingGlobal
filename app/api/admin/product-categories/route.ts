import connectToDatabase from '@/lib/db';
import ProductCategory from '@/models/ProductCategory';
import { requireAdmin } from '@/lib/auth/current-user';
import { productCategorySchema } from '@/lib/validations/productCategory';
import { generateUniqueSlug } from '@/lib/utils/unique-slug';
import { jsonOk, jsonServerError } from '@/lib/utils/api-response';

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();
    const categories = await ProductCategory.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return jsonOk(JSON.parse(JSON.stringify(categories)));
  } catch (error) {
    return jsonServerError(error, 'Unable to load product categories');
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = productCategorySchema.parse(body);

    await connectToDatabase();
    const slug = data.slug ? data.slug : await generateUniqueSlug(ProductCategory, data.name);

    const category = await ProductCategory.create({ ...data, slug });
    return jsonOk(JSON.parse(JSON.stringify(category)), 201);
  } catch (error) {
    return jsonServerError(error, 'Unable to create product category');
  }
}
