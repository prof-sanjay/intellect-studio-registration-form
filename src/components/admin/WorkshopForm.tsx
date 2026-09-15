'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { workshopSchema, type WorkshopFormData } from '@/lib/workshop-validations';
import { cn } from '@/lib/utils';
import type { Workshop } from '@/lib/workshop-types';

export default function WorkshopForm({ workshop }: { workshop?: Workshop }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WorkshopFormData>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      title: workshop?.title || '',
      description: workshop?.description || '',
      venue: workshop?.venue || '',
      eventDate: workshop?.event_date?.slice(0, 10) || '',
      bannerUrl: workshop?.banner_url || '',
      status: workshop?.status || 'published',
    },
  });

  const bannerUrl = watch('bannerUrl');

  const handleBannerUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'photo');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || 'Upload failed');
        return;
      }
      const { url } = await res.json();
      setValue('bannerUrl', url, { shouldValidate: true });
      toast.success('Banner uploaded');
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: WorkshopFormData) => {
    setSubmitting(true);
    try {
      const url = workshop ? `/api/admin/workshops/${workshop.id}` : '/api/admin/workshops';
      const res = await fetch(url, {
        method: workshop ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || 'Failed to save workshop.');
        return;
      }
      toast.success(workshop ? 'Workshop updated.' : 'Workshop created.');
      router.push('/admin/workshops');
      router.refresh();
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="card p-6 md:p-8 space-y-5">
        <div>
          <label className="label-upper">Workshop Title *</label>
          <input
            className={cn('input-base', errors.title && 'input-error')}
            {...register('title')}
            placeholder="e.g. Master AI Architect Workshop"
          />
          {errors.title && <p className="error-text">{errors.title.message}</p>}
        </div>

        <div>
          <label className="label-upper">Description</label>
          <textarea
            rows={4}
            className="input-base resize-none"
            {...register('description')}
            placeholder="What will attendees learn? Who is this for?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="label-upper">Venue *</label>
            <input
              className={cn('input-base', errors.venue && 'input-error')}
              {...register('venue')}
              placeholder="e.g. NCERC, Thrissur"
            />
            {errors.venue && <p className="error-text">{errors.venue.message}</p>}
          </div>
          <div>
            <label className="label-upper">Event Date *</label>
            <input
              type="date"
              className={cn('input-base', errors.eventDate && 'input-error')}
              {...register('eventDate')}
            />
            {errors.eventDate && <p className="error-text">{errors.eventDate.message}</p>}
          </div>
        </div>

        <div>
          <label className="label-upper">Status</label>
          <select className="input-base" {...register('status')}>
            <option value="published">Published (visible to students)</option>
            <option value="draft">Draft (hidden)</option>
            <option value="closed">Closed (registration closed)</option>
          </select>
        </div>

        <div>
          <label className="label-upper">Banner Image <span className="text-ink-3 normal-case tracking-normal text-xs">(optional)</span></label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="input-base flex-1"
              {...register('bannerUrl')}
              placeholder="https://… or upload below"
            />
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBannerUpload(f); }}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="btn-secondary text-xs px-4 whitespace-nowrap disabled:opacity-60"
            >
              {uploading ? 'Uploading…' : 'Upload Image'}
            </button>
          </div>
          {bannerUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bannerUrl} alt="Banner preview" className="mt-3 w-full max-h-48 object-cover border border-border" />
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Saving…' : workshop ? 'Save Changes' : 'Create Workshop'}
        </button>
        <button type="button" onClick={() => router.push('/admin/workshops')} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
