import { mkdir, writeFile, unlink } from 'fs/promises';
import path from 'path';
import type { StorageProvider, UploadInput, UploadResult } from './types';

/**
 * Development-friendly default provider: writes files to /public/uploads.
 *
 * NOTE: this is NOT suitable for most production/serverless deployments
 * (the filesystem is ephemeral and not shared across instances). Swap
 * MEDIA_STORAGE_PROVIDER to "cloudinary" or "s3" for production use —
 * no application code beyond lib/storage/index.ts needs to change.
 */
export class LocalStorageProvider implements StorageProvider {
  readonly name = 'local';

  private get uploadsRoot() {
    return path.join(process.cwd(), 'public', 'uploads');
  }

  async upload({ buffer, filename, folder = 'general' }: UploadInput): Promise<UploadResult> {
    const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '');
    const dir = path.join(this.uploadsRoot, safeFolder);
    await mkdir(dir, { recursive: true });

    const ext = path.extname(filename);
    const base = path
      .basename(filename, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 60);
    const unique = `${base}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;

    await writeFile(path.join(dir, unique), buffer);

    const publicId = path.posix.join(safeFolder, unique);
    return {
      url: `/uploads/${publicId}`,
      publicId,
      provider: this.name,
    };
  }

  async delete(publicId: string): Promise<void> {
    try {
      await unlink(path.join(this.uploadsRoot, publicId));
    } catch {
      // Already gone — treat as success.
    }
  }
}
