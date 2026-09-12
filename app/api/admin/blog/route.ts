import { type NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { requireAdmin } from '@/lib/auth/current-user';
import { blogPostSchema } from '@/lib/validations/blogPost';
import { generateUniqueSlug } from '@/lib/utils/unique-slug';
import { jsonOk, jsonServerError } from '@/lib/utils/api-response';
import { revalidatePublicContent } from '@/lib/utils/revalidate-public';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const status = request.nextUrl.searchParams.get('status') || undefined;
    const query: Record<string, unknown> = {};
    if (status) query.status = status;

    const posts = await BlogPost.find(query).sort({ createdAt: -1 }).lean();
    return jsonOk(JSON.parse(JSON.stringify(posts)));
  } catch (error) {
    return jsonServerError(error, 'Unable to load blog posts');
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = blogPostSchema.parse(body);

    await connectToDatabase();
    const slug = data.slug ? data.slug : await generateUniqueSlug(BlogPost, data.title);

    const post = await BlogPost.create({
      ...data,
      slug,
      publishedAt: data.status === 'published' ? new Date() : undefined,
    });
    revalidatePublicContent();
    return jsonOk(JSON.parse(JSON.stringify(post)), 201);
  } catch (error) {
    return jsonServerError(error, 'Unable to create blog post');
  }
}
