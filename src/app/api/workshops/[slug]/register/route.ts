import { NextRequest, NextResponse } from 'next/server';
import { initWorkshopDB } from '@/lib/db';
import { workshopRegistrationSchema } from '@/lib/workshop-validations';
import { getWorkshopBySlug, createWorkshopRegistration } from '@/lib/workshop-queries';
import { getDB, withRetry } from '@/lib/db';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) { await initWorkshopDB(); dbInitialized = true; }
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await ensureDB();

    const workshop = await getWorkshopBySlug(params.slug);
    if (!workshop || (workshop as any).status !== 'published') {
      return NextResponse.json({ error: 'This workshop is not open for registration.' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = workshopRegistrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }
    const data = parsed.data;

    // One registration per email per workshop, enforced by a DB unique
    // constraint — checked here first so we can return a clean 409 instead of
    // a raw constraint-violation error.
    const sql = getDB();
    const existing = await withRetry(() =>
      sql`SELECT id FROM workshop_registrations WHERE workshop_id = ${(workshop as any).id} AND email = ${data.email}`
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'This email has already registered for this workshop.' },
        { status: 409 }
      );
    }

    const registration = await createWorkshopRegistration((workshop as any).id, data);
    return NextResponse.json({ id: registration.id, passCode: registration.pass_code }, { status: 201 });
  } catch (err) {
    console.error('[workshops/register] Error:', err);
    const msg = err instanceof Error ? err.message : 'Registration failed.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
