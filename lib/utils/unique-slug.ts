import type { Model } from 'mongoose';
import { toSlug } from './slugify';

/**
 * Generates a unique slug for a document, appending -2, -3, ... if needed.
 * Works for any Mongoose model that has a `slug` field.
 */
export async function generateUniqueSlug<T>(
  model: Model<T>,
  source: string,
  excludeId?: string
): Promise<string> {
  const base = toSlug(source);
  let slug = base;
  let suffix = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query: Record<string, unknown> = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    // eslint-disable-next-line no-await-in-loop
    const existing = await model.findOne(query).select('_id').lean();
    if (!existing) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}
