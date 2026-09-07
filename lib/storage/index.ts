import type { StorageProvider } from './types';
import { GridFSStorageProvider } from './gridfs-provider';

let cachedProvider: StorageProvider | null = null;

/**
 * Returns the active media storage provider. This project stores all media
 * (images, graphics, and directly-uploaded videos) in MongoDB itself via
 * GridFS — there is intentionally no external storage service (Cloudinary,
 * S3, etc.) and no reliance on the local filesystem, since that would break
 * on Vercel's read-only, ephemeral production filesystem.
 *
 * Kept as a function (rather than a plain export) so a future provider
 * could be added here without touching any calling code — but for now,
 * GridFS is the only implementation, deliberately.
 */
export function getStorageProvider(): StorageProvider {
  if (!cachedProvider) {
    cachedProvider = new GridFSStorageProvider();
  }
  return cachedProvider;
}

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const ALLOWED_UPLOAD_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

export type { StorageProvider, UploadInput, UploadResult } from './types';
