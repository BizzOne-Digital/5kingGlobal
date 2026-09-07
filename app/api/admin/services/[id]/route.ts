import connectToDatabase from '@/lib/db';
import Service from '@/models/Service';
import { requireAdmin } from '@/lib/auth/current-user';
import { serviceUpdateSchema } from '@/lib/validations/service';
import { generateUniqueSlug } from '@/lib/utils/unique-slug';
import { isValidObjectId } from '@/lib/utils/objectId';
import { jsonError, jsonNotFound, jsonOk, jsonServerError } from '@/lib/utils/api-response';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    await connectToDatabase();
    const service = await Service.findById(id).lean();
    if (!service) return jsonNotFound('Service not found');
    return jsonOk(JSON.parse(JSON.stringify(service)));
  } catch (error) {
    return jsonServerError(error, 'Unable to load service');
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    const body = await request.json();
    const data = serviceUpdateSchema.parse(body);

    await connectToDatabase();

    const update: Record<string, unknown> = { ...data };
    if (data.slug) {
      update.slug = await generateUniqueSlug(Service, data.slug, id);
    } else if (data.title) {
      // Keep existing slug unless explicitly changed — avoid breaking links.
      delete update.slug;
    }

    const service = await Service.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!service) return jsonNotFound('Service not found');
    return jsonOk(JSON.parse(JSON.stringify(service)));
  } catch (error) {
    return jsonServerError(error, 'Unable to update service');
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    await connectToDatabase();
    const service = await Service.findByIdAndDelete(id).lean();
    if (!service) return jsonNotFound('Service not found');
    return jsonOk({ deleted: true });
  } catch (error) {
    return jsonServerError(error, 'Unable to delete service');
  }
}
