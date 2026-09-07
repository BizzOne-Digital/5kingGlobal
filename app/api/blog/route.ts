import { type NextRequest } from 'next/server';
import { getPublishedPosts } from '@/lib/data/blog';
import { jsonOk, jsonServerError } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const category = params.get('category') || undefined;
    const tag = params.get('tag') || undefined;
    const page = Number(params.get('page') || '1');
    const result = await getPublishedPosts({ category, tag, page });
    return jsonOk(result);
  } catch (error) {
    return jsonServerError(error, 'Unable to load blog posts');
  }
}
