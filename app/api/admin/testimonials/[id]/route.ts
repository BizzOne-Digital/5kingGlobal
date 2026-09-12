import connectToDatabase from '@/lib/db';
import Testimonial from '@/models/Testimonial';
import { requireAdmin } from '@/lib/auth/current-user';
import { testimonialUpdateSchema } from '@/lib/validations/testimonial';
import { isValidObjectId } from '@/lib/utils/objectId';
import { jsonError, jsonNotFound, jsonOk, jsonServerError } from '@/lib/utils/api-response';
import { revalidatePublicContent } from '@/lib/utils/revalidate-public';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    const body = await request.json();
    const data = testimonialUpdateSchema.parse(body);

    await connectToDatabase();
    const testimonial = await Testimonial.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!testimonial) return jsonNotFound('Testimonial not found');
    revalidatePublicContent();
    return jsonOk(JSON.parse(JSON.stringify(testimonial)));
  } catch (error) {
    return jsonServerError(error, 'Unable to update testimonial');
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    await connectToDatabase();
    const testimonial = await Testimonial.findByIdAndDelete(id).lean();
    if (!testimonial) return jsonNotFound('Testimonial not found');
    revalidatePublicContent();
    return jsonOk({ deleted: true });
  } catch (error) {
    return jsonServerError(error, 'Unable to delete testimonial');
  }
}
