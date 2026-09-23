import { NextRequest, NextResponse } from 'next/server';
import { initWorkshopInterestDB } from '@/lib/db';
import { deleteWorkshopInterest } from '@/lib/workshop-interest-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) {
    await initWorkshopInterestDB();
    dbInitialized = true;
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDB();
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const deleted = await deleteWorkshopInterest(id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/interest/id DELETE] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to delete response.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
