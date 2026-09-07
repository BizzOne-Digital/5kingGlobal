import Link from 'next/link';
import {
  Wrench,
  Package,
  CalendarCheck,
  Clock,
  Mail,
  MailWarning,
  Newspaper,
  Image as ImageIcon,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils/format';
import { getDashboardStats } from '@/lib/data/admin-dashboard';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: 'Total Services', value: stats.totalServices, icon: Wrench, href: '/admin/services' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, href: '/admin/products' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck, href: '/admin/bookings' },
    { label: 'Pending Bookings', value: stats.pendingBookings, icon: Clock, href: '/admin/bookings?status=pending' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: MailWarning, href: '/admin/messages?status=unread' },
    { label: 'Total Messages', value: stats.totalMessages, icon: Mail, href: '/admin/messages' },
    { label: 'Blog Posts', value: `${stats.publishedBlogPosts}/${stats.totalBlogPosts}`, icon: Newspaper, href: '/admin/blog' },
    { label: 'Media Files', value: stats.totalMedia, icon: ImageIcon, href: '/admin/media' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-navy-950">Dashboard</h1>
      <p className="mt-1 text-sm text-navy-500">Live overview of your site content and activity.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-shadow hover:shadow-premium">
              <CardBody className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-500">{card.label}</p>
                  <p className="mt-1 font-display text-3xl text-navy-950">{card.value}</p>
                </div>
                <card.icon className="h-8 w-8 text-navy-300" strokeWidth={1.5} />
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg text-navy-950">Recent Bookings</h2>
              <Link href="/admin/bookings" className="text-sm font-medium text-navy-700 hover:text-gold-600">
                View all
              </Link>
            </div>
            {stats.recentBookings.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No bookings yet" />
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-navy-900/5">
                {stats.recentBookings.map((booking) => (
                  <li key={booking._id.toString()} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-navy-950">{booking.name}</p>
                      <p className="text-xs text-navy-500">{booking.service} · {formatDate(booking.createdAt)}</p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg text-navy-950">Recent Messages</h2>
              <Link href="/admin/messages" className="text-sm font-medium text-navy-700 hover:text-gold-600">
                View all
              </Link>
            </div>
            {stats.recentMessages.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No messages yet" />
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-navy-900/5">
                {stats.recentMessages.map((message) => (
                  <li key={message._id.toString()} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-navy-950">{message.name}</p>
                      <p className="text-xs text-navy-500">{message.subject} · {formatDate(message.createdAt)}</p>
                    </div>
                    <StatusBadge status={message.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
