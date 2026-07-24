import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { initDB, initAdminDB, getDB, withRetry } from '@/lib/db';
import { adminLoginSchema } from '@/lib/admin-validations';
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_OPTIONS, signAdminToken } from '@/lib/auth';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) {
    await initDB();
    await initAdminDB();
    dbInitialized = true;
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDB();
    const sql = getDB();

    const body = await req.json();
    const parsed = adminLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 422 });
    }
    const { username, password } = parsed.data;

    const rows = await withRetry(() =>
      sql`SELECT id, username, password_hash FROM admins WHERE username = ${username}`
    );

    // Same error for unknown username vs. wrong password — don't leak which.
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const admin = rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash as string);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signAdminToken({ id: admin.id as number, username: admin.username as string });
    const res = NextResponse.json({ username: admin.username });
    res.cookies.set(ADMIN_COOKIE_NAME, token, ADMIN_COOKIE_OPTIONS);
    return res;
  } catch (err) {
    console.error('[admin/login] Error:', err);
    const msg = err instanceof Error ? err.message : 'Login failed.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
