import { initDB, initAdminDB } from '@/lib/db';
import { getRegistrationsList } from '@/lib/admin-queries';
import SearchFilterBar from '@/components/admin/SearchFilterBar';
import RegistrationsTable from '@/components/admin/RegistrationsTable';
import RefreshButton from '@/components/admin/RefreshButton';

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  await initDB();
  await initAdminDB();

  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const pageSize = 20;
  const search = searchParams.search || '';
  const status = searchParams.status || 'all';
  const sortBy = searchParams.sortBy || 'created_at';
  const sortDir = searchParams.sortDir === 'asc' ? 'asc' : 'desc';

  const { rows, total } = await getRegistrationsList({ page, pageSize, search, status, sortBy, sortDir });

  const exportParams = new URLSearchParams();
  if (search) exportParams.set('search', search);
  if (status !== 'all') exportParams.set('status', status);

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3">Manage</p>
          <h1 className="font-syne font-black text-3xl md:text-4xl text-ink">Registrations</h1>
        </div>
        <div className="flex gap-3">
          <RefreshButton />
          <a
            href={`/api/admin/registrations/export?format=csv&${exportParams.toString()}`}
            className="btn-secondary text-xs px-4 py-2.5"
          >
            Export CSV
          </a>
          <a
            href={`/api/admin/registrations/export?format=xlsx&${exportParams.toString()}`}
            className="btn-secondary text-xs px-4 py-2.5"
          >
            Export Excel
          </a>
        </div>
      </div>

      <SearchFilterBar />
      <RegistrationsTable rows={rows as any} total={total} page={page} pageSize={pageSize} />
    </div>
  );
}
