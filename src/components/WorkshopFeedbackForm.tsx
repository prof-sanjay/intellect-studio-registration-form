'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  workshopFeedbackSchema,
  FUTURE_TOPICS,
  RECOMMENDATION_OPTIONS,
  type WorkshopFeedbackData,
  type FutureTopic,
} from '@/lib/workshop-feedback-validations';
import { cn, formatDate } from '@/lib/utils';
import { RatingScale, OptionChip } from '@/components/FormFields';
import type { FeedbackEligibleWorkshop } from '@/lib/workshop-feedback-types';

const OVERALL_LABELS: [string, string, string, string, string] = ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'];
const RELEVANCE_LABELS: [string, string, string, string, string] = ['Not Relevant', 'Slightly Relevant', 'Neutral', 'Relevant', 'Very Relevant'];

export default function WorkshopFeedbackForm({ workshops }: { workshops: FeedbackEligibleWorkshop[] }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WorkshopFeedbackData>({
    resolver: zodResolver(workshopFeedbackSchema),
    mode: 'onBlur',
    defaultValues: {
      workshopId: workshops.length === 1 ? workshops[0].id : undefined,
      name: '',
      registerNumber: '',
      overallRating: undefined,
      contentRelevance: undefined,
      conceptClarity: undefined,
      handsOnRating: undefined,
      trainerRating: undefined,
      futureTopics: [],
      otherTopic: '',
      recommendation: undefined,
      improvementSuggestions: '',
    },
  });

  const watched = watch();

  const toggleTopic = (topic: FutureTopic) => {
    const current = watched.futureTopics || [];
    const next = current.includes(topic) ? current.filter((t) => t !== topic) : [...current, topic];
    setValue('futureTopics', next, { shouldValidate: true });
  };

  const onSubmit = async (data: WorkshopFeedbackData) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setDuplicate(true);
          return;
        }
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

  const fieldErr = (name: keyof WorkshopFeedbackData) => errors[name]?.message as string | undefined;

  if (duplicate) {
    return (
      <div className="text-center py-6">
        <p className="font-syne font-black text-xl text-ink mb-3">Feedback Already Submitted</p>
        <p className="text-sm text-ink-2 font-sans">
          We already received feedback from this register number. Thank you!
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <p className="font-syne font-black text-2xl text-ink mb-3">Thank You for Your Feedback! 🙌</p>
        <p className="text-sm text-ink-2 font-sans">
          Your feedback helps Intellect Studios create better learning experiences.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      {workshops.length > 1 && (
        <div>
          <label className="label-upper">Which Workshop Did You Attend? *</label>
          <select
            className={cn('input-base cursor-pointer', fieldErr('workshopId') && 'input-error')}
            value={watched.workshopId ?? ''}
            onChange={(e) => setValue('workshopId', Number(e.target.value), { shouldValidate: true })}
          >
            <option value="">Select workshop</option>
            {workshops.map((w) => (
              <option key={w.id} value={w.id}>
                {w.title} — {formatDate(w.event_date)}
              </option>
            ))}
          </select>
          {fieldErr('workshopId') && <p className="error-text">{fieldErr('workshopId')}</p>}
        </div>
      )}

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
        <label className="label-upper">Register Number *</label>
        <input
          {...register('registerNumber')}
          className={cn('input-base', fieldErr('registerNumber') && 'input-error')}
          placeholder="Your register number"
        />
        {fieldErr('registerNumber') && <p className="error-text">{fieldErr('registerNumber')}</p>}
      </div>

      <div className="border-t border-border pt-6">
        <label className="label-upper mb-3">Q1. How would you rate the workshop overall? *</label>
        <RatingScale
          value={watched.overallRating}
          onChange={(v) => setValue('overallRating', v, { shouldValidate: true })}
          labels={OVERALL_LABELS}
          error={fieldErr('overallRating')}
        />
      </div>

      <div>
        <label className="label-upper mb-3">
          Q2. How relevant was the workshop content to your learning/career goals? *
        </label>
        <RatingScale
          value={watched.contentRelevance}
          onChange={(v) => setValue('contentRelevance', v, { shouldValidate: true })}
          labels={RELEVANCE_LABELS}
          error={fieldErr('contentRelevance')}
        />
      </div>

      <div>
        <label className="label-upper mb-3">Q3. How would you rate the clarity of the concepts explained? *</label>
        <RatingScale
          value={watched.conceptClarity}
          onChange={(v) => setValue('conceptClarity', v, { shouldValidate: true })}
          labels={OVERALL_LABELS}
          error={fieldErr('conceptClarity')}
        />
      </div>

      <div>
        <label className="label-upper mb-3">
          Q4. How would you rate the practical demonstrations / hands-on activities? *
        </label>
        <RatingScale
          value={watched.handsOnRating}
          onChange={(v) => setValue('handsOnRating', v, { shouldValidate: true })}
          labels={OVERALL_LABELS}
          error={fieldErr('handsOnRating')}
        />
      </div>

      <div>
        <label className="label-upper mb-3">Q5. How would you rate the trainer/speaker? *</label>
        <RatingScale
          value={watched.trainerRating}
          onChange={(v) => setValue('trainerRating', v, { shouldValidate: true })}
          labels={OVERALL_LABELS}
          error={fieldErr('trainerRating')}
        />
      </div>

      <div>
        <label className="label-upper mb-3">
          Q6. Which topics would you like Intellect Studios to cover in future workshops? *
        </label>
        <div className="flex flex-wrap gap-2">
          {FUTURE_TOPICS.map((topic) => (
            <OptionChip
              key={topic}
              label={topic}
              checked={(watched.futureTopics || []).includes(topic)}
              onChange={() => toggleTopic(topic)}
            />
          ))}
        </div>
        {fieldErr('futureTopics') && <p className="error-text">{fieldErr('futureTopics')}</p>}
        {(watched.futureTopics || []).includes('Other') && (
          <>
            <input
              {...register('otherTopic')}
              className={cn('input-base mt-3', fieldErr('otherTopic') && 'input-error')}
              placeholder="Tell us what else you'd like to see"
            />
            {fieldErr('otherTopic') && <p className="error-text">{fieldErr('otherTopic')}</p>}
          </>
        )}
      </div>

      <div>
        <label className="label-upper mb-3">
          Q7. Would you recommend Intellect Studios for workshops to your friends/colleagues? *
        </label>
        <div className="flex flex-wrap gap-2">
          {RECOMMENDATION_OPTIONS.map((opt) => (
            <OptionChip
              key={opt}
              type="radio"
              name="recommendation"
              label={opt}
              checked={watched.recommendation === opt}
              onChange={() => setValue('recommendation', opt, { shouldValidate: true })}
            />
          ))}
        </div>
        {fieldErr('recommendation') && <p className="error-text">{fieldErr('recommendation')}</p>}
      </div>

      <div>
        <label className="label-upper">
          Q8. What can we improve in our future workshops?{' '}
          <span className="text-ink-3 font-sans normal-case tracking-normal text-xs">(optional)</span>
        </label>
        <textarea
          {...register('improvementSuggestions')}
          rows={4}
          className="input-base resize-none"
          placeholder="Your suggestions…"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full flex items-center justify-center gap-3 mt-2"
      >
        {submitting ? 'Submitting…' : 'Submit Feedback'}
      </button>
    </form>
  );
}
