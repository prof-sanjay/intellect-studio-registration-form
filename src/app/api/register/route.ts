import { NextRequest, NextResponse } from 'next/server';
import { initDB, getDB, withRetry } from '@/lib/db';
import { internSchema } from '@/lib/validations';
import { generateTempEmpNumber } from '@/lib/utils';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) { await initDB(); dbInitialized = true; }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDB();
    const sql = getDB();

    const body = await req.json();
    const parsed = internSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const data = parsed.data;

    const existing = await withRetry(() =>
      sql`SELECT id FROM interns WHERE email = ${data.email}`
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'An application with this email already exists.' },
        { status: 409 }
      );
    }

    let tempEmpNumber = generateTempEmpNumber();
    for (let i = 0; i < 10; i++) {
      const check = await withRetry(() =>
        sql`SELECT id FROM interns WHERE temp_emp_number = ${tempEmpNumber}`
      );
      if (check.length === 0) break;
      tempEmpNumber = generateTempEmpNumber();
    }

    const result = await withRetry(() =>
      sql`
        INSERT INTO interns (
          temp_emp_number, full_name, dob, department, phone, college,
          instagram, year, course, resume_url, address, email,
          photo_url, portfolio_link
        ) VALUES (
          ${tempEmpNumber}, ${data.fullName}, ${data.dob}, ${data.department},
          ${data.phone}, ${data.college}, ${data.instagram || null},
          ${data.year}, ${data.course}, ${data.resumeUrl || null},
          ${data.address}, ${data.email}, ${data.photoUrl || null},
          ${data.portfolioLink || null}
        )
        RETURNING id, temp_emp_number
      `
    );

    const intern = result[0];
    return NextResponse.json(
      { id: intern.id, tempEmpNumber: intern.temp_emp_number },
      { status: 201 }
    );
  } catch (err) {
    console.error('[register] Error:', err);
    const msg = err instanceof Error ? err.message : 'Registration failed.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
