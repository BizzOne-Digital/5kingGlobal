import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type MediaType = 'image' | 'video' | 'graphic' | 'document';

export interface IMedia extends Document {
  url: string;
  publicId?: string;
  filename: string;
  type: MediaType;
  mimeType: string;
  size: number;
  alt?: string;
  folder?: string;
  provider: string;
  externalSource?: 'youtube' | 'vimeo' | null;
  externalId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    filename: { type: String, required: true },
    type: { type: String, enum: ['image', 'video', 'graphic', 'document'], required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, default: 0 },
    alt: { type: String, default: '' },
    folder: { type: String, default: 'general' },
    provider: { type: String, default: 'mongodb' },
    externalSource: { type: String, enum: ['youtube', 'vimeo', null], default: null },
    externalId: { type: String },
  },
  { timestamps: true }
);

MediaSchema.index({ folder: 1 });
MediaSchema.index({ type: 1 });
MediaSchema.index({ createdAt: -1 });

const Media: Model<IMedia> = mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);

export default Media;
