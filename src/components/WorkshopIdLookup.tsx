'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function WorkshopIdLookup() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setError('Please enter your student ID.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/workshops/lookup?studentId=${encodeURIComponent(studentId.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No registration found for this student ID.');
        return;
      }
      router.push(`/workshop-pass/${data.id}`);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label className="label-upper">Student ID</label>
      <input
        value={studentId}
        onChange={(e) => { setStudentId(e.target.value); setError(null); }}
        placeholder="e.g. ISMA26092601"
        autoComplete="off"
        className={cn('input-base', error && 'input-error')}
      />
      {error && <p className="error-text">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full mt-4">
        {submitting ? 'Searching…' : 'Find My QR Pass →'}
      </button>
    </form>
  );
}
