import { getActiveProductCategories } from '@/lib/data/products';
import { jsonOk, jsonServerError } from '@/lib/utils/api-response';

export async function GET() {
  try {
    const categories = await getActiveProductCategories();
    return jsonOk(categories);
  } catch (error) {
    return jsonServerError(error, 'Unable to load product categories');
  }
}
