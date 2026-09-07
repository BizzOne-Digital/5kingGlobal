import { getServiceBySlug } from '@/lib/data/services';
import { jsonNotFound, jsonOk, jsonServerError } from '@/lib/utils/api-response';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const service = await getServiceBySlug(slug);
    if (!service) return jsonNotFound('Service not found');
    return jsonOk(service);
  } catch (error) {
    return jsonServerError(error, 'Unable to load service');
  }
}
