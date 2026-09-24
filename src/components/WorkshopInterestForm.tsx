'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  workshopInterestSchema,
  COLLEGE_OPTIONS,
  type WorkshopInterestData,
} from '@/lib/workshop-interest-validations';
import { cn } from '@/lib/utils';
import { SelectField, OptionChip } from '@/components/FormFields';

export default function WorkshopInterestForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WorkshopInterestData>({
    resolver: zodResolver(workshopInterestSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      rollNumber: '',
      college: undefined,
      otherCollege: '',
      interested: undefined,
    },
  });

  const watched = watch();

  const onSubmit = async (data: WorkshopInterestData) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || 'Submission failed.');
        return;
      }
      setSubmitted(true);
    } catch {
      toast.error('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldErr = (name: keyof WorkshopInterestData) => errors[name]?.message as string | undefined;

  if (submitted) {
    return (
      <div className="text-center py-6">
        <p className="font-syne font-black text-2xl text-ink mb-3">Thanks for Letting Us Know! 🙌</p>
        <p className="text-sm text-ink-2 font-sans">We&apos;ll reach out with the next workshop details soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="label-upper">Name *</label>
        <input
          {...register('name')}
          className={cn('input-base', fieldErr('name') && 'input-error')}
          placeholder="Your full name"
        />
        {fieldErr('name') && <p className="error-text">{fieldErr('name')}</p>}
      </div>

      <div>
        <label className="label-upper">Roll Number *</label>
        <input
          {...register('rollNumber')}
          className={cn('input-base', fieldErr('rollNumber') && 'input-error')}
          placeholder="Your roll number"
        />
        {fieldErr('rollNumber') && <p className="error-text">{fieldErr('rollNumber')}</p>}
      </div>

      <div>
        <label className="label-upper">College *</label>
        <SelectField
          options={[...COLLEGE_OPTIONS]}
          value={watched.college || ''}
          onChange={(v) => setValue('college', v as WorkshopInterestData['college'], { shouldValidate: true })}
          placeholder="Select your college"
          error={fieldErr('college')}
        />
        {watched.college === 'Other' && (
          <>
            <input
              {...register('otherCollege')}
              className={cn('input-base mt-3', fieldErr('otherCollege') && 'input-error')}
              placeholder="Enter your college name"
            />
            {fieldErr('otherCollege') && <p className="error-text">{fieldErr('otherCollege')}</p>}
          </>
        )}
      </div>

      <div>
        <label className="label-upper mb-3">Are you interested to participate in the workshop? *</label>
        <div className="flex flex-wrap gap-2">
          <OptionChip
            type="radio"
            name="interested"
            label="Yes, I'm interested"
            checked={watched.interested === true}
            onChange={() => setValue('interested', true, { shouldValidate: true })}
          />
          <OptionChip
            type="radio"
            name="interested"
            label="Not interested"
            checked={watched.interested === false}
            onChange={() => setValue('interested', false, { shouldValidate: true })}
          />
        </div>
        {fieldErr('interested') && <p className="error-text">{fieldErr('interested')}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full flex items-center justify-center gap-3 mt-2"
      >
        {submitting ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  );
}
