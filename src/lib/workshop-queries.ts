import { getDB, withRetry } from '@/lib/db';
import {
  WORKSHOP_REG_SORT_COLUMNS,
  type WorkshopRegListParams,
  type WorkshopRegistrationStats,
} from '@/lib/workshop-types';
import type { WorkshopFormData } from '@/lib/workshop-validations';
import { generateWorkshopStudentId, slugify } from '@/lib/utils';

// ─── Public reads ───────────────────────────────────────────────────────────

export async function getPublishedWorkshops() {
  const sql = getDB();
  return withRetry(() =>
    sql`
      SELECT w.*, COUNT(r.id) FILTER (WHERE r.status != 'rejected')::int AS registration_count
      FROM workshops w
      LEFT JOIN workshop_registrations r ON r.workshop_id = w.id
      WHERE w.status = 'published'
      GROUP BY w.id
      ORDER BY w.event_date ASC
    `
  );
}

export async function getWorkshopBySlug(slug: string) {
  const sql = getDB();
  const rows = await withRetry(() =>
    sql`
      SELECT w.*, COUNT(r.id) FILTER (WHERE r.status != 'rejected')::int AS registration_count
      FROM workshops w
      LEFT JOIN workshop_registrations r ON r.workshop_id = w.id
      WHERE w.slug = ${slug}
      GROUP BY w.id
    `
  );
  return rows[0] || null;
}

export async function getWorkshopById(id: number) {
  const sql = getDB();
  const rows = await withRetry(() => sql`SELECT * FROM workshops WHERE id = ${id}`);
  return rows[0] || null;
}

// ─── Admin: workshops (events) CRUD ─────────────────────────────────────────

export async function getAllWorkshopsAdmin() {
  const sql = getDB();
  return withRetry(() =>
    sql`
      SELECT w.*, COUNT(r.id)::int AS registration_count
      FROM workshops w
      LEFT JOIN workshop_registrations r ON r.workshop_id = w.id
      GROUP BY w.id
      ORDER BY w.event_date DESC
    `
  );
}

