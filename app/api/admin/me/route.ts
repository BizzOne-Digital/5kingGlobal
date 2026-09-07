import { getCurrentUser } from '@/lib/auth/current-user';
import { jsonOk, jsonServerError, jsonUnauthorized } from '@/lib/utils/api-response';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return jsonUnauthorized();
    return jsonOk({ name: user.name, email: user.email, role: user.role });
  } catch (error) {
    return jsonServerError(error, 'Unable to load session');
  }
}
