import Link from 'next/link';
import { initDB, initAdminDB, initWorkshopDB } from '@/lib/db';
import { getRegistrationStats } from '@/lib/admin-queries';
import { getWorkshopOverallStats } from '@/lib/workshop-queries';
import StatCard from '@/components/admin/StatCard';

export default async function AdminDashboardPage() {
  await initDB();
  await initAdminDB();
  await initWorkshopDB();
  const [stats, workshopStats] = await Promise.all([
    getRegistrationStats(),
    getWorkshopOverallStats(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3">Overview</p>
        <h1 className="font-syne font-black text-3xl md:text-4xl text-ink">Dashboard</h1>
      </div>

      {/* ── Division 1: Internships ─────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne font-bold text-lg text-ink">Internships</h2>
          <Link href="/admin/registrations" className="font-mono text-[10px] tracking-widest uppercase text-ink-3 hover:text-ink">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Total Registrations" value={stats.total} />
          <StatCard label="Today" value={stats.today} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard label="Approved" value={stats.approved} />
          <StatCard label="Rejected" value={stats.rejected} />
        </div>
      </section>

      {/* ── Division 2: Workshops ───────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne font-bold text-lg text-ink">Workshops</h2>
          <Link href="/admin/workshops" className="font-mono text-[10px] tracking-widest uppercase text-ink-3 hover:text-ink">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Events" value={workshopStats.totalWorkshops} />
          <StatCard label="Upcoming" value={workshopStats.upcoming} />
          <StatCard label="Total Registrations" value={workshopStats.totalRegistrations} />
          <StatCard label="Pending Approval" value={workshopStats.pendingApprovals} />
          <StatCard label="Today" value={workshopStats.today} />
          <StatCard label="Checked In" value={workshopStats.checkedIn} />
        </div>
      </section>
    </div>
  );
}
