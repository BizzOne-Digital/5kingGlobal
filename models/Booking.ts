import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type BookingStatus = 'pending' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
export type CustomerType = 'residential' | 'commercial' | 'professional';

export interface IBooking extends Document {
  name: string;
  email: string;
  phone: string;
  customerType: CustomerType;
  service: string;
  preferredDate?: Date;
  preferredTime?: string;
  message?: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    customerType: {
      type: String,
      enum: ['residential', 'commercial', 'professional'],
      required: true,
    },
    service: { type: String, required: true, trim: true },
    preferredDate: { type: Date },
    preferredTime: { type: String },
    message: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

BookingSchema.index({ status: 1 });
BookingSchema.index({ createdAt: -1 });
BookingSchema.index({ email: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
