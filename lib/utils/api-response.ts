import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function jsonOk<T>(data: T, init?: number | ResponseInit) {
  return NextResponse.json({ success: true, data }, typeof init === 'number' ? { status: init } : init);
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: message, details }, { status });
}

export function jsonUnauthorized(message = 'Unauthorized') {
  return jsonError(message, 401);
}

export function jsonNotFound(message = 'Not found') {
  return jsonError(message, 404);
}

/**
 * Central place to turn a caught error into a safe API response.
 * Never leaks stack traces, connection strings, or internal details.
 */
export function jsonServerError(error: unknown, fallbackMessage = 'Something went wrong') {
  if (error instanceof ZodError) {
    return jsonError('Validation failed', 422, error.flatten());
  }
  if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
    return jsonUnauthorized();
  }
  // Duplicate key error from MongoDB (unique index violation)
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: number }).code === 11000
  ) {
    return jsonError('A record with these details already exists', 409);
  }
  // eslint-disable-next-line no-console
  console.error(error);
  return jsonError(fallbackMessage, 500);
}
