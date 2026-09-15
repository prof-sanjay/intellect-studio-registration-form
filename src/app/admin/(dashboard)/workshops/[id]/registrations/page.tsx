import Link from 'next/link';
import { notFound } from 'next/navigation';
import { initWorkshopDB } from '@/lib/db';
import { getWorkshopById, getWorkshopRegistrationsList, getWorkshopRegistrationStats } from '@/lib/workshop-queries';
import WorkshopRegSearchFilterBar from '@/components/admin/WorkshopRegSearchFilterBar';
import WorkshopRegistrationsTable from '@/components/admin/WorkshopRegistrationsTable';
import RefreshButton from '@/components/admin/RefreshButton';
import StatCard from '@/components/admin/StatCard';
import { formatDate } from '@/lib/utils';
import type { Workshop, WorkshopRegistration } from '@/lib/workshop-types';

export default async function WorkshopRegistrationsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}) {
  await initWorkshopDB();

  const workshopId = parseInt(params.id, 10);
  if (isNaN(workshopId)) notFound();

  const workshop = (await getWorkshopById(workshopId)) as unknown as Workshop | null;
  if (!workshop) notFound();

  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const pageSize = 20;
  const search = searchParams.search || '';
  const status = searchParams.status || 'all';
  const sortBy = searchParams.sortBy || 'created_at';
  const sortDir = searchParams.sortDir === 'asc' ? 'asc' : 'desc';

  const [{ rows, total }, stats] = await Promise.all([
    getWorkshopRegistrationsList(workshopId, { page, pageSize, search, status, sortBy, sortDir }),
    getWorkshopRegistrationStats(workshopId),
  ]);

  const exportParams = new URLSearchParams();
  if (search) exportParams.set('search', search);
  if (status !== 'all') exportParams.set('status', status);

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/workshops" className="font-mono text-[10px] tracking-widest uppercase text-ink-3 hover:text-ink">
          ← Back to Workshops
        </Link>
        <div className="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-syne font-black text-3xl md:text-4xl text-ink">{workshop.title}</h1>
            <p className="mt-1 text-sm text-ink-2 font-sans">
              {formatDate(workshop.event_date)} · {workshop.venue}
            </p>
          </div>
          <div className="flex gap-3">
            <RefreshButton />
            <a
              href={`/api/admin/workshops/${workshopId}/registrations/export?${exportParams.toString()}`}
              className="btn-secondary text-xs px-4 py-2.5"
            >
              Export CSV
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Today" value={stats.today} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Approved" value={stats.approved} />
        <StatCard label="Rejected" value={stats.rejected} />
        <StatCard label="Checked In" value={stats.checkedIn} />
      </div>

      <WorkshopRegSearchFilterBar />
      <WorkshopRegistrationsTable
        workshopId={workshopId}
        rows={rows as unknown as WorkshopRegistration[]}
        total={total}
        page={page}
        pageSize={pageSize}
      />
    </div>
  );
}
