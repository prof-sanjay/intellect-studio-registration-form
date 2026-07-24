'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { adminUpdateSchema, type AdminUpdateData } from '@/lib/admin-validations';
import { YEARS } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Registration } from '@/lib/admin-types';

export default function EditRegistrationForm({
  intern,
  onCancel,
}: {
  intern: Registration;
  onCancel: () => void;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminUpdateData>({
    resolver: zodResolver(adminUpdateSchema),
    defaultValues: {
      full_name: intern.full_name,
      dob: intern.dob?.slice(0, 10),
      department: intern.department,
      phone: intern.phone,
      college: intern.college,
      instagram: intern.instagram || '',
      year: intern.year as AdminUpdateData['year'],
      course: intern.course,
      address: intern.address,
      email: intern.email,
      portfolio_link: intern.portfolio_link || '',
    },
  });

  const onSubmit = async (data: AdminUpdateData) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/registrations/${intern.id}`, {
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
          <label className="label-upper">Date of Birth</label>
          <input type="date" className={cn('input-base', errors.dob && 'input-error')} {...register('dob')} />
        </div>
        <div>
          <label className="label-upper">College / Institution</label>
          <input className={cn('input-base', errors.college && 'input-error')} {...register('college')} />
          {errors.college && <p className="error-text">{errors.college.message}</p>}
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
          <label className="label-upper">Department</label>
          <input className={cn('input-base', errors.department && 'input-error')} {...register('department')} />
          {errors.department && <p className="error-text">{errors.department.message}</p>}
        </div>
        <div>
          <label className="label-upper">Instagram</label>
          <input className="input-base" {...register('instagram')} />
        </div>
        <div>
          <label className="label-upper">Portfolio Link</label>
          <input className="input-base" {...register('portfolio_link')} />
        </div>
      </div>

      <div>
        <label className="label-upper">Address</label>
        <textarea rows={3} className={cn('input-base', errors.address && 'input-error')} {...register('address')} />
        {errors.address && <p className="error-text">{errors.address.message}</p>}
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
