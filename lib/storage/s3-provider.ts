import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { StorageProvider, UploadInput, UploadResult } from './types';

export class S3StorageProvider implements StorageProvider {
  readonly name = 's3';
  private client: S3Client;
  private bucket: string;

  constructor() {
    const bucket = process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_S3_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!bucket || !region || !accessKeyId || !secretAccessKey) {
      throw new Error(
        'S3 storage selected but AWS_S3_BUCKET / AWS_S3_REGION / AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY are missing.'
      );
    }

    this.bucket = bucket;
    this.client = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
  }

  async upload({ buffer, filename, mimeType, folder = 'general' }: UploadInput): Promise<UploadResult> {
    const ext = filename.includes('.') ? filename.split('.').pop() : '';
    const key = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e6)}${ext ? `.${ext}` : ''}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      })
    );

    const region = process.env.AWS_S3_REGION;
    return {
      url: `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`,
      publicId: key,
      provider: this.name,
    };
  }

  async delete(publicId: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: publicId }));
  }
}
