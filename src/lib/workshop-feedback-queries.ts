import { getDB, withRetry } from '@/lib/db';
import {
  FEEDBACK_SORT_COLUMNS,
  type FeedbackListParams,
  type FeedbackStats,
} from '@/lib/workshop-feedback-types';
import type { WorkshopFeedbackData } from '@/lib/workshop-feedback-validations';

// ─── Public reads ───────────────────────────────────────────────────────────

// Workshops a student can currently leave feedback for — published (in
// progress) or closed (recently finished), newest event first.
export async function getFeedbackEligibleWorkshops() {
  const sql = getDB();
  return withRetry(() =>
    sql`
      SELECT id, slug, title, venue, event_date, status
      FROM workshops
      WHERE status IN ('published', 'closed')
      ORDER BY event_date DESC
      LIMIT 10
    `
  );
}

export async function createWorkshopFeedback(workshopId: number, data: WorkshopFeedbackData) {
  const sql = getDB();
  const rows = await withRetry(() =>
    sql`
      INSERT INTO workshop_feedback (
        workshop_id, name, register_number, overall_rating, content_relevance,
        concept_clarity, hands_on_rating, trainer_rating, future_topics, other_topic,
        recommendation, improvement_suggestions
      ) VALUES (
        ${workshopId}, ${data.name}, ${data.registerNumber}, ${data.overallRating}, ${data.contentRelevance},
        ${data.conceptClarity}, ${data.handsOnRating}, ${data.trainerRating}, ${data.futureTopics}, ${data.otherTopic || null},
        ${data.recommendation}, ${data.improvementSuggestions || null}
      )
      RETURNING *
    `
  );
  return rows[0];
}

// ─── Admin: feedback ────────────────────────────────────────────────────────

const SEARCH_COLUMNS = ['name', 'register_number'];

function buildFeedbackFilter(workshopId: string, search: string): { whereClause: string; values: any[] } {
  const conditions: string[] = [];
  const values: any[] = [];

  if (workshopId && workshopId !== 'all') {
    values.push(parseInt(workshopId, 10));
    conditions.push(`f.workshop_id = $${values.length}`);
  }
  if (search && search.trim()) {
    values.push(`%${search.trim()}%`);
    const idx = values.length;
    conditions.push(`(${SEARCH_COLUMNS.map((col) => `f.${col} ILIKE $${idx}`).join(' OR ')})`);
  }

  return { whereClause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', values };
}

export async function getWorkshopFeedbackList(params: FeedbackListParams) {
  const sql = getDB();
  const sortBy = (FEEDBACK_SORT_COLUMNS as readonly string[]).includes(params.sortBy) ? params.sortBy : 'submitted_at';
  const sortDir = params.sortDir === 'asc' ? 'ASC' : 'DESC';
  const { whereClause, values } = buildFeedbackFilter(params.workshopId, params.search);

  const countRows = await withRetry(() =>
    sql(`SELECT COUNT(*)::int AS total FROM workshop_feedback f ${whereClause}`, values)
  );
  const total = (countRows[0] as { total: number }).total;

  const limitIdx = values.length + 1;
  const offsetIdx = values.length + 2;
  const rows = await withRetry(() =>
    sql(
      `SELECT f.*, w.title AS workshop_title
       FROM workshop_feedback f
       JOIN workshops w ON w.id = f.workshop_id
       ${whereClause}
       ORDER BY f.${sortBy} ${sortDir}
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      [...values, params.pageSize, (params.page - 1) * params.pageSize]
    )
  );

  return { rows, total };
}

export async function getAllMatchingWorkshopFeedback(workshopId: string, search: string) {
  const sql = getDB();
  const { whereClause, values } = buildFeedbackFilter(workshopId, search);
  return withRetry(() =>
    sql(
      `SELECT f.*, w.title AS workshop_title
       FROM workshop_feedback f
       JOIN workshops w ON w.id = f.workshop_id
       ${whereClause}
       ORDER BY f.submitted_at DESC`,
      values
    )
  );
}

export async function getWorkshopFeedbackById(id: number) {
  const sql = getDB();
  const rows = await withRetry(() =>
    sql`
      SELECT f.*, w.title AS workshop_title, w.venue AS workshop_venue, w.event_date AS workshop_event_date
      FROM workshop_feedback f
      JOIN workshops w ON w.id = f.workshop_id
      WHERE f.id = ${id}
    `
  );
  return rows[0] || null;
}

export async function deleteWorkshopFeedback(id: number) {
  const sql = getDB();
  const rows = await withRetry(() => sql`DELETE FROM workshop_feedback WHERE id = ${id} RETURNING id`);
  return rows[0] || null;
}

export async function getFeedbackStats(workshopId?: string): Promise<FeedbackStats> {
  const sql = getDB();
  const filterId = workshopId && workshopId !== 'all' ? parseInt(workshopId, 10) : null;
  const rows = await withRetry(() =>
    filterId
      ? sql`
          SELECT
            COUNT(*)::int AS total,
            COALESCE(AVG(overall_rating), 0)::float AS "avgOverall",
            COALESCE(AVG(content_relevance), 0)::float AS "avgContentRelevance",
            COALESCE(AVG(concept_clarity), 0)::float AS "avgConceptClarity",
            COALESCE(AVG(hands_on_rating), 0)::float AS "avgHandsOn",
            COALESCE(AVG(trainer_rating), 0)::float AS "avgTrainer"
          FROM workshop_feedback
          WHERE workshop_id = ${filterId}
        `
      : sql`
          SELECT
            COUNT(*)::int AS total,
            COALESCE(AVG(overall_rating), 0)::float AS "avgOverall",
            COALESCE(AVG(content_relevance), 0)::float AS "avgContentRelevance",
            COALESCE(AVG(concept_clarity), 0)::float AS "avgConceptClarity",
            COALESCE(AVG(hands_on_rating), 0)::float AS "avgHandsOn",
            COALESCE(AVG(trainer_rating), 0)::float AS "avgTrainer"
          FROM workshop_feedback
        `
  );
  return rows[0] as unknown as FeedbackStats;
}

export async function getTopFutureTopics(workshopId?: string) {
  const sql = getDB();
  const filterId = workshopId && workshopId !== 'all' ? parseInt(workshopId, 10) : null;
  const rows = await withRetry(() =>
    filterId
      ? sql`
          SELECT topic, COUNT(*)::int AS count
          FROM workshop_feedback, unnest(future_topics) AS topic
          WHERE workshop_id = ${filterId}
          GROUP BY topic
          ORDER BY count DESC
        `
      : sql`
          SELECT topic, COUNT(*)::int AS count
          FROM workshop_feedback, unnest(future_topics) AS topic
          GROUP BY topic
          ORDER BY count DESC
        `
  );
  return rows as unknown as { topic: string; count: number }[];
}

export async function getRecommendationDistribution(workshopId?: string) {
  const sql = getDB();
  const filterId = workshopId && workshopId !== 'all' ? parseInt(workshopId, 10) : null;
  const rows = await withRetry(() =>
    filterId
      ? sql`SELECT recommendation, COUNT(*)::int AS count FROM workshop_feedback WHERE workshop_id = ${filterId} GROUP BY recommendation`
      : sql`SELECT recommendation, COUNT(*)::int AS count FROM workshop_feedback GROUP BY recommendation`
  );
  return rows as unknown as { recommendation: string; count: number }[];
}
