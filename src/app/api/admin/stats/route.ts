import { NextResponse } from 'next/server';
import { initDB, initAdminDB } from '@/lib/db';
import { getRegistrationStats } from '@/lib/admin-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) {
    await initDB();
    await initAdminDB();
    dbInitialized = true;
  }
}

export async function GET() {
  try {
    await ensureDB();
    const stats = await getRegistrationStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error('[admin/stats] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to load stats.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
