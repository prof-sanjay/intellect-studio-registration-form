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

    return NextResponse.json(rows[0], {
      headers: { 'Cache-Control': 'private, max-age=300' },
    });
  } catch (err) {
    console.error('[intern/id] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to load data.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
