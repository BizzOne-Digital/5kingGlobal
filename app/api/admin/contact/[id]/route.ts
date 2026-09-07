import connectToDatabase from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import { requireAdmin } from '@/lib/auth/current-user';
import { contactMessageStatusSchema } from '@/lib/validations/contactMessage';
import { isValidObjectId } from '@/lib/utils/objectId';
import { jsonError, jsonNotFound, jsonOk, jsonServerError } from '@/lib/utils/api-response';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    await connectToDatabase();
    const message = await ContactMessage.findById(id).lean();
    if (!message) return jsonNotFound('Message not found');
    return jsonOk(JSON.parse(JSON.stringify(message)));
  } catch (error) {
    return jsonServerError(error, 'Unable to load message');
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    const body = await request.json();
    const { status } = contactMessageStatusSchema.parse(body);

    await connectToDatabase();
    const message = await ContactMessage.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!message) return jsonNotFound('Message not found');
    return jsonOk(JSON.parse(JSON.stringify(message)));
  } catch (error) {
    return jsonServerError(error, 'Unable to update message');
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    await connectToDatabase();
    const message = await ContactMessage.findByIdAndDelete(id).lean();
    if (!message) return jsonNotFound('Message not found');
    return jsonOk({ deleted: true });
  } catch (error) {
    return jsonServerError(error, 'Unable to delete message');
  }
}
