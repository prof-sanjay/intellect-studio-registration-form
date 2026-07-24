'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import type { Registration } from '@/lib/admin-types';
import StatusBadge from './StatusBadge';
import EditRegistrationForm from './EditRegistrationForm';

const FIELDS: { key: keyof Registration; label: string }[] = [
  { key: 'temp_emp_number', label: 'Employee Number' },
  { key: 'full_name', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'dob', label: 'Date of Birth' },
  { key: 'college', label: 'Institution' },
  { key: 'year', label: 'Year' },
  { key: 'course', label: 'Course' },
  { key: 'department', label: 'Department' },
  { key: 'address', label: 'Address' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'portfolio_link', label: 'Portfolio Link' },
];

export default function RegistrationDetail({ intern }: { intern: Registration }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleStatusAction = async (status: 'approved' | 'rejected') => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/registrations/${intern.id}`, {
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
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete the application for ${intern.full_name}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/registrations/${intern.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || 'Delete failed.');
        return;
      }
      toast.success('Application deleted.');
      router.push('/admin/registrations');
      router.refresh();
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Photo + documents */}
      <div className="lg:col-span-1 space-y-6">
        <div className="card p-6">
          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-4">Photo</p>
          {intern.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={intern.photo_url}
              alt={intern.full_name}
              className="w-full aspect-square object-cover border border-border"
            />
          ) : (
            <div className="w-full aspect-square flex items-center justify-center border border-border text-ink-3 text-xs">
              No photo
            </div>
          )}
        </div>

        <div className="card p-6">
          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-4">Resume</p>
          {intern.resume_url ? (
            <a href={intern.resume_url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs w-full block text-center">
              View / Download Resume (PDF)
            </a>
          ) : (
            <p className="text-xs text-ink-3">No resume submitted.</p>
          )}
        </div>

        <div className="card p-6 space-y-3">
          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-1">Status</p>
          <StatusBadge status={intern.status} />
          <div className="flex flex-col gap-2 pt-2">
            <button
              disabled={busy || intern.status === 'approved'}
              onClick={() => handleStatusAction('approved')}
              className="btn-secondary text-xs disabled:opacity-30"
            >
              Approve
            </button>
            <button
              disabled={busy || intern.status === 'rejected'}
              onClick={() => handleStatusAction('rejected')}
              className="btn-secondary text-xs disabled:opacity-30"
            >
              Reject
            </button>
            <button
              disabled={busy}
              onClick={handleDelete}
              className="text-xs font-mono uppercase tracking-wide text-error hover:underline pt-2 disabled:opacity-30"
            >
              Delete Application
            </button>
          </div>
        </div>
      </div>

      {/* Details / edit */}
      <div className="lg:col-span-2">
        <div className="card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3">
              Application Details
            </p>
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn-secondary text-xs px-4 py-2">
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <EditRegistrationForm intern={intern} onCancel={() => setEditing(false)} />
          ) : (
            <dl className="divide-y divide-border">
              {FIELDS.map((f) => (
                <div key={f.key} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3">
                  <dt className="w-full sm:w-48 shrink-0 font-mono text-[10px] tracking-widest uppercase text-ink-3">
                    {f.label}
                  </dt>
                  <dd className="text-sm text-ink font-sans break-words">
                    {String(intern[f.key] ?? '') || '—'}
                  </dd>
                </div>
              ))}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3">
                <dt className="w-full sm:w-48 shrink-0 font-mono text-[10px] tracking-widest uppercase text-ink-3">
                  Registered On
                </dt>
                <dd className="text-sm text-ink font-sans">{formatDate(intern.created_at)}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
