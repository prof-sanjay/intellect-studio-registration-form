import { initDB, initAdminDB } from '@/lib/db';
import { getRegistrationStats } from '@/lib/admin-queries';
import StatCard from '@/components/admin/StatCard';

export default async function AdminDashboardPage() {
  await initDB();
  await initAdminDB();
  const stats = await getRegistrationStats();

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3">Overview</p>
        <h1 className="font-syne font-black text-3xl md:text-4xl text-ink">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total Registrations" value={stats.total} />
        <StatCard label="Today" value={stats.today} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Approved" value={stats.approved} />
        <StatCard label="Rejected" value={stats.rejected} />
      </div>
    </div>
  );
}