async function uniqueSlugFor(title: string, excludeId?: number): Promise<string> {
  const sql = getDB();
  const base = slugify(title) || 'workshop';
  let candidate = base;
  let n = 1;
  // Small table, plain loop is fine — avoids a fragile generated-slug collision.
  while (true) {
    const rows = excludeId
      ? await withRetry(() => sql`SELECT id FROM workshops WHERE slug = ${candidate} AND id != ${excludeId}`)
      : await withRetry(() => sql`SELECT id FROM workshops WHERE slug = ${candidate}`);
    if (rows.length === 0) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

export async function createWorkshop(data: WorkshopFormData) {
  const sql = getDB();
  const slug = await uniqueSlugFor(data.title);
  const rows = await withRetry(() =>
    sql`
      INSERT INTO workshops (
        slug, title, description, venue, event_date, banner_url, status
      ) VALUES (
        ${slug}, ${data.title}, ${data.description || null}, ${data.venue},
        ${data.eventDate}, ${data.bannerUrl || null}, ${data.status}
      )
      RETURNING *
    `
  );
  return rows[0];
}

export async function updateWorkshop(id: number, data: WorkshopFormData) {
  const sql = getDB();
  const current = await getWorkshopById(id);
  if (!current) return null;
  const slug = data.title === current.title ? current.slug : await uniqueSlugFor(data.title, id);

  const rows = await withRetry(() =>
    sql`
      UPDATE workshops SET
        slug = ${slug},
        title = ${data.title},
        description = ${data.description || null},
        venue = ${data.venue},
        event_date = ${data.eventDate},
        banner_url = ${data.bannerUrl || null},
        status = ${data.status}
      WHERE id = ${id}
      RETURNING *
    `
  );
  return rows[0] || null;
}

export async function deleteWorkshop(id: number) {
  const sql = getDB();
  const rows = await withRetry(() => sql`DELETE FROM workshops WHERE id = ${id} RETURNING id`);
  return rows[0] || null;
}

// ─── Registrations ──────────────────────────────────────────────────────────

export async function createWorkshopRegistration(
  workshopId: number,
  data: { fullName: string; email: string; phone: string; year: string; course: string; department: string }
) {
  const sql = getDB();

  // event_date::text avoids Postgres DATE -> JS Date -> toISOString() round
  // trip, which can shift the calendar day by the server's local UTC offset —
  // that would corrupt the DDMMYY baked into the student ID below.
  const wRows = await withRetry(() =>
    sql`SELECT title, event_date::text AS event_date FROM workshops WHERE id = ${workshopId}`
  );
  const workshop = wRows[0];
  if (!workshop) throw new Error('Workshop not found.');

  const countRows = await withRetry(() =>
    sql`SELECT COUNT(*)::int AS count FROM workshop_registrations WHERE workshop_id = ${workshopId}`
  );
  let seq = (countRows[0] as { count: number }).count + 1;

  // Sequence numbers only collide if a concurrent registration lands between
  // the count above and this insert — retry with the next seq rather than
  // let a fluke UNIQUE violation on pass_code surface as a 500.
  let lastErr: unknown;
  for (let attempt = 0; attempt < 10; attempt++) {
    const studentId = generateWorkshopStudentId(workshop.title, workshop.event_date, seq);
    try {
      const rows = await withRetry(() =>
        sql`
          INSERT INTO workshop_registrations (
            workshop_id, pass_code, full_name, email, phone, year, course, department
          ) VALUES (
            ${workshopId}, ${studentId}, ${data.fullName}, ${data.email}, ${data.phone},
            ${data.year}, ${data.course}, ${data.department || null}
          )
          RETURNING *
        `
      );
      return rows[0];
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : '';
      if (!msg.includes('pass_code')) throw err; // not a student-ID collision — surface immediately
      seq += 1;
    }
  }
  throw lastErr;
}

const SEARCH_COLUMNS = ['full_name', 'email', 'pass_code', 'phone'];

function buildRegFilter(workshopId: number, status: string, search: string): { whereClause: string; values: any[] } {
  const conditions: string[] = [`workshop_id = $1`];
  const values: any[] = [workshopId];

  if (status && status !== 'all') {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }
  if (search && search.trim()) {
    values.push(`%${search.trim()}%`);
    const idx = values.length;
    conditions.push(`(${SEARCH_COLUMNS.map((col) => `${col} ILIKE $${idx}`).join(' OR ')})`);
  }

  return { whereClause: `WHERE ${conditions.join(' AND ')}`, values };
}

export async function getWorkshopRegistrationsList(workshopId: number, params: WorkshopRegListParams) {
  const sql = getDB();
  const sortBy = (WORKSHOP_REG_SORT_COLUMNS as readonly string[]).includes(params.sortBy) ? params.sortBy : 'created_at';
  const sortDir = params.sortDir === 'asc' ? 'ASC' : 'DESC';
  const { whereClause, values } = buildRegFilter(workshopId, params.status, params.search);

  const countRows = await withRetry(() =>
    sql(`SELECT COUNT(*)::int AS total FROM workshop_registrations ${whereClause}`, values)
  );
  const total = (countRows[0] as { total: number }).total;

  const limitIdx = values.length + 1;
  const offsetIdx = values.length + 2;
  const rows = await withRetry(() =>
    sql(
      `SELECT * FROM workshop_registrations ${whereClause}
       ORDER BY ${sortBy} ${sortDir}
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      [...values, params.pageSize, (params.page - 1) * params.pageSize]
    )
  );

  return { rows, total };
}

export async function getAllMatchingWorkshopRegistrations(workshopId: number, status: string, search: string) {
  const sql = getDB();
  const { whereClause, values } = buildRegFilter(workshopId, status, search);
  return withRetry(() =>
    sql(`SELECT * FROM workshop_registrations ${whereClause} ORDER BY created_at DESC`, values)
  );
}

export async function getWorkshopRegistrationStats(workshopId: number): Promise<WorkshopRegistrationStats> {
  const sql = getDB();
  const rows = await withRetry(() =>
    sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE)::int AS today,
        COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
        COUNT(*) FILTER (WHERE status = 'approved')::int AS approved,
        COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected,
        COUNT(*) FILTER (WHERE checked_in_at IS NOT NULL)::int AS "checkedIn"
      FROM workshop_registrations
      WHERE workshop_id = ${workshopId}
    `
  );
  return rows[0] as WorkshopRegistrationStats;
}

export async function getWorkshopOverallStats() {
  const sql = getDB();
  const rows = await withRetry(() =>
    sql`
      SELECT
        (SELECT COUNT(*) FROM workshops)::int AS "totalWorkshops",
        (SELECT COUNT(*) FROM workshops WHERE status = 'published' AND event_date >= CURRENT_DATE)::int AS "upcoming",
        (SELECT COUNT(*) FROM workshop_registrations)::int AS "totalRegistrations",
        (SELECT COUNT(*) FROM workshop_registrations WHERE created_at::date = CURRENT_DATE)::int AS "today",
        (SELECT COUNT(*) FROM workshop_registrations WHERE status = 'pending')::int AS "pendingApprovals",
        (SELECT COUNT(*) FROM workshop_registrations WHERE checked_in_at IS NOT NULL)::int AS "checkedIn"
    `
  );
  return rows[0];
}

const UPDATABLE_REG_COLUMNS = ['full_name', 'email', 'phone', 'year', 'course', 'department', 'status'];

export async function updateWorkshopRegistration(id: number, fields: Record<string, any>) {
  const sql = getDB();
  const { checked_in, ...rest } = fields;
  const keys = Object.keys(rest).filter((k) => UPDATABLE_REG_COLUMNS.includes(k));

  if (checked_in === true) {
    keys.push('checked_in_at');
    (rest as any).checked_in_at = new Date().toISOString();
  } else if (checked_in === false) {
    keys.push('checked_in_at');
    (rest as any).checked_in_at = null;
  }

  if (keys.length === 0) return getWorkshopRegistrationById(id);

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const values = keys.map((key) => (rest as any)[key]);
  values.push(id);

  const rows = await withRetry(() =>
    sql(`UPDATE workshop_registrations SET ${setClause} WHERE id = $${values.length} RETURNING *`, values)
  );
  return rows[0] || null;
}

export async function getWorkshopRegistrationById(id: number) {
  const sql = getDB();
  const rows = await withRetry(() => sql`SELECT * FROM workshop_registrations WHERE id = ${id}`);
  return rows[0] || null;
}

export async function deleteWorkshopRegistration(id: number) {
  const sql = getDB();
  const rows = await withRetry(() => sql`DELETE FROM workshop_registrations WHERE id = ${id} RETURNING id`);
  return rows[0] || null;
}

// Joined lookup for the public pass page — needs the event's name/venue/date
// alongside the registrant's own details.
export async function getWorkshopPassData(id: number) {
  const sql = getDB();
  const rows = await withRetry(() =>
    sql`
      SELECT
        r.*,
        w.title AS workshop_title,
        w.venue AS workshop_venue,
        w.event_date AS workshop_event_date
      FROM workshop_registrations r
      JOIN workshops w ON w.id = r.workshop_id
      WHERE r.id = ${id}
    `
  );
  return rows[0] || null;
}
