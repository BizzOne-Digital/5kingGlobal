import { type NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import { requireAdmin } from '@/lib/auth/current-user';
import { jsonOk, jsonServerError } from '@/lib/utils/api-response';

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const params = request.nextUrl.searchParams;
    const status = params.get('status') || undefined;
    const search = params.get('search') || undefined;
    const page = Math.max(1, Number(params.get('page') || '1') || 1);

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { email: { $regex: safe, $options: 'i' } },
        { subject: { $regex: safe, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      ContactMessage.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean(),
      ContactMessage.countDocuments(query),
    ]);

    return jsonOk({
      items: JSON.parse(JSON.stringify(items)),
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    });
  } catch (error) {
    return jsonServerError(error, 'Unable to load messages');
  }
}
