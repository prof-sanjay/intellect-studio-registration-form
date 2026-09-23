import { NextRequest, NextResponse } from 'next/server';
import { initWorkshopDB, initWorkshopFeedbackDB } from '@/lib/db';
import { deleteWorkshopFeedback } from '@/lib/workshop-feedback-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) {
    await initWorkshopDB();
    await initWorkshopFeedbackDB();
    dbInitialized = true;
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDB();
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const deleted = await deleteWorkshopFeedback(id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/feedback/id DELETE] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to delete feedback.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
