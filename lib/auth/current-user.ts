import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, verifySessionToken, type SessionPayload } from './session';

/**
 * Reads and verifies the session cookie for use in Server Components,
 * Route Handlers, and Server Actions. Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdmin(): Promise<SessionPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHENTICATED');
  }
  return user;
}
