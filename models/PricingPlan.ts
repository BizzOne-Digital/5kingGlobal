import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type BillingType = 'one-time' | 'monthly' | 'yearly' | 'quote';

export interface IPricingPlan extends Document {
  name: string;
  description: string;
  price?: number;
  billingType: BillingType;
  features: string[];
  ctaText: string;
  ctaUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const PricingPlanSchema = new Schema<IPricingPlan>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, min: 0 },
    billingType: {
      type: String,
      enum: ['one-time', 'monthly', 'yearly', 'quote'],
      default: 'quote',
    },
    features: { type: [String], default: [] },
    ctaText: { type: String, default: 'Request a Quote' },
    ctaUrl: { type: String, default: '/booking' },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PricingPlanSchema.index({ isActive: 1, sortOrder: 1 });

const PricingPlan: Model<IPricingPlan> =
  mongoose.models.PricingPlan || mongoose.model<IPricingPlan>('PricingPlan', PricingPlanSchema);

export default PricingPlan;
