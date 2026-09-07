import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { loginSchema } from '@/lib/validations/auth';
import { verifyPassword } from '@/lib/auth/password';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/auth/session';
import { jsonError, jsonOk, jsonServerError } from '@/lib/utils/api-response';
import { getClientIp, isRateLimited } from '@/lib/utils/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Slow down credential-stuffing / brute force attempts.
    if (isRateLimited(`login:${ip}`, 10, 15 * 60 * 1000)) {
      return jsonError('Too many login attempts. Please try again later.', 429);
    }

    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    await connectToDatabase();
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

    // Always compare against something to keep response timing similar
    // whether or not the account exists (basic user-enumeration mitigation).
    const passwordHash = user?.passwordHash ?? '$2a$12$invalidsaltinvalidsaltinvalidsaltinva';
    const validPassword = await verifyPassword(password, passwordHash);

    if (!user || !validPassword) {
      return jsonError('Invalid email or password', 401);
    }

    const token = await createSessionToken({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return jsonOk({ name: user.name, email: user.email, role: user.role });
  } catch (error) {
    return jsonServerError(error, 'Unable to sign in');
  }
}
