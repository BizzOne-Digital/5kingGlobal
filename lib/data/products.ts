import 'server-only';
import connectToDatabase from '@/lib/db';
import Product, { type IProduct } from '@/models/Product';
import ProductCategory, { type IProductCategory } from '@/models/ProductCategory';

const PAGE_SIZE = 12;

export interface ProductListParams {
  category?: string;
  search?: string;
  page?: number;
}

export async function getActiveProducts({ category, search, page = 1 }: ProductListParams = {}) {
  await connectToDatabase();
  const query: Record<string, unknown> = { isActive: true };
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { name: { $regex: escapeRegex(search), $options: 'i' } },
      { shortDescription: { $regex: escapeRegex(search), $options: 'i' } },
    ];
  }

  const safePage = Math.max(1, Math.floor(page) || 1);
  const [items, total] = await Promise.all([
    Product.find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip((safePage - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .populate('category', 'name slug')
      .lean(),
    Product.countDocuments(query),
  ]);

  return {
    items: JSON.parse(JSON.stringify(items)) as IProduct[],
    total,
    page: safePage,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getFeaturedProducts(limit = 8) {
  await connectToDatabase();
  const items = await Product.find({ isActive: true, isFeatured: true })
    .sort({ sortOrder: 1 })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(items)) as IProduct[];
}

export async function getProductBySlug(slug: string) {
  await connectToDatabase();
  const product = await Product.findOne({ slug, isActive: true })
    .populate('category', 'name slug')
    .lean();
  return product ? (JSON.parse(JSON.stringify(product)) as IProduct) : null;
}

export async function getActiveProductCategories() {
  await connectToDatabase();
  const categories = await ProductCategory.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
  return JSON.parse(JSON.stringify(categories)) as IProductCategory[];
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
