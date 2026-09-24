import { initWorkshopInterestDB } from '@/lib/db';
import { getWorkshopInterestList, getInterestStats } from '@/lib/workshop-interest-queries';
import InterestSearchFilterBar from '@/components/admin/InterestSearchFilterBar';
import InterestTable from '@/components/admin/InterestTable';
import RefreshButton from '@/components/admin/RefreshButton';
import StatCard from '@/components/admin/StatCard';
import type { WorkshopInterest } from '@/lib/workshop-interest-types';

export default async function AdminInterestPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  await initWorkshopInterestDB();

  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const pageSize = 20;
  const search = searchParams.search || '';
  const college = searchParams.college || 'all';
  const sortBy = searchParams.sortBy || 'submitted_at';
  const sortDir = searchParams.sortDir === 'asc' ? 'asc' : 'desc';

  const [{ rows, total }, stats] = await Promise.all([
    getWorkshopInterestList({ page, pageSize, search, college, sortBy, sortDir }),
    getInterestStats(college),
  ]);

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3">Interest</p>
          <h1 className="font-syne font-black text-3xl md:text-4xl text-ink">Workshop Interest</h1>
        </div>
        <RefreshButton />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Responses" value={stats.total} />
        <StatCard label="Interested" value={stats.interestedCount} />
        <StatCard label="Not Interested" value={stats.notInterestedCount} />
        <StatCard label="NCERC" value={stats.ncerc} />
        <StatCard label="JCET" value={stats.jcet} />
        <StatCard label="Other" value={stats.other} />
      </div>

      <InterestSearchFilterBar />
      <InterestTable rows={rows as unknown as WorkshopInterest[]} total={total} page={page} pageSize={pageSize} />
    </div>
  );
}
