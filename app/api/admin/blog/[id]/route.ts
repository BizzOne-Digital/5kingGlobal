import connectToDatabase from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { requireAdmin } from '@/lib/auth/current-user';
import { blogPostUpdateSchema } from '@/lib/validations/blogPost';
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
    const post = await BlogPost.findById(id).lean();
    if (!post) return jsonNotFound('Post not found');
    return jsonOk(JSON.parse(JSON.stringify(post)));
  } catch (error) {
    return jsonServerError(error, 'Unable to load post');
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    const body = await request.json();
    const data = blogPostUpdateSchema.parse(body);

    await connectToDatabase();

    const existing = await BlogPost.findById(id).lean();
    if (!existing) return jsonNotFound('Post not found');

    const update: Record<string, unknown> = { ...data };
    if (data.slug) {
      update.slug = await generateUniqueSlug(BlogPost, data.slug, id);
    } else if (data.title) {
      delete update.slug;
    }

    if (data.status === 'published' && existing.status !== 'published') {
      update.publishedAt = new Date();
    }

    const post = await BlogPost.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    revalidatePublicContent();
    return jsonOk(JSON.parse(JSON.stringify(post)));
  } catch (error) {
    return jsonServerError(error, 'Unable to update post');
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    await connectToDatabase();
    const post = await BlogPost.findByIdAndDelete(id).lean();
    if (!post) return jsonNotFound('Post not found');
    revalidatePublicContent();
    return jsonOk({ deleted: true });
  } catch (error) {
    return jsonServerError(error, 'Unable to delete post');
  }
}
