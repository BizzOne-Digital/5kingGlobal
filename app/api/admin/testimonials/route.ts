import connectToDatabase from '@/lib/db';
import Testimonial from '@/models/Testimonial';
import { requireAdmin } from '@/lib/auth/current-user';
import { testimonialSchema } from '@/lib/validations/testimonial';
import { jsonOk, jsonServerError } from '@/lib/utils/api-response';
import { revalidatePublicContent } from '@/lib/utils/revalidate-public';

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();
    return jsonOk(JSON.parse(JSON.stringify(testimonials)));
  } catch (error) {
    return jsonServerError(error, 'Unable to load testimonials');
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = testimonialSchema.parse(body);

    await connectToDatabase();
    const testimonial = await Testimonial.create(data);
    revalidatePublicContent();
    return jsonOk(JSON.parse(JSON.stringify(testimonial)), 201);
  } catch (error) {
    return jsonServerError(error, 'Unable to create testimonial');
  }
}
