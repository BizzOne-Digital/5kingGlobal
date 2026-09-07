import connectToDatabase from '@/lib/db';
import Service from '@/models/Service';
import Product from '@/models/Product';
import Booking from '@/models/Booking';
import ContactMessage from '@/models/ContactMessage';
import BlogPost from '@/models/BlogPost';
import Media from '@/models/Media';
import { requireAdmin } from '@/lib/auth/current-user';
import { jsonOk, jsonServerError } from '@/lib/utils/api-response';

export async function GET() {
  try {
    await requireAdmin();
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
    ]);

    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5).lean();
    const recentMessages = await ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean();

    return jsonOk({
      totalServices,
      totalProducts,
      totalBookings,
      pendingBookings,
      unreadMessages,
      totalMessages,
      totalBlogPosts,
      publishedBlogPosts,
      totalMedia,
      recentBookings: JSON.parse(JSON.stringify(recentBookings)),
      recentMessages: JSON.parse(JSON.stringify(recentMessages)),
    });
  } catch (error) {
    return jsonServerError(error, 'Unable to load dashboard data');
  }
}
