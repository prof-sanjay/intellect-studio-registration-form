'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { adminWorkshopRegUpdateSchema, type AdminWorkshopRegUpdateData } from '@/lib/workshop-validations';
import { YEARS, cn } from '@/lib/utils';
import type { WorkshopRegistration } from '@/lib/workshop-types';

export default function EditWorkshopRegistrationForm({
  registration,
  onCancel,
}: {
  registration: WorkshopRegistration;
  onCancel: () => void;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminWorkshopRegUpdateData>({
    resolver: zodResolver(adminWorkshopRegUpdateSchema),
    defaultValues: {
      full_name: registration.full_name,
      email: registration.email,
      phone: registration.phone,
      year: registration.year as AdminWorkshopRegUpdateData['year'],
      course: registration.course,
      department: registration.department || '',
    },
  });

  const onSubmit = async (data: AdminWorkshopRegUpdateData) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/workshop-registrations/${registration.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || 'Update failed.');
        return;
      }
      toast.success('Registration updated.');
      onCancel();
      router.refresh();
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="label-upper">Full Name</label>
          <input className={cn('input-base', errors.full_name && 'input-error')} {...register('full_name')} />
          {errors.full_name && <p className="error-text">{errors.full_name.message}</p>}
        </div>
        <div>
          <label className="label-upper">Email</label>
          <input className={cn('input-base', errors.email && 'input-error')} {...register('email')} />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label-upper">Phone</label>
          <input className={cn('input-base', errors.phone && 'input-error')} {...register('phone')} />
          {errors.phone && <p className="error-text">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="label-upper">Year</label>
          <select className={cn('input-base', errors.year && 'input-error')} {...register('year')}>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-upper">Course / Degree</label>
          <input className={cn('input-base', errors.course && 'input-error')} {...register('course')} />
          {errors.course && <p className="error-text">{errors.course.message}</p>}
        </div>
        <div>
          <label className="label-upper">Department <span className="text-ink-3 normal-case tracking-normal text-xs">(optional)</span></label>
          <input className="input-base" {...register('department')} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Saving…' : 'Save Changes'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
