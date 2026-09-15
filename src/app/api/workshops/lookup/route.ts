import { NextRequest, NextResponse } from 'next/server';
import { initWorkshopDB, getDB, withRetry } from '@/lib/db';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) { await initWorkshopDB(); dbInitialized = true; }
}

// Public lookup so a student can pull up their QR pass using only the
// student ID printed on it — no login involved, mirroring /api/intern/lookup.
export async function GET(req: NextRequest) {
  try {
    await ensureDB();
    const sql = getDB();

    const studentId = req.nextUrl.searchParams.get('studentId')?.trim();
    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required.' }, { status: 400 });
    }

    const rows = await withRetry(() =>
      sql`SELECT id FROM workshop_registrations WHERE UPPER(pass_code) = UPPER(${studentId})`
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: 'No registration found for this student ID.' }, { status: 404 });
    }

    return NextResponse.json({ id: rows[0].id });
  } catch (err) {
    console.error('[workshops/lookup] Error:', err);
    const msg = err instanceof Error ? err.message : 'Lookup failed.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
