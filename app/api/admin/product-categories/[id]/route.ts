import connectToDatabase from '@/lib/db';
import ProductCategory from '@/models/ProductCategory';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth/current-user';
import { productCategoryUpdateSchema } from '@/lib/validations/productCategory';
import { generateUniqueSlug } from '@/lib/utils/unique-slug';
import { isValidObjectId } from '@/lib/utils/objectId';
import { jsonError, jsonNotFound, jsonOk, jsonServerError } from '@/lib/utils/api-response';
import { revalidatePublicContent } from '@/lib/utils/revalidate-public';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    const body = await request.json();
    const data = productCategoryUpdateSchema.parse(body);

    await connectToDatabase();
    const update: Record<string, unknown> = { ...data };
    if (data.slug) {
      update.slug = await generateUniqueSlug(ProductCategory, data.slug, id);
    } else if (data.name) {
      delete update.slug;
    }

    const category = await ProductCategory.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!category) return jsonNotFound('Category not found');
    revalidatePublicContent();
    return jsonOk(JSON.parse(JSON.stringify(category)));
  } catch (error) {
    return jsonServerError(error, 'Unable to update product category');
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    await connectToDatabase();

    const inUse = await Product.countDocuments({ category: id });
    if (inUse > 0) {
      return jsonError(
        `Cannot delete — ${inUse} product${inUse === 1 ? ' is' : 's are'} still assigned to this category.`,
        409
      );
    }

    const category = await ProductCategory.findByIdAndDelete(id).lean();
    if (!category) return jsonNotFound('Category not found');
    revalidatePublicContent();
    return jsonOk({ deleted: true });
  } catch (error) {
    return jsonServerError(error, 'Unable to delete product category');
  }
}
