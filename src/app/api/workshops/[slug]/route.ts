import { NextRequest, NextResponse } from 'next/server';
import { initWorkshopDB } from '@/lib/db';
import { getWorkshopBySlug } from '@/lib/workshop-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) { await initWorkshopDB(); dbInitialized = true; }
}

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await ensureDB();
    const workshop = await getWorkshopBySlug(params.slug);
    if (!workshop || (workshop as any).status !== 'published') {
      return NextResponse.json({ error: 'Workshop not found.' }, { status: 404 });
    }
    return NextResponse.json(workshop, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[workshops/slug] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to load workshop.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
