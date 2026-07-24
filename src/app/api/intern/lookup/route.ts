import { NextRequest, NextResponse } from 'next/server';
import { initDB, getDB, withRetry } from '@/lib/db';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) { await initDB(); dbInitialized = true; }
}

// Public lookup so applicants can find their own ID card page using only the
// temp_emp_number printed on their card — no login involved, matching the
// rest of the public registration flow.
export async function GET(req: NextRequest) {
  try {
    await ensureDB();
    const sql = getDB();

    const empNo = req.nextUrl.searchParams.get('empNo')?.trim();
    if (!empNo) {
      return NextResponse.json({ error: 'Employee number is required.' }, { status: 400 });
    }

    const rows = await withRetry(() =>
      sql`SELECT id FROM interns WHERE UPPER(temp_emp_number) = UPPER(${empNo})`
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: 'No application found for this employee number.' }, { status: 404 });
    }

    return NextResponse.json({ id: rows[0].id });
  } catch (err) {
    console.error('[intern/lookup] Error:', err);
    const msg = err instanceof Error ? err.message : 'Lookup failed.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
