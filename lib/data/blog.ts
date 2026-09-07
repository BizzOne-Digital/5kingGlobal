import 'server-only';
import connectToDatabase from '@/lib/db';
import BlogPost, { type IBlogPost } from '@/models/BlogPost';

const PAGE_SIZE = 9;

export interface BlogListParams {
  category?: string;
  tag?: string;
  page?: number;
}

export async function getPublishedPosts({ category, tag, page = 1 }: BlogListParams = {}) {
  await connectToDatabase();
  const query: Record<string, unknown> = { status: 'published' };
  if (category) query.category = category;
  if (tag) query.tags = tag;

  const safePage = Math.max(1, Math.floor(page) || 1);
  const [items, total] = await Promise.all([
    BlogPost.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((safePage - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    BlogPost.countDocuments(query),
  ]);

  return {
    items: JSON.parse(JSON.stringify(items)) as IBlogPost[],
    total,
    page: safePage,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getPostBySlug(slug: string) {
  await connectToDatabase();
  const post = await BlogPost.findOne({ slug, status: 'published' }).lean();
  return post ? (JSON.parse(JSON.stringify(post)) as IBlogPost) : null;
}

export async function getRecentPosts(limit = 3) {
  await connectToDatabase();
  const items = await BlogPost.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(items)) as IBlogPost[];
}
