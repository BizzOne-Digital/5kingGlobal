import { type NextRequest } from 'next/server';
import { getActiveServices } from '@/lib/data/services';
import { jsonOk, jsonServerError } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category') || undefined;
    const services = await getActiveServices(category);
    return jsonOk(services);
  } catch (error) {
    return jsonServerError(error, 'Unable to load services');
  }
}
