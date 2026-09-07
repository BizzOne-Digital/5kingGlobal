import mongoose from 'mongoose';

/**
 * Validates a string as a MongoDB ObjectId before it ever reaches a query.
 * Always call this on any id coming from a route param or request body —
 * passing an unvalidated value straight into a Mongoose query is how you
 * end up vulnerable to NoSQL injection / cast-error crashes.
 */
export function isValidObjectId(id: unknown): id is string {
  return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);
}

export function toObjectId(id: string): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(id);
}
