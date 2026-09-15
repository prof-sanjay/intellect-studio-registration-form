'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import type { WorkshopWithCounts } from '@/lib/workshop-types';
import StatusBadge from './StatusBadge';

export default function WorkshopsTable({ rows }: { rows: WorkshopWithCounts[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<number | null>(null);

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Delete "${title}" and all of its registrations? This cannot be undone.`)) return;
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/workshops/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || 'Delete failed.');
        return;
      }
      toast.success('Workshop deleted.');
      router.refresh();
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['Title', 'Date', 'Venue', 'Registrations', 'Status'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-ink-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
              <th className="text-left px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-ink-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-3 text-sm">
                  No workshops yet. Create your first one.
                </td>
              </tr>
            )}
            {rows.map((w) => (
              <tr key={w.id} className="border-b border-border last:border-0 hover:bg-bg/60">
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link href={`/admin/workshops/${w.id}/registrations`} className="font-semibold text-ink hover:underline">
                    {w.title}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-2">{formatDate(w.event_date)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-2">{w.venue}</td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-2">
                  {w.registration_count}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={w.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/workshops/${w.id}/registrations`}
                      className="text-[11px] font-mono uppercase tracking-wide text-ink-2 hover:text-ink hover:underline"
                    >
                      Registrations
                    </Link>
                    <Link
                      href={`/admin/workshops/${w.id}/edit`}
                      className="text-[11px] font-mono uppercase tracking-wide text-ink-2 hover:text-ink hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      disabled={pendingId === w.id}
                      onClick={() => handleDelete(w.id, w.title)}
                      className="text-[11px] font-mono uppercase tracking-wide text-error hover:underline disabled:opacity-30"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
