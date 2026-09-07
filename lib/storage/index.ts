import type { StorageProvider } from './types';
import { LocalStorageProvider } from './local-provider';

let cachedProvider: StorageProvider | null = null;

/**
 * Returns the active media storage provider based on MEDIA_STORAGE_PROVIDER.
 * Adding a new provider only requires implementing StorageProvider and
 * registering it here — nothing else in the app needs to change.
 */
export function getStorageProvider(): StorageProvider {
  if (cachedProvider) return cachedProvider;

  const providerName = (process.env.MEDIA_STORAGE_PROVIDER || 'local').toLowerCase();

  switch (providerName) {
    case 'cloudinary': {
      // Lazy-require so projects that never configure Cloudinary don't pay
      // for it, and so a misconfigured env doesn't break unrelated routes.
      const { CloudinaryStorageProvider } = require('./cloudinary-provider');
      cachedProvider = new CloudinaryStorageProvider();
      break;
    }
    case 's3': {
      const { S3StorageProvider } = require('./s3-provider');
      cachedProvider = new S3StorageProvider();
      break;
    }
    case 'local':
    default:
      cachedProvider = new LocalStorageProvider();
      break;
  }

  return cachedProvider as StorageProvider;
}

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const ALLOWED_UPLOAD_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

export type { StorageProvider, UploadInput, UploadResult } from './types';
