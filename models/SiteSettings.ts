import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
}

export interface IBusinessHours {
  day: string;
  hours: string;
}

export interface ISiteSettings extends Document {
  businessName: string;
  phone: string;
  email: string;
  logo?: string;
  favicon?: string;
  socialLinks: ISocialLinks;
  address?: string;
  serviceAreas: string[];
  businessHours: IBusinessHours[];
  footerText?: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  primaryColor: string;
  secondaryColor: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    businessName: { type: String, required: true, default: '5Kings Global' },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    logo: { type: String },
    favicon: { type: String },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      youtube: { type: String },
    },
    address: { type: String },
    serviceAreas: { type: [String], default: [] },
    businessHours: [
      {
        day: { type: String },
        hours: { type: String },
      },
    ],
    footerText: { type: String },
    defaultSeoTitle: { type: String, required: true },
    defaultSeoDescription: { type: String, required: true },
    primaryColor: { type: String, default: '#0a1730' },
    secondaryColor: { type: String, default: '#c19620' },
  },
  { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
