import { NextRequest, NextResponse } from 'next/server';
import { initDB, getDB, withRetry } from '@/lib/db';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) { await initDB(); dbInitialized = true; }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDB();
    const sql = getDB();

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const rows = await withRetry(() =>
      sql`SELECT * FROM interns WHERE id = ${id}`
    );
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // No caching: status (pending/approved/rejected) can change at any time via
    // the admin portal, and the applicant should see that change immediately
    // the next time they load this page, not up to 5 minutes later.
    return NextResponse.json(rows[0], {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    console.error('[intern/id] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to load data.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
