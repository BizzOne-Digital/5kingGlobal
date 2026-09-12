import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth/current-user';
import { productUpdateSchema } from '@/lib/validations/product';
import { generateUniqueSlug } from '@/lib/utils/unique-slug';
import { isValidObjectId } from '@/lib/utils/objectId';
import { jsonError, jsonNotFound, jsonOk, jsonServerError } from '@/lib/utils/api-response';
import { revalidatePublicContent } from '@/lib/utils/revalidate-public';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    await connectToDatabase();
    const product = await Product.findById(id).populate('category', 'name slug').lean();
    if (!product) return jsonNotFound('Product not found');
    return jsonOk(JSON.parse(JSON.stringify(product)));
  } catch (error) {
    return jsonServerError(error, 'Unable to load product');
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    const body = await request.json();
    const data = productUpdateSchema.parse(body);

    if (data.category && !isValidObjectId(data.category)) {
      return jsonError('Invalid category', 400);
    }

    await connectToDatabase();

    const update: Record<string, unknown> = { ...data };
    if (data.slug) {
      update.slug = await generateUniqueSlug(Product, data.slug, id);
    } else if (data.name) {
      delete update.slug;
    }
    if (data.category === '') update.category = null;

    const product = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })
      .populate('category', 'name slug')
      .lean();

    if (!product) return jsonNotFound('Product not found');
    revalidatePublicContent();
    return jsonOk(JSON.parse(JSON.stringify(product)));
  } catch (error) {
    return jsonServerError(error, 'Unable to update product');
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    await connectToDatabase();
    const product = await Product.findByIdAndDelete(id).lean();
    if (!product) return jsonNotFound('Product not found');
    revalidatePublicContent();
    return jsonOk({ deleted: true });
  } catch (error) {
    return jsonServerError(error, 'Unable to delete product');
  }
}
