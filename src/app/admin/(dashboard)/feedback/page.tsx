import {
  getWorkshopFeedbackList,
  getFeedbackStats,
  getTopFutureTopics,
  getRecommendationDistribution,
} from '@/lib/workshop-feedback-queries';
import { initWorkshopDB, initWorkshopFeedbackDB } from '@/lib/db';
import { getAllWorkshopsAdmin } from '@/lib/workshop-queries';
import { RECOMMENDATION_OPTIONS } from '@/lib/workshop-feedback-validations';
import FeedbackSearchFilterBar from '@/components/admin/FeedbackSearchFilterBar';
import FeedbackTable from '@/components/admin/FeedbackTable';
import FeedbackQRCode from '@/components/admin/FeedbackQRCode';
import RefreshButton from '@/components/admin/RefreshButton';
import StatCard from '@/components/admin/StatCard';
import type { WorkshopWithCounts } from '@/lib/workshop-types';
import type { WorkshopFeedbackWithEvent } from '@/lib/workshop-feedback-types';

const round1 = (n: number) => Math.round(n * 10) / 10;

export default async function AdminFeedbackPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  await initWorkshopDB();
  await initWorkshopFeedbackDB();

  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const pageSize = 20;
  const search = searchParams.search || '';
  const workshopId = searchParams.workshop || 'all';
  const sortBy = searchParams.sortBy || 'submitted_at';
  const sortDir = searchParams.sortDir === 'asc' ? 'asc' : 'desc';

  const [{ rows, total }, stats, topics, recommendations, workshops] = await Promise.all([
    getWorkshopFeedbackList({ page, pageSize, search, workshopId, sortBy, sortDir }),
    getFeedbackStats(workshopId),
    getTopFutureTopics(workshopId),
    getRecommendationDistribution(workshopId),
    getAllWorkshopsAdmin(),
  ]);

  const recMap = new Map(recommendations.map((r) => [r.recommendation, r.count]));
  const orderedRecommendations = RECOMMENDATION_OPTIONS.map((opt) => ({
    recommendation: opt,
    count: recMap.get(opt) || 0,
  }));

  const exportParams = new URLSearchParams();
  if (search) exportParams.set('search', search);
  if (workshopId !== 'all') exportParams.set('workshop', workshopId);

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3">Feedback</p>
          <h1 className="font-syne font-black text-3xl md:text-4xl text-ink">Workshop Feedback</h1>
        </div>
        <div className="flex gap-3">
          <RefreshButton />
          <a
            href={`/api/admin/feedback/export?${exportParams.toString()}`}
            className="btn-secondary text-xs px-4 py-2.5"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Responses" value={stats.total} />
        <StatCard label="Avg Overall" value={round1(stats.avgOverall)} />
        <StatCard label="Avg Relevance" value={round1(stats.avgContentRelevance)} />
        <StatCard label="Avg Clarity" value={round1(stats.avgConceptClarity)} />
        <StatCard label="Avg Hands-on" value={round1(stats.avgHandsOn)} />
        <StatCard label="Avg Trainer" value={round1(stats.avgTrainer)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-3 mb-4">
            Most Requested Future Topics
          </p>
          {topics.length === 0 ? (
            <p className="text-sm text-ink-3 font-sans">No responses yet.</p>
          ) : (
            <div className="space-y-3">
              {topics.map((t) => {
                const pct = stats.total > 0 ? Math.round((t.count / stats.total) * 100) : 0;
                return (
                  <div key={t.topic}>
                    <div className="flex justify-between text-xs font-sans text-ink-2 mb-1">
                      <span>{t.topic}</span>
                      <span className="font-mono text-ink-3">{t.count}</span>
                    </div>
                    <div className="h-1.5 bg-bg">
                      <div className="h-1.5 bg-ink" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card p-6">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-3 mb-4">
            Recommendation Distribution
          </p>
          {stats.total === 0 ? (
            <p className="text-sm text-ink-3 font-sans">No responses yet.</p>
          ) : (
            <div className="space-y-3">
              {orderedRecommendations.map((r) => {
                const pct = stats.total > 0 ? Math.round((r.count / stats.total) * 100) : 0;
                return (
                  <div key={r.recommendation}>
                    <div className="flex justify-between text-xs font-sans text-ink-2 mb-1">
                      <span>{r.recommendation}</span>
                      <span className="font-mono text-ink-3">{r.count}</span>
                    </div>
                    <div className="h-1.5 bg-bg">
                      <div className="h-1.5 bg-ink" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <FeedbackQRCode />

      <FeedbackSearchFilterBar workshops={workshops as unknown as WorkshopWithCounts[]} />
      <FeedbackTable
        rows={rows as unknown as WorkshopFeedbackWithEvent[]}
        total={total}
        page={page}
        pageSize={pageSize}
        showWorkshopColumn={workshopId === 'all'}
      />
    </div>
  );
}
