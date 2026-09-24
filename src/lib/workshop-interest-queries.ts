import { getDB, withRetry } from '@/lib/db';
import {
  INTEREST_SORT_COLUMNS,
  type InterestListParams,
  type InterestStats,
} from '@/lib/workshop-interest-types';
import type { WorkshopInterestData } from '@/lib/workshop-interest-validations';

// ─── Public reads ───────────────────────────────────────────────────────────

export async function createWorkshopInterest(data: WorkshopInterestData) {
  const sql = getDB();
  const rows = await withRetry(() =>
    sql`
      INSERT INTO workshop_interest (name, roll_number, college, other_college, interested)
      VALUES (${data.name}, ${data.rollNumber}, ${data.college}, ${data.otherCollege || null}, ${data.interested})
      RETURNING *
    `
  );
  return rows[0];
}

// ─── Admin: interest ────────────────────────────────────────────────────────

const SEARCH_COLUMNS = ['name', 'roll_number'];

function buildInterestFilter(college: string, search: string): { whereClause: string; values: any[] } {
  const conditions: string[] = [];
  const values: any[] = [];

  if (college && college !== 'all') {
    values.push(college);
    conditions.push(`college = $${values.length}`);
  }
  if (search && search.trim()) {
    values.push(`%${search.trim()}%`);
    const idx = values.length;
    conditions.push(`(${SEARCH_COLUMNS.map((col) => `${col} ILIKE $${idx}`).join(' OR ')})`);
  }

  return { whereClause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', values };
}

export async function getWorkshopInterestList(params: InterestListParams) {
  const sql = getDB();
  const sortBy = (INTEREST_SORT_COLUMNS as readonly string[]).includes(params.sortBy) ? params.sortBy : 'submitted_at';
  const sortDir = params.sortDir === 'asc' ? 'ASC' : 'DESC';
  const { whereClause, values } = buildInterestFilter(params.college, params.search);

  const countRows = await withRetry(() =>
    sql(`SELECT COUNT(*)::int AS total FROM workshop_interest ${whereClause}`, values)
  );
  const total = (countRows[0] as { total: number }).total;

  const limitIdx = values.length + 1;
  const offsetIdx = values.length + 2;
  const rows = await withRetry(() =>
    sql(
      `SELECT * FROM workshop_interest ${whereClause}
       ORDER BY ${sortBy} ${sortDir}
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      [...values, params.pageSize, (params.page - 1) * params.pageSize]
    )
  );

  return { rows, total };
}

export async function getInterestStats(college?: string): Promise<InterestStats> {
  const sql = getDB();
  const filterCollege = college && college !== 'all' ? college : null;
  const rows = await withRetry(() =>
    filterCollege
      ? sql`
          SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE interested = true)::int AS "interestedCount",
            COUNT(*) FILTER (WHERE interested = false)::int AS "notInterestedCount",
            COUNT(*) FILTER (WHERE college = 'NCERC')::int AS ncerc,
            COUNT(*) FILTER (WHERE college = 'JCET')::int AS jcet,
            COUNT(*) FILTER (WHERE college = 'Other')::int AS other
          FROM workshop_interest
          WHERE college = ${filterCollege}
        `
      : sql`
          SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE interested = true)::int AS "interestedCount",
            COUNT(*) FILTER (WHERE interested = false)::int AS "notInterestedCount",
            COUNT(*) FILTER (WHERE college = 'NCERC')::int AS ncerc,
            COUNT(*) FILTER (WHERE college = 'JCET')::int AS jcet,
            COUNT(*) FILTER (WHERE college = 'Other')::int AS other
          FROM workshop_interest
        `
  );
  return rows[0] as unknown as InterestStats;
}

export async function deleteWorkshopInterest(id: number) {
  const sql = getDB();
  const rows = await withRetry(() => sql`DELETE FROM workshop_interest WHERE id = ${id} RETURNING id`);
  return rows[0] || null;
}
