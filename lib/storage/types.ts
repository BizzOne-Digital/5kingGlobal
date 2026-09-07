export interface UploadInput {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  folder?: string;
}

export interface UploadResult {
  url: string;
  publicId?: string;
  provider: string;
}

export interface StorageProvider {
  /** Human readable identifier stored on the Media document, e.g. "local" | "cloudinary" | "s3" */
  readonly name: string;
  upload(input: UploadInput): Promise<UploadResult>;
  delete(publicId: string): Promise<void>;
}
