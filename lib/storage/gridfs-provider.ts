import mongoose from 'mongoose';
import { Readable } from 'stream';
import connectToDatabase from '../db';
import type { StorageProvider, UploadInput, UploadResult } from './types';

export const GRIDFS_BUCKET_NAME = 'media';

async function getBucket() {
  await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('MongoDB connection is not ready — cannot access GridFS.');
  }
  return new mongoose.mongo.GridFSBucket(db, { bucketName: GRIDFS_BUCKET_NAME });
}

/**
 * Stores every uploaded file directly inside MongoDB using GridFS — the
 * database's own mechanism for storing files larger than the 16MB document
 * limit, chunked across a `<bucket>.files` / `<bucket>.chunks` collection
 * pair in the same database as everything else.
 *
 * This is the ONLY media storage mechanism this project uses. No external
 * service (Cloudinary, S3, or anything else) and no reliance on the local
 * filesystem — which matters because Vercel's production filesystem is
 * read-only and ephemeral, so anything written to disk there disappears
 * between requests. GridFS sidesteps that entirely: uploads, deletes, and
 * reads all go through the same `MONGODB_URI` connection the rest of the
 * app already uses, so there's nothing extra to configure or provision,
 * in development or in production.
 *
 * Files are served back out through app/api/media/file/[id]/route.ts.
 */
export class GridFSStorageProvider implements StorageProvider {
  readonly name = 'mongodb';

  async upload({ buffer, filename, mimeType, folder = 'general' }: UploadInput): Promise<UploadResult> {
    const bucket = await getBucket();
    const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, '-').slice(0, 100) || 'file';

    return new Promise((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(safeFilename, {
        contentType: mimeType,
        metadata: { folder, originalFilename: filename },
      });

      Readable.from(buffer)
        .pipe(uploadStream)
        .on('error', reject)
        .on('finish', () => {
          const id = uploadStream.id.toString();
          resolve({
            url: `/api/media/file/${id}`,
            publicId: id,
            provider: this.name,
          });
        });
    });
  }

  async delete(publicId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(publicId)) return;
    const bucket = await getBucket();
    try {
      await bucket.delete(new mongoose.Types.ObjectId(publicId));
    } catch (error) {
      // Already gone — treat as success, matching the other providers'
      // delete semantics (a dangling DB reference shouldn't block the
      // admin from clearing it just because the file was removed already).
      const message = error instanceof Error ? error.message : String(error);
      if (/file not found/i.test(message)) return;
      throw error;
    }
  }
}
