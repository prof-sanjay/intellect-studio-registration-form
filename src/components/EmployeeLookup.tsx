'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function EmployeeLookup() {
  const router = useRouter();
  const [empNo, setEmpNo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empNo.trim()) {
      setError('Please enter your employee number.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/intern/lookup?empNo=${encodeURIComponent(empNo.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No application found for this employee number.');
        return;
      }
      router.push(`/id-card/${data.id}`);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label className="label-upper">Employee Number</label>
      <input
        value={empNo}
        onChange={(e) => { setEmpNo(e.target.value); setError(null); }}
        placeholder="e.g. IS26045"
        autoComplete="off"
        className={cn('input-base', error && 'input-error')}
      />
      {error && <p className="error-text">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full mt-4">
        {submitting ? 'Searching…' : 'Find My ID Card →'}
      </button>
    </form>
  );
}
