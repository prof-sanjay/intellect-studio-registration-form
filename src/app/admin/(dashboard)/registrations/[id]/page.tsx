import Link from 'next/link';
import { notFound } from 'next/navigation';
import { initDB, initAdminDB, getDB, withRetry } from '@/lib/db';
import RegistrationDetail from '@/components/admin/RegistrationDetail';
import type { Registration } from '@/lib/admin-types';

export default async function AdminRegistrationDetailPage({ params }: { params: { id: string } }) {
  await initDB();
  await initAdminDB();

  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const sql = getDB();
  const rows = await withRetry(() => sql`SELECT * FROM interns WHERE id = ${id}`);
  if (rows.length === 0) notFound();

  const intern = rows[0] as unknown as Registration;

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/registrations" className="font-mono text-[10px] tracking-widest uppercase text-ink-3 hover:text-ink">
          ← Back to Registrations
        </Link>
        <h1 className="font-syne font-black text-3xl md:text-4xl text-ink mt-3">{intern.full_name}</h1>
      </div>

      <RegistrationDetail intern={intern} />
    </div>
  );
}
