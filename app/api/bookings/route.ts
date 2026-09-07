import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';
import { bookingSchema } from '@/lib/validations/booking';
import { jsonError, jsonOk, jsonServerError } from '@/lib/utils/api-response';
import { getClientIp, isRateLimited } from '@/lib/utils/rate-limit';

// Public endpoint: anyone can submit a booking request. Listing/managing
// bookings is an admin-only concern — see /api/admin/bookings.
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(`booking:${ip}`, 5, 10 * 60 * 1000)) {
      return jsonError('Too many requests. Please try again in a few minutes.', 429);
    }

    const body = await request.json();
    const parsed = bookingSchema.parse(body);

    // Honeypot: if a bot filled the hidden field, silently pretend success.
    if (parsed.website) {
      return jsonOk({ received: true }, 201);
    }

    await connectToDatabase();

    const booking = await Booking.create({
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      customerType: parsed.customerType,
      service: parsed.service,
      preferredDate: parsed.preferredDate ? new Date(parsed.preferredDate) : undefined,
      preferredTime: parsed.preferredTime || undefined,
      message: parsed.message || undefined,
      status: 'pending',
    });

    return jsonOk({ id: booking._id.toString() }, 201);
  } catch (error) {
    return jsonServerError(error, 'Unable to submit booking request');
  }
}
