import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-deep">
      <div className="max-w-md w-full mx-4">
        <div className="bg-bg-elevated border border-white/10 rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-text-muted mb-6">
            You don&apos;t have permission to access the admin dashboard.
          </p>
          <div className="space-y-3">
            <Link
              href="/admin/login"
              className="block w-full py-3 px-4 bg-accent text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-center"
            >
              Try Login Again
            </Link>
            <Link
              href="/"
              className="block w-full py-3 px-4 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors text-center"
            >
              Back to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
