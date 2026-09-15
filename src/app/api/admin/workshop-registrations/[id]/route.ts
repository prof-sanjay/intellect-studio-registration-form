import { NextRequest, NextResponse } from 'next/server';
import { initWorkshopDB, getDB, withRetry } from '@/lib/db';
import { adminWorkshopRegUpdateSchema } from '@/lib/workshop-validations';
import { updateWorkshopRegistration, deleteWorkshopRegistration } from '@/lib/workshop-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) { await initWorkshopDB(); dbInitialized = true; }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDB();
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const body = await req.json();
    const parsed = adminWorkshopRegUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const fields = parsed.data;
    if (fields.email) {
      const sql = getDB();
      const current = await withRetry(() => sql`SELECT workshop_id FROM workshop_registrations WHERE id = ${id}`);
      if (current.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      const existing = await withRetry(() =>
        sql`SELECT id FROM workshop_registrations WHERE workshop_id = ${current[0].workshop_id} AND email = ${fields.email} AND id != ${id}`
      );
      if (existing.length > 0) {
        return NextResponse.json({ error: 'Another registration already uses this email for this event.' }, { status: 409 });
      }
    }

    const updated = await updateWorkshopRegistration(id, fields);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error('[admin/workshop-registrations/id PUT] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to update registration.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDB();
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const deleted = await deleteWorkshopRegistration(id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/workshop-registrations/id DELETE] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to delete registration.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
