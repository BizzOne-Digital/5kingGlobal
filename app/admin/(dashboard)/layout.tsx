import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/current-user';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata = {
  robots: { index: false, follow: false },
};

// Middleware already blocks unauthenticated access to /admin/*, but we
// re-check here so the layout always has a concrete user to render and
// never assumes middleware ran (e.g. future config changes).
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  return (
    <AdminShell name={user.name} role={user.role}>
      {children}
    </AdminShell>
  );
}
