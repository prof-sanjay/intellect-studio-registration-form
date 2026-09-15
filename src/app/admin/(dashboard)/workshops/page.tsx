import Link from 'next/link';
import { initWorkshopDB } from '@/lib/db';
import { getAllWorkshopsAdmin } from '@/lib/workshop-queries';
import WorkshopsTable from '@/components/admin/WorkshopsTable';
import type { WorkshopWithCounts } from '@/lib/workshop-types';

export default async function AdminWorkshopsPage() {
  await initWorkshopDB();
  const rows = (await getAllWorkshopsAdmin()) as unknown as WorkshopWithCounts[];

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3">Manage</p>
          <h1 className="font-syne font-black text-3xl md:text-4xl text-ink">Workshops</h1>
        </div>
        <Link href="/admin/workshops/new" className="btn-primary text-xs px-5 py-2.5">
          + New Workshop
        </Link>
      </div>

      <WorkshopsTable rows={rows} />
    </div>
  );
}
