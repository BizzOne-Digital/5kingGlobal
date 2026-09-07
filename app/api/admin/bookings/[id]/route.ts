import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';
import { requireAdmin } from '@/lib/auth/current-user';
import { bookingStatusSchema } from '@/lib/validations/booking';
import { isValidObjectId } from '@/lib/utils/objectId';
import { jsonError, jsonNotFound, jsonOk, jsonServerError } from '@/lib/utils/api-response';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    await connectToDatabase();
    const booking = await Booking.findById(id).lean();
    if (!booking) return jsonNotFound('Booking not found');
    return jsonOk(JSON.parse(JSON.stringify(booking)));
  } catch (error) {
    return jsonServerError(error, 'Unable to load booking');
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    const body = await request.json();
    const { status } = bookingStatusSchema.parse(body);

    await connectToDatabase();
    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!booking) return jsonNotFound('Booking not found');
    return jsonOk(JSON.parse(JSON.stringify(booking)));
  } catch (error) {
    return jsonServerError(error, 'Unable to update booking');
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError('Invalid id', 400);

    await connectToDatabase();
    const booking = await Booking.findByIdAndDelete(id).lean();
    if (!booking) return jsonNotFound('Booking not found');
    return jsonOk({ deleted: true });
  } catch (error) {
    return jsonServerError(error, 'Unable to delete booking');
  }
}
