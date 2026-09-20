'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { formatDateShort } from '@/lib/utils';
import type { WorkshopFeedbackWithEvent } from '@/lib/workshop-feedback-types';

const COLUMNS: { key: string; label: string; sortable: boolean }[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'register_number', label: 'Register Number', sortable: true },
  { key: 'overall_rating', label: 'Overall Rating', sortable: true },
  { key: 'trainer_rating', label: 'Trainer Rating', sortable: true },
  { key: 'recommendation', label: 'Recommendation', sortable: false },
  { key: 'submitted_at', label: 'Submitted At', sortable: true },
];

export default function FeedbackTable({
  rows,
  total,
  page,
  pageSize,
  showWorkshopColumn,
}: {
  rows: WorkshopFeedbackWithEvent[];
  total: number;
  page: number;
  pageSize: number;
  showWorkshopColumn: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const colSpan = COLUMNS.length + (showWorkshopColumn ? 1 : 0);

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {showWorkshopColumn && (
                <th className="text-left px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-ink-3 whitespace-nowrap">
                  Workshop
                </th>
              )}
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
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={colSpan} className="px-4 py-10 text-center text-ink-3 text-sm">
                  No feedback responses found.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => router.push(`/admin/feedback/${row.id}`)}
                className="border-b border-border last:border-0 hover:bg-bg/60 cursor-pointer"
              >
                {showWorkshopColumn && (
                  <td className="px-4 py-3 whitespace-nowrap text-ink-2">{row.workshop_title}</td>
                )}
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link
                    href={`/admin/feedback/${row.id}`}
                    className="font-semibold text-ink hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {row.name}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-ink-2">{row.register_number}</td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-2">{row.overall_rating} / 5</td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-2">{row.trainer_rating} / 5</td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-2">{row.recommendation}</td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-2">{formatDateShort(row.submitted_at)}</td>
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
