import { getPostBySlug } from '@/lib/data/blog';
import { jsonNotFound, jsonOk, jsonServerError } from '@/lib/utils/api-response';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return jsonNotFound('Post not found');
    return jsonOk(post);
  } catch (error) {
    return jsonServerError(error, 'Unable to load post');
  }
}
