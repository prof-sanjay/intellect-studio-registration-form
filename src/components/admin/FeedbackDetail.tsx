import { formatDate } from '@/lib/utils';
import type { WorkshopFeedbackWithEvent } from '@/lib/workshop-feedback-types';

function RatingRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3">
      <dt className="w-full sm:w-56 shrink-0 font-mono text-[10px] tracking-widest uppercase text-ink-3">{label}</dt>
      <dd className="text-sm text-ink font-sans">{value} / 5</dd>
    </div>
  );
}

export default function FeedbackDetail({ feedback }: { feedback: WorkshopFeedbackWithEvent }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="card p-6">
          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-1">Register Number</p>
          <p className="text-sm text-ink font-sans mb-4">{feedback.register_number}</p>

          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-1">Workshop</p>
          <p className="text-sm text-ink font-sans mb-4">{feedback.workshop_title}</p>

          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-1">Submitted On</p>
          <p className="text-sm text-ink font-sans">{formatDate(feedback.submitted_at)}</p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="card p-6 md:p-8">
          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-4">Ratings</p>
          <dl className="divide-y divide-border mb-6">
            <RatingRow label="Overall" value={feedback.overall_rating} />
            <RatingRow label="Content Relevance" value={feedback.content_relevance} />
            <RatingRow label="Concept Clarity" value={feedback.concept_clarity} />
            <RatingRow label="Hands-on Activities" value={feedback.hands_on_rating} />
            <RatingRow label="Trainer / Speaker" value={feedback.trainer_rating} />
          </dl>

          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-2">Future Topics</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {feedback.future_topics.map((t) => (
              <span key={t} className="px-3 py-1 text-xs font-sans border border-border bg-bg text-ink">
                {t === 'Other' && feedback.other_topic ? `Other (${feedback.other_topic})` : t}
              </span>
            ))}
          </div>

          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-2">Would Recommend?</p>
          <p className="text-sm text-ink font-sans mb-6">{feedback.recommendation}</p>

          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-2">Improvement Suggestions</p>
          <p className="text-sm text-ink font-sans whitespace-pre-wrap">
            {feedback.improvement_suggestions || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
