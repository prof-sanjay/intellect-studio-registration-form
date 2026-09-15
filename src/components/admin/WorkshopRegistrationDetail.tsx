'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import type { WorkshopRegistration } from '@/lib/workshop-types';
import StatusBadge from './StatusBadge';
import EditWorkshopRegistrationForm from './EditWorkshopRegistrationForm';

const FIELDS: { key: keyof WorkshopRegistration; label: string }[] = [
  { key: 'pass_code', label: 'Student ID' },
  { key: 'full_name', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'year', label: 'Year' },
  { key: 'course', label: 'Course' },
  { key: 'department', label: 'Department' },
];

export default function WorkshopRegistrationDetail({
  workshopId,
  registration,
}: {
  workshopId: number;
  registration: WorkshopRegistration;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const patch = async (body: Record<string, any>, successMsg: string) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/workshop-registrations/${registration.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || 'Update failed.');
        return;
      }
      toast.success(successMsg);
      router.refresh();
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete the registration for ${registration.full_name}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/workshop-registrations/${registration.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || 'Delete failed.');
        return;
      }
      toast.success('Registration deleted.');
      router.push(`/admin/workshops/${workshopId}/registrations`);
      router.refresh();
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="card p-6 space-y-3">
          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-1">Status</p>
          <StatusBadge status={registration.status} />

          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mt-4 mb-1">Check-in</p>
          <p className="text-sm text-ink font-sans">
            {registration.checked_in_at ? `✓ ${formatDate(registration.checked_in_at)}` : 'Not checked in'}
          </p>

          <div className="flex flex-col gap-2 pt-4">
            <button
              disabled={busy}
              onClick={() => patch({ checked_in: !registration.checked_in_at }, registration.checked_in_at ? 'Check-in cleared.' : 'Checked in.')}
              className="btn-secondary text-xs disabled:opacity-30"
            >
              {registration.checked_in_at ? 'Clear Check-in' : 'Mark Checked In'}
            </button>
            <button
              disabled={busy || registration.status === 'approved'}
              onClick={() => patch({ status: 'approved' }, 'Registration approved.')}
              className="btn-secondary text-xs disabled:opacity-30"
            >
              Approve
            </button>
            <button
              disabled={busy || registration.status === 'rejected'}
              onClick={() => patch({ status: 'rejected' }, 'Registration rejected.')}
              className="btn-secondary text-xs disabled:opacity-30"
            >
              Reject
            </button>
            <button
              disabled={busy}
              onClick={handleDelete}
              className="text-xs font-mono uppercase tracking-wide text-error hover:underline pt-2 disabled:opacity-30"
            >
              Delete Registration
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3">Registration Details</p>
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn-secondary text-xs px-4 py-2">
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <EditWorkshopRegistrationForm registration={registration} onCancel={() => setEditing(false)} />
          ) : (
            <dl className="divide-y divide-border">
              {FIELDS.map((f) => (
                <div key={f.key} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3">
                  <dt className="w-full sm:w-48 shrink-0 font-mono text-[10px] tracking-widest uppercase text-ink-3">
                    {f.label}
                  </dt>
                  <dd className="text-sm text-ink font-sans break-words">
                    {String(registration[f.key] ?? '') || '—'}
                  </dd>
                </div>
              ))}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3">
                <dt className="w-full sm:w-48 shrink-0 font-mono text-[10px] tracking-widest uppercase text-ink-3">
                  Registered On
                </dt>
                <dd className="text-sm text-ink font-sans">{formatDate(registration.created_at)}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
