import Link from 'next/link';
import { notFound } from 'next/navigation';
import { initWorkshopDB } from '@/lib/db';
import { getWorkshopById } from '@/lib/workshop-queries';
import WorkshopForm from '@/components/admin/WorkshopForm';
import type { Workshop } from '@/lib/workshop-types';

export default async function EditWorkshopPage({ params }: { params: { id: string } }) {
  await initWorkshopDB();
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const workshop = (await getWorkshopById(id)) as unknown as Workshop | null;
  if (!workshop) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/workshops" className="font-mono text-[10px] tracking-widest uppercase text-ink-3 hover:text-ink">
          ← Back to Workshops
        </Link>
        <h1 className="font-syne font-black text-3xl md:text-4xl text-ink mt-3">Edit Workshop</h1>
      </div>

      <div className="max-w-3xl">
        <WorkshopForm workshop={workshop} />
      </div>
    </div>
  );
}
