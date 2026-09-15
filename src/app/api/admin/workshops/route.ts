import { NextRequest, NextResponse } from 'next/server';
import { initWorkshopDB } from '@/lib/db';
import { workshopSchema } from '@/lib/workshop-validations';
import { getAllWorkshopsAdmin, createWorkshop } from '@/lib/workshop-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) { await initWorkshopDB(); dbInitialized = true; }
}

export async function GET() {
  try {
    await ensureDB();
    const rows = await getAllWorkshopsAdmin();
    return NextResponse.json({ rows });
  } catch (err) {
    console.error('[admin/workshops GET] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to load workshops.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDB();
    const body = await req.json();
    const parsed = workshopSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }
    const workshop = await createWorkshop(parsed.data);
    return NextResponse.json(workshop, { status: 201 });
  } catch (err) {
    console.error('[admin/workshops POST] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to create workshop.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
