import { NextRequest, NextResponse } from 'next/server';
import { initWorkshopDB } from '@/lib/db';
import { getWorkshopRegistrationsList, getWorkshopRegistrationStats } from '@/lib/workshop-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) { await initWorkshopDB(); dbInitialized = true; }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDB();
    const workshopId = parseInt(params.id, 10);
    if (isNaN(workshopId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const sp = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(sp.get('pageSize') || '20', 10) || 20));
    const search = sp.get('search') || '';
    const status = sp.get('status') || 'all';
    const sortBy = sp.get('sortBy') || 'created_at';
    const sortDir = sp.get('sortDir') === 'asc' ? 'asc' : 'desc';

    const [{ rows, total }, stats] = await Promise.all([
      getWorkshopRegistrationsList(workshopId, { page, pageSize, search, status, sortBy, sortDir }),
      getWorkshopRegistrationStats(workshopId),
    ]);

    return NextResponse.json({ rows, total, page, pageSize, stats });
  } catch (err) {
    console.error('[admin/workshops/id/registrations] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to load registrations.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
