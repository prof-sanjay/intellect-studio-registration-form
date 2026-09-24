'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { formatDateShort } from '@/lib/utils';
import type { WorkshopInterest } from '@/lib/workshop-interest-types';

const COLUMNS: { key: string; label: string; sortable: boolean }[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'roll_number', label: 'Roll Number', sortable: true },
  { key: 'college', label: 'College', sortable: true },
  { key: 'submitted_at', label: 'Submitted At', sortable: true },
];

export default function InterestTable({
  rows,
  total,
  page,
  pageSize,
}: {
  rows: WorkshopInterest[];
  total: number;
  page: number;
  pageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pendingId, setPendingId] = useState<number | null>(null);

  const sortBy = searchParams.get('sortBy') || 'submitted_at';
  const sortDir = searchParams.get('sortDir') || 'desc';
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pushParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => params.set(k, v));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSort = (col: string) => {
    const nextDir = sortBy === col && sortDir === 'asc' ? 'desc' : 'asc';
    pushParams({ sortBy: col, sortDir: nextDir });
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete the interest response from ${name}? This cannot be undone.`)) return;
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/interest/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || 'Delete failed.');
        return;
      }
      toast.success('Response deleted.');
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
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`text-left px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-ink-3 whitespace-nowrap ${
                    col.sortable ? 'cursor-pointer hover:text-ink' : ''
                  }`}
                >
                  {col.label}
                  {sortBy === col.key && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                </th>
              ))}
              <th className="text-left px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-ink-3">Interested</th>
              <th className="text-left px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-ink-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length + 2} className="px-4 py-10 text-center text-ink-3 text-sm">
                  No responses found.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-bg/60">
                <td className="px-4 py-3 whitespace-nowrap font-semibold text-ink">{row.name}</td>
                <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-ink-2">{row.roll_number}</td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-2">
                  {row.college === 'Other' && row.other_college ? `Other (${row.other_college})` : row.college}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-2">{formatDateShort(row.submitted_at)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={row.interested ? 'text-success' : 'text-ink-3'}>
                    {row.interested ? '✓ Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    disabled={pendingId === row.id}
                    onClick={() => handleDelete(row.id, row.name)}
                    className="text-[11px] font-mono uppercase tracking-wide text-error hover:underline disabled:opacity-30"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3">
          Page {page} of {totalPages} · {total} total
        </p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => pushParams({ page: String(page - 1) })}
            className="btn-secondary text-xs px-4 py-2 disabled:opacity-30"
          >
            ← Prev
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => pushParams({ page: String(page + 1) })}
            className="btn-secondary text-xs px-4 py-2 disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
