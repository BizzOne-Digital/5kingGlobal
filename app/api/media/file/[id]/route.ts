import { Readable } from 'stream';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import { GRIDFS_BUCKET_NAME } from '@/lib/storage/gridfs-provider';
import { isValidObjectId } from '@/lib/utils/objectId';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

/**
 * Public, unauthenticated route that streams a file's bytes straight out of
 * MongoDB GridFS. This is the `url` stored on every Media document that
 * doesn't point at an external video — <img>/<video> tags across the site
 * hit this route directly, the same way they'd hit a CDN URL.
 *
 * Supports HTTP Range requests so video playback can seek, and sends
 * long-lived immutable cache headers since a GridFS file's bytes never
 * change after upload — "replacing" an image always uploads a new file
 * with a new id rather than overwriting one in place.
 */
export async function GET(request: Request, { params }: Params) {
  const { id } = await params;

  if (!isValidObjectId(id)) {
    return new Response('Not found', { status: 404 });
  }

  await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) {
    return new Response('Database unavailable', { status: 503 });
  }

  const fileId = new mongoose.Types.ObjectId(id);
  const filesCollection = db.collection(`${GRIDFS_BUCKET_NAME}.files`);
  const file = await filesCollection.findOne({ _id: fileId });

  if (!file) {
    return new Response('Not found', { status: 404 });
  }

  const totalSize: number = file.length;
  const contentType: string = file.contentType || 'application/octet-stream';
  const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: GRIDFS_BUCKET_NAME });

  const headers = new Headers({
    'Content-Type': contentType,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=31536000, immutable',
    ETag: `"${id}"`,
  });

  const rangeHeader = request.headers.get('range');

  if (rangeHeader) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
    if (!match) {
      headers.set('Content-Range', `bytes */${totalSize}`);
      return new Response('Invalid range', { status: 416, headers });
    }

    const [, startStr, endStr] = match;
    let start = startStr ? parseInt(startStr, 10) : 0;
    let endInclusive = endStr ? parseInt(endStr, 10) : totalSize - 1;

    if (!startStr && endStr) {
      // Suffix range like "bytes=-500" — last 500 bytes.
      const suffixLength = parseInt(endStr, 10);
      start = Math.max(totalSize - suffixLength, 0);
      endInclusive = totalSize - 1;
    }

    if (start >= totalSize || endInclusive >= totalSize || start > endInclusive) {
      headers.set('Content-Range', `bytes */${totalSize}`);
      return new Response('Range not satisfiable', { status: 416, headers });
    }

    const chunkSize = endInclusive - start + 1;
    headers.set('Content-Range', `bytes ${start}-${endInclusive}/${totalSize}`);
    headers.set('Content-Length', String(chunkSize));

    const downloadStream = bucket.openDownloadStream(fileId, { start, end: endInclusive + 1 });
    const webStream = Readable.toWeb(downloadStream) as ReadableStream;

    return new Response(webStream, { status: 206, headers });
  }

  headers.set('Content-Length', String(totalSize));
  const downloadStream = bucket.openDownloadStream(fileId);
  const webStream = Readable.toWeb(downloadStream) as ReadableStream;

  return new Response(webStream, { status: 200, headers });
}
