import { NextRequest, NextResponse } from 'next/server';
import { initWorkshopDB } from '@/lib/db';
import { workshopSchema } from '@/lib/workshop-validations';
import { getWorkshopById, updateWorkshop, deleteWorkshop } from '@/lib/workshop-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) { await initWorkshopDB(); dbInitialized = true; }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDB();
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const workshop = await getWorkshopById(id);
    if (!workshop) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(workshop);
  } catch (err) {
    console.error('[admin/workshops/id GET] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to load workshop.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDB();
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const body = await req.json();
    const parsed = workshopSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const updated = await updateWorkshop(id, parsed.data);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error('[admin/workshops/id PUT] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to update workshop.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDB();
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const deleted = await deleteWorkshop(id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/workshops/id DELETE] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to delete workshop.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
