import { NextResponse } from 'next/server';
import { initDB, initAdminDB, initWorkshopDB } from '@/lib/db';
import { getRegistrationStats } from '@/lib/admin-queries';
import { getWorkshopOverallStats } from '@/lib/workshop-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) {
    await initDB();
    await initAdminDB();
    await initWorkshopDB();
    dbInitialized = true;
  }
}

export async function GET() {
  try {
    await ensureDB();
    const [stats, workshopStats] = await Promise.all([
      getRegistrationStats(),
      getWorkshopOverallStats(),
    ]);
    return NextResponse.json({ ...stats, workshops: workshopStats });
  } catch (err) {
    console.error('[admin/stats] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to load stats.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
