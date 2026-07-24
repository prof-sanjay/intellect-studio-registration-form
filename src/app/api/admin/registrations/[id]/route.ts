import { NextRequest, NextResponse } from 'next/server';
import { initDB, initAdminDB, getDB, withRetry } from '@/lib/db';
import { adminUpdateSchema } from '@/lib/admin-validations';
import { updateRegistration } from '@/lib/admin-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) {
    await initDB();
    await initAdminDB();
    dbInitialized = true;
  }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDB();
    const sql = getDB();

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const rows = await withRetry(() => sql`SELECT * FROM interns WHERE id = ${id}`);
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('[admin/registrations/id GET] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to load registration.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDB();
    const sql = getDB();

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const body = await req.json();
    const parsed = adminUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const fields = parsed.data;
    if (fields.email) {
      const existing = await withRetry(() =>
        sql`SELECT id FROM interns WHERE email = ${fields.email} AND id != ${id}`
      );
      if (existing.length > 0) {
        return NextResponse.json({ error: 'Another application already uses this email.' }, { status: 409 });
      }
    }

    const updated = await updateRegistration(id, fields);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[admin/registrations/id PUT] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to update registration.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDB();
    const sql = getDB();

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const rows = await withRetry(() => sql`DELETE FROM interns WHERE id = ${id} RETURNING id`);
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/registrations/id DELETE] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to delete registration.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
