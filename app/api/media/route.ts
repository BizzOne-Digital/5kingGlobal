import { type NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import Media from '@/models/Media';
import { requireAdmin } from '@/lib/auth/current-user';
import { getStorageProvider, ALLOWED_UPLOAD_TYPES, ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from '@/lib/storage';
import { externalMediaSchema } from '@/lib/validations/media';
import { jsonError, jsonOk, jsonServerError } from '@/lib/utils/api-response';

// Media library is an admin-only concern end-to-end (list, upload, delete).
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const params = request.nextUrl.searchParams;
    const folder = params.get('folder') || undefined;
    const type = params.get('type') || undefined;
    const search = params.get('search') || undefined;

    const query: Record<string, unknown> = {};
    if (folder) query.folder = folder;
    if (type) query.type = type;
    if (search) {
      query.filename = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    }

    const media = await Media.find(query).sort({ createdAt: -1 }).limit(200).lean();
    return jsonOk(JSON.parse(JSON.stringify(media)));
  } catch (error) {
    return jsonServerError(error, 'Unable to load media');
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const contentType = request.headers.get('content-type') || '';

    // Registering an external video (YouTube/Vimeo) — no file bytes involved.
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const data = externalMediaSchema.parse(body);

      await connectToDatabase();
      const media = await Media.create({
        url:
          data.externalSource === 'youtube'
            ? `https://www.youtube.com/watch?v=${data.externalId}`
            : `https://vimeo.com/${data.externalId}`,
        filename: data.filename,
        type: 'video',
        mimeType: 'text/uri-list',
        size: 0,
        alt: data.alt || '',
        folder: data.folder || 'videos',
        provider: 'external',
        externalSource: data.externalSource,
        externalId: data.externalId,
      });

      return jsonOk(JSON.parse(JSON.stringify(media)), 201);
    }

    // Direct file upload (image, graphic, or MP4 video).
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = (formData.get('folder') as string) || 'general';
    const alt = (formData.get('alt') as string) || '';

    if (!(file instanceof File)) {
      return jsonError('No file provided', 400);
    }

    if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
      return jsonError('Unsupported file type', 415);
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return jsonError('File is too large (15MB max)', 413);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const provider = getStorageProvider();
    const result = await provider.upload({
      buffer,
      filename: file.name,
      mimeType: file.type,
      folder,
    });

    await connectToDatabase();
    const media = await Media.create({
      url: result.url,
      publicId: result.publicId,
      filename: file.name,
      type: ALLOWED_IMAGE_TYPES.includes(file.type) ? 'image' : 'video',
      mimeType: file.type,
      size: file.size,
      alt,
      folder,
      provider: result.provider,
    });

    return jsonOk(JSON.parse(JSON.stringify(media)), 201);
  } catch (error) {
    return jsonServerError(error, 'Unable to upload media');
  }
}
