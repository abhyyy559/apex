import { redirect } from 'next/navigation';
import { protectAdminRoute } from '@/lib/auth';
import { getAdminDashboardData } from '@/app/actions/contacts';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Protect the route using secure cookie/session auth
  const auth = await protectAdminRoute();

  if (!auth.authorized) {
    redirect(auth.redirect || '/admin/login');
  }

  // Fetch dashboard data server-side for better performance and scalability
  const result = await getAdminDashboardData();

  if (!result.success || !result.data) {
    console.error('Error fetching admin dashboard data:', result.error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-deep px-4">
        <div className="max-w-xl w-full rounded-3xl bg-bg-elevated border border-white/10 p-10 text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">Admin Dashboard</h1>
          <p className="text-text-muted mb-6">
            There was a problem loading contact submissions. Please check the server logs or your Supabase configuration.
          </p>
          <p className="text-sm text-text-muted">{result.error || 'Unknown error occurred.'}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard
      initialSubmissions={result.data.submissions}
      initialNextCursor={result.data.pagination?.nextCursor || null}
      initialHasMore={result.data.pagination?.hasMore || false}
      stats={result.data.stats}
    />
  );
}
