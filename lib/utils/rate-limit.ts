/**
 * Minimal in-memory rate limiter for public form endpoints (booking, contact).
 *
 * This is a best-effort defense against basic spam/bot abuse, not a
 * substitute for a real distributed rate limiter — in a multi-instance
 * serverless deployment each instance keeps its own counters. For high-traffic
 * production use, swap this for a shared store (e.g. Redis/Upstash).
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (bucket.count >= limit) {
    return true;
  }

  bucket.count += 1;
  return false;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
