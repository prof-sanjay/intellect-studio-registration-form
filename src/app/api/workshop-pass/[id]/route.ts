import { NextRequest, NextResponse } from 'next/server';
import { initWorkshopDB } from '@/lib/db';
import { getWorkshopPassData } from '@/lib/workshop-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) { await initWorkshopDB(); dbInitialized = true; }
}

// Public lookup so a scanned QR code (or the registrant themselves) can pull up
// the pass with only its numeric id — same pattern as /api/intern/[id].
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDB();
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const pass = await getWorkshopPassData(id);
    if (!pass) return NextResponse.json({ error: 'Pass not found.' }, { status: 404 });

    return NextResponse.json(pass, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[workshop-pass] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to load pass.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
