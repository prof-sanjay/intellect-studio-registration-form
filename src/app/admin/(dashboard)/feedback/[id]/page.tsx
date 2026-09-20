import Link from 'next/link';
import { notFound } from 'next/navigation';
import { initWorkshopDB, initWorkshopFeedbackDB } from '@/lib/db';
import { getWorkshopFeedbackById } from '@/lib/workshop-feedback-queries';
import FeedbackDetail from '@/components/admin/FeedbackDetail';
import type { WorkshopFeedbackWithEvent } from '@/lib/workshop-feedback-types';

export default async function AdminFeedbackDetailPage({ params }: { params: { id: string } }) {
  await initWorkshopDB();
  await initWorkshopFeedbackDB();

  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const feedback = (await getWorkshopFeedbackById(id)) as unknown as WorkshopFeedbackWithEvent | null;
  if (!feedback) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/feedback" className="font-mono text-[10px] tracking-widest uppercase text-ink-3 hover:text-ink">
          ← Back to Feedback
        </Link>
        <h1 className="mt-3 font-syne font-black text-3xl md:text-4xl text-ink">{feedback.name}</h1>
        <p className="mt-1 text-sm text-ink-2 font-sans">{feedback.workshop_title}</p>
      </div>

      <FeedbackDetail feedback={feedback} />
    </div>
  );
}
