'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { workshopRegistrationSchema, type WorkshopRegistrationData } from '@/lib/workshop-validations';
import { cn, DEPARTMENTS, COURSES, YEARS } from '@/lib/utils';
import { Combobox, SelectField } from '@/components/FormFields';

export default function WorkshopRegistrationForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WorkshopRegistrationData>({
    resolver: zodResolver(workshopRegistrationSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '', email: '', phone: '', year: undefined, course: '', department: '',
    },
  });

  const watched = watch();

  const onSubmit = async (data: WorkshopRegistrationData) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/workshops/${slug}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || 'Registration failed.');
        return;
      }
      router.push(`/workshop-pass/${result.id}`);
    } catch {
      toast.error('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldErr = (name: keyof WorkshopRegistrationData) => errors[name]?.message as string | undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="label-upper">Full Name *</label>
        <input
          {...register('fullName')}
          className={cn('input-base', fieldErr('fullName') && 'input-error')}
          placeholder="Name"
        />
        {fieldErr('fullName') && <p className="error-text">{fieldErr('fullName')}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="label-upper">Email Address *</label>
          <input
            {...register('email')}
            type="email"
            className={cn('input-base', fieldErr('email') && 'input-error')}
            placeholder="your@email.com"
          />
          {fieldErr('email') && <p className="error-text">{fieldErr('email')}</p>}
        </div>
        <div>
          <label className="label-upper">Phone Number *</label>
          <input
            {...register('phone')}
            type="tel"
            className={cn('input-base', fieldErr('phone') && 'input-error')}
            placeholder="+91 98765 43210"
          />
          {fieldErr('phone') && <p className="error-text">{fieldErr('phone')}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="label-upper">Year of Study *</label>
          <SelectField
            options={[...YEARS]}
            value={watched.year || ''}
            onChange={(v) => setValue('year', v as WorkshopRegistrationData['year'], { shouldValidate: true })}
            placeholder="Select year"
            error={fieldErr('year')}
          />
        </div>
        <div>
          <label className="label-upper">Course / Degree *</label>
          <Combobox
            options={COURSES}
            value={watched.course}
            onChange={(v) => setValue('course', v, { shouldValidate: true })}
            placeholder="e.g. B. Tech"
            error={fieldErr('course')}
          />
        </div>
      </div>

      <div>
        <label className="label-upper">Department <span className="text-ink-3 font-sans normal-case tracking-normal text-xs">(optional)</span></label>
        <Combobox
          options={DEPARTMENTS}
          value={watched.department || ''}
          onChange={(v) => setValue('department', v, { shouldValidate: true })}
          placeholder="Search department…"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full flex items-center justify-center gap-3 mt-2"
      >
        {submitting ? 'Registering…' : 'Register & Get My Pass →'}
      </button>
    </form>
  );
}
