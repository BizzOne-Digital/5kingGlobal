import connectToDatabase from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import { contactMessageSchema } from '@/lib/validations/contactMessage';
import { jsonError, jsonOk, jsonServerError } from '@/lib/utils/api-response';
import { getClientIp, isRateLimited } from '@/lib/utils/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(`contact:${ip}`, 5, 10 * 60 * 1000)) {
      return jsonError('Too many requests. Please try again in a few minutes.', 429);
    }

    const body = await request.json();
    const parsed = contactMessageSchema.parse(body);

    if (parsed.website) {
      return jsonOk({ received: true }, 201);
    }

    await connectToDatabase();

    const message = await ContactMessage.create({
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone || undefined,
      subject: parsed.subject,
      message: parsed.message,
      status: 'unread',
    });

    return jsonOk({ id: message._id.toString() }, 201);
  } catch (error) {
    return jsonServerError(error, 'Unable to send message');
  }
}
