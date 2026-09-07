import { getActiveTestimonials } from '@/lib/data/testimonials';
import { jsonOk, jsonServerError } from '@/lib/utils/api-response';

export async function GET() {
  try {
    const testimonials = await getActiveTestimonials();
    return jsonOk(testimonials);
  } catch (error) {
    return jsonServerError(error, 'Unable to load testimonials');
  }
}
