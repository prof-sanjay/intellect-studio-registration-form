import { NextRequest, NextResponse } from 'next/server';
import { initDB, initAdminDB } from '@/lib/db';
import { getRegistrationsList } from '@/lib/admin-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) {
    await initDB();
    await initAdminDB();
    dbInitialized = true;
  }
}

export async function GET(req: NextRequest) {
  try {
    await ensureDB();
    const sp = req.nextUrl.searchParams;

    const page = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(sp.get('pageSize') || '20', 10) || 20));
    const search = sp.get('search') || '';
    const status = sp.get('status') || 'all';
    const sortBy = sp.get('sortBy') || 'created_at';
    const sortDir = sp.get('sortDir') === 'asc' ? 'asc' : 'desc';

    const { rows, total } = await getRegistrationsList({ page, pageSize, search, status, sortBy, sortDir });
    return NextResponse.json({ rows, total, page, pageSize });
  } catch (err) {
    console.error('[admin/registrations] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to load registrations.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
