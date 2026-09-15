import { NextResponse } from 'next/server';
import { initWorkshopDB } from '@/lib/db';
import { getPublishedWorkshops } from '@/lib/workshop-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) { await initWorkshopDB(); dbInitialized = true; }
}

// Public endpoint — powers the /workshops listing page. Never hardcode events
// on the client; they always come from here.
export async function GET() {
  try {
    await ensureDB();
    const rows = await getPublishedWorkshops();
    return NextResponse.json({ rows }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[workshops] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to load workshops.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
