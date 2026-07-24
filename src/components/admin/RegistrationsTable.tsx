'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { formatDateShort } from '@/lib/utils';
import StatusBadge from './StatusBadge';

interface Row {
  id: number;
  temp_emp_number: string;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  course: string;
  created_at: string;
  status: string;
}

const COLUMNS: { key: string; label: string; sortable: boolean }[] = [
  { key: 'temp_emp_number', label: 'Employee No.', sortable: true },
  { key: 'full_name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phone', label: 'Phone', sortable: false },
  { key: 'college', label: 'Institution', sortable: true },
  { key: 'course', label: 'Course', sortable: true },
  { key: 'created_at', label: 'Registered', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
];

export default function RegistrationsTable({
  rows,
  total,
  page,
  pageSize,
}: {
  rows: Row[];
  total: number;
  page: number;
  pageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pendingId, setPendingId] = useState<number | null>(null);

  const sortBy = searchParams.get('sortBy') || 'created_at';
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

  const handleStatusAction = async (id: number, status: 'approved' | 'rejected') => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || 'Update failed.');
        return;
      }
      toast.success(`Application ${status}.`);
      router.refresh();
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete the application for ${name}? This cannot be undone.`)) return;
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || 'Delete failed.');
        return;
      }
      toast.success('Application deleted.');
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
              <th className="text-left px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-ink-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="px-4 py-10 text-center text-ink-3 text-sm">
                  No registrations found.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-bg/60">
                <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-ink-2">{row.temp_emp_number}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link href={`/admin/registrations/${row.id}`} className="font-semibold text-ink hover:underline">
                    {row.full_name}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-2">{row.email}</td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-2">{row.phone}</td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-2">{row.college}</td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-2">{row.course}</td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-2">{formatDateShort(row.created_at)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      disabled={pendingId === row.id || row.status === 'approved'}
                      onClick={() => handleStatusAction(row.id, 'approved')}
                      className="text-[11px] font-mono uppercase tracking-wide text-success hover:underline disabled:opacity-30 disabled:no-underline"
                    >
                      Approve
                    </button>
                    <button
                      disabled={pendingId === row.id || row.status === 'rejected'}
                      onClick={() => handleStatusAction(row.id, 'rejected')}
                      className="text-[11px] font-mono uppercase tracking-wide text-error hover:underline disabled:opacity-30 disabled:no-underline"
                    >
                      Reject
                    </button>
                    <button
                      disabled={pendingId === row.id}
                      onClick={() => handleDelete(row.id, row.full_name)}
                      className="text-[11px] font-mono uppercase tracking-wide text-ink-3 hover:text-ink hover:underline disabled:opacity-30"
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
