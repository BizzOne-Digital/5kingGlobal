import connectToDatabase from '@/lib/db';
import Media from '@/models/Media';
import { requireAdmin } from '@/lib/auth/current-user';
import { getStorageProvider } from '@/lib/storage';
import { mediaUpdateSchema } from '@/lib/validations/media';
import { isValidObjectId } from '@/lib/utils/objectId';
import { jsonError, jsonNotFound, jsonOk, jsonServerError } from '@/lib/utils/api-response';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    const body = await request.json();
    const data = mediaUpdateSchema.parse(body);

    await connectToDatabase();
    const media = await Media.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!media) return jsonNotFound('Media not found');
    return jsonOk(JSON.parse(JSON.stringify(media)));
  } catch (error) {
    return jsonServerError(error, 'Unable to update media');
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    await connectToDatabase();
    const media = await Media.findById(id).lean();
    if (!media) return jsonNotFound('Media not found');

    if (media.provider !== 'external' && media.publicId) {
      try {
        const provider = getStorageProvider();
        await provider.delete(media.publicId);
      } catch {
        // If remote deletion fails we still remove the DB record rather
        // than leaving a dangling reference the admin can't clear.
      }
    }

    await Media.findByIdAndDelete(id);
    return jsonOk({ deleted: true });
  } catch (error) {
    return jsonServerError(error, 'Unable to delete media');
  }
}
