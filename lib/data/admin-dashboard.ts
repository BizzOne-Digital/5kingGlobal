import 'server-only';
import connectToDatabase from '@/lib/db';
import Service from '@/models/Service';
import Product from '@/models/Product';
import Booking, { type IBooking } from '@/models/Booking';
import ContactMessage, { type IContactMessage } from '@/models/ContactMessage';
import BlogPost from '@/models/BlogPost';
import Media from '@/models/Media';

export interface DashboardStats {
  totalServices: number;
  totalProducts: number;
  totalBookings: number;
  pendingBookings: number;
  unreadMessages: number;
  totalMessages: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  totalMedia: number;
  recentBookings: IBooking[];
  recentMessages: IContactMessage[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await connectToDatabase();

  const [
    totalServices,
    totalProducts,
    totalBookings,
    pendingBookings,
    unreadMessages,
    totalMessages,
    totalBlogPosts,
    publishedBlogPosts,
    totalMedia,
    recentBookings,
    recentMessages,
  ] = await Promise.all([
    Service.countDocuments(),
    Product.countDocuments(),
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
    ContactMessage.countDocuments({ status: 'unread' }),
    ContactMessage.countDocuments(),
    BlogPost.countDocuments(),
    BlogPost.countDocuments({ status: 'published' }),
    Media.countDocuments(),
    Booking.find().sort({ createdAt: -1 }).limit(5).lean(),
    ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return JSON.parse(
    JSON.stringify({
      totalServices,
      totalProducts,
      totalBookings,
      pendingBookings,
      unreadMessages,
      totalMessages,
      totalBlogPosts,
      publishedBlogPosts,
      totalMedia,
      recentBookings,
      recentMessages,
    })
  );
}
