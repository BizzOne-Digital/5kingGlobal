import { type NextRequest } from 'next/server';
import { getActiveProducts } from '@/lib/data/products';
import { jsonOk, jsonServerError } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const category = params.get('category') || undefined;
    const search = params.get('search') || undefined;
    const page = Number(params.get('page') || '1');
    const result = await getActiveProducts({ category, search, page });
    return jsonOk(result);
  } catch (error) {
    return jsonServerError(error, 'Unable to load products');
  }
}
