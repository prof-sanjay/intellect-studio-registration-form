import Link from 'next/link';
import { notFound } from 'next/navigation';
import { initWorkshopDB } from '@/lib/db';
import { getWorkshopRegistrationById } from '@/lib/workshop-queries';
import WorkshopRegistrationDetail from '@/components/admin/WorkshopRegistrationDetail';
import type { WorkshopRegistration } from '@/lib/workshop-types';

export default async function WorkshopRegistrationDetailPage({
  params,
}: {
  params: { id: string; regId: string };
}) {
  await initWorkshopDB();

  const workshopId = parseInt(params.id, 10);
  const regId = parseInt(params.regId, 10);
  if (isNaN(workshopId) || isNaN(regId)) notFound();

  const registration = (await getWorkshopRegistrationById(regId)) as unknown as WorkshopRegistration | null;
  if (!registration || registration.workshop_id !== workshopId) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/admin/workshops/${workshopId}/registrations`}
          className="font-mono text-[10px] tracking-widest uppercase text-ink-3 hover:text-ink"
        >
          ← Back to Registrations
        </Link>
        <h1 className="font-syne font-black text-3xl md:text-4xl text-ink mt-3">{registration.full_name}</h1>
      </div>

      <WorkshopRegistrationDetail workshopId={workshopId} registration={registration} />
    </div>
  );
}
