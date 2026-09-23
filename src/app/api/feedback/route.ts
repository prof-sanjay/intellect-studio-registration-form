import { NextRequest, NextResponse } from 'next/server';
import { initWorkshopDB, initWorkshopFeedbackDB, getDB, withRetry } from '@/lib/db';
import { workshopFeedbackSchema } from '@/lib/workshop-feedback-validations';
import { createWorkshopFeedback } from '@/lib/workshop-feedback-queries';
import { getWorkshopById } from '@/lib/workshop-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) {
    await initWorkshopDB();
    await initWorkshopFeedbackDB();
    dbInitialized = true;
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDB();

    const body = await req.json();
    const parsed = workshopFeedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }
    const data = parsed.data;

    const workshop = await getWorkshopById(data.workshopId);
    if (!workshop) {
      return NextResponse.json({ error: 'Workshop not found.' }, { status: 404 });
    }

    // One feedback response per register number, full stop — enforced by a DB
    // unique index — checked here first so we can return a clean 409 instead
    // of a raw constraint-violation error.
    const sql = getDB();
    const existing = await withRetry(() =>
      sql`SELECT id FROM workshop_feedback WHERE register_number = ${data.registerNumber}`
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'We already received feedback from this register number. Thank you!', code: 'DUPLICATE' },
        { status: 409 }
      );
    }

    const feedback = await createWorkshopFeedback(data.workshopId, data);
    return NextResponse.json({ id: feedback.id }, { status: 201 });
  } catch (err) {
    console.error('[feedback] Error:', err);
    const msg = err instanceof Error ? err.message : 'Feedback submission failed.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
