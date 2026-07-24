import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth';
import Sidebar from '@/components/admin/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Middleware already guarantees a valid session for every route under this
  // layout — this just decodes the username to display it in the sidebar.
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  const payload = token ? await verifyAdminToken(token).catch(() => null) : null;

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      <Sidebar username={payload?.username || 'Admin'} />
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">{children}</main>
    </div>
  );
}
