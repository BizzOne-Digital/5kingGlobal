import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Crown } from 'lucide-react';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Staff Login | 5Kings Global',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-md rounded-md bg-white p-10 shadow-premium">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-gold-gradient">
            <Crown className="h-6 w-6 text-navy-950" />
          </span>
          <h1 className="mt-5 font-display text-2xl text-navy-950">5Kings Global</h1>
          <p className="mt-1 text-sm text-navy-500">Staff &amp; Admin Sign In</p>
        </div>
        <div className="mt-8">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
