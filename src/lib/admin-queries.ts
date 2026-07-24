import { getDB, withRetry } from '@/lib/db';
import { SORT_COLUMNS, type RegistrationListParams, type RegistrationStats } from '@/lib/admin-types';

// Columns searched against with ILIKE when a `search` term is present.
const SEARCH_COLUMNS = ['full_name', 'email', 'college', 'temp_emp_number', 'phone'];

/**
 * Builds a parameterized WHERE clause from status/search filters.
 * Column identifiers here are fixed literals (never user input) — only the
 * search term and status value are passed as bound parameters.
 */
function buildRegistrationFilter(status: string, search: string): { whereClause: string; values: any[] } {
  const conditions: string[] = [];
  const values: any[] = [];

  if (status && status !== 'all') {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  if (search && search.trim()) {
    values.push(`%${search.trim()}%`);
    const idx = values.length;
    conditions.push(`(${SEARCH_COLUMNS.map((col) => `${col} ILIKE $${idx}`).join(' OR ')})`);
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    values,
  };
}

export async function getRegistrationStats(): Promise<RegistrationStats> {
  const sql = getDB();
  const rows = await withRetry(() =>
    sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE)::int AS today,
        COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
        COUNT(*) FILTER (WHERE status = 'approved')::int AS approved,
        COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected
      FROM interns
    `
  );
  return rows[0] as RegistrationStats;
}

export async function getRegistrationsList(params: RegistrationListParams) {
  const sql = getDB();
  const sortBy = (SORT_COLUMNS as readonly string[]).includes(params.sortBy) ? params.sortBy : 'created_at';
  const sortDir = params.sortDir === 'asc' ? 'ASC' : 'DESC';
  const { whereClause, values } = buildRegistrationFilter(params.status, params.search);

  const countRows = await withRetry(() =>
    sql(`SELECT COUNT(*)::int AS total FROM interns ${whereClause}`, values)
  );
  const total = (countRows[0] as { total: number }).total;

  const limitIdx = values.length + 1;
  const offsetIdx = values.length + 2;
  const rows = await withRetry(() =>
    sql(
      `SELECT id, temp_emp_number, full_name, email, phone, college, course, department, year, created_at, status
       FROM interns ${whereClause}
       ORDER BY ${sortBy} ${sortDir}
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      [...values, params.pageSize, (params.page - 1) * params.pageSize]
    )
  );

  return { rows, total };
}

export async function getAllMatchingRegistrations(status: string, search: string) {
  const sql = getDB();
  const { whereClause, values } = buildRegistrationFilter(status, search);
  return withRetry(() =>
    sql(`SELECT * FROM interns ${whereClause} ORDER BY created_at DESC`, values)
  );
}

// Whitelist of intern-table columns an admin is allowed to update.
const UPDATABLE_COLUMNS = [
  'full_name', 'dob', 'department', 'phone', 'college', 'instagram',
  'year', 'course', 'resume_url', 'address', 'email', 'photo_url',
  'portfolio_link', 'status',
];

export async function updateRegistration(id: number, fields: Record<string, any>) {
  const sql = getDB();
  const keys = Object.keys(fields).filter((k) => UPDATABLE_COLUMNS.includes(k));
  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const values = keys.map((key) => fields[key]);
  values.push(id);

  const rows = await withRetry(() =>
    sql(
      `UPDATE interns SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    )
  );
  return rows[0] || null;
}
