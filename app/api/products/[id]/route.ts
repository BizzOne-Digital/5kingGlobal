import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import { isValidObjectId } from '@/lib/utils/objectId';
import { jsonNotFound, jsonOk, jsonServerError } from '@/lib/utils/api-response';

// Accepts either a MongoDB ObjectId or a slug, so the same endpoint works
// for both programmatic lookups and the public /products/[slug] page.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const query = isValidObjectId(id) ? { _id: id, isActive: true } : { slug: id, isActive: true };
    const product = await Product.findOne(query).populate('category', 'name slug').lean();

    if (!product) return jsonNotFound('Product not found');
    return jsonOk(JSON.parse(JSON.stringify(product)));
  } catch (error) {
    return jsonServerError(error, 'Unable to load product');
  }
}
