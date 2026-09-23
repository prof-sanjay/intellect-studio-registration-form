import { NextRequest, NextResponse } from 'next/server';
import { initWorkshopInterestDB } from '@/lib/db';
import { workshopInterestSchema } from '@/lib/workshop-interest-validations';
import { createWorkshopInterest } from '@/lib/workshop-interest-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) {
    await initWorkshopInterestDB();
    dbInitialized = true;
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDB();

    const body = await req.json();
    const parsed = workshopInterestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const interest = await createWorkshopInterest(parsed.data);
    return NextResponse.json({ id: interest.id }, { status: 201 });
  } catch (err) {
    console.error('[interest] Error:', err);
    const msg = err instanceof Error ? err.message : 'Submission failed.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
