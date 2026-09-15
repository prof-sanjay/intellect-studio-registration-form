import { neon } from '@neondatabase/serverless';

export function getDB() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not configured. Create a .env.local file with:\n' +
      'DATABASE_URL=your_neon_connection_string\n\n' +
      'Get your connection string from: https://console.neon.tech'
    );
  }
  // Neon's driver issues its queries via `fetch()` under the hood, and
  // Next.js's App Router patches the global `fetch` to cache responses by
  // default. Without opting out here, admin actions (approve/reject/edit/
  // delete) can write successfully but subsequent reads on the same route
  // silently serve a cached pre-mutation snapshot instead of the fresh row.
  return neon(process.env.DATABASE_URL, { fetchOptions: { cache: 'no-store' } });
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelay = 500
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts - 1) {
        await new Promise((r) => setTimeout(r, baseDelay * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

export async function initDB() {
  const sql = getDB();
  await withRetry(() =>
    sql`
      CREATE TABLE IF NOT EXISTS interns (
        id SERIAL PRIMARY KEY,
        temp_emp_number VARCHAR(20) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        dob DATE NOT NULL,
        department VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        college VARCHAR(200) NOT NULL,
        instagram VARCHAR(100),
        year VARCHAR(20) NOT NULL,
        course VARCHAR(200) NOT NULL,
        resume_url TEXT,
        address TEXT NOT NULL,
        email VARCHAR(200) UNIQUE NOT NULL,
        photo_url TEXT,
        portfolio_link TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        status VARCHAR(20) DEFAULT 'pending'
      )
    `
  );
}

export async function initAdminDB() {
  const sql = getDB();
  await withRetry(() =>
    sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
  );
}

export async function initWorkshopDB() {
  const sql = getDB();
  await withRetry(() =>
    sql`
      CREATE TABLE IF NOT EXISTS workshops (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(220) UNIQUE NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        venue VARCHAR(200) NOT NULL,
        event_date DATE NOT NULL,
        banner_url TEXT,
        status VARCHAR(20) DEFAULT 'published',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
  );
  // Drop columns from an earlier schema revision — fee, capacity, and explicit
  // start/end times were removed as unneeded for how workshops are actually run.
  await withRetry(() =>
    sql`
      ALTER TABLE workshops
        DROP COLUMN IF EXISTS start_time,
        DROP COLUMN IF EXISTS end_time,
        DROP COLUMN IF EXISTS capacity,
        DROP COLUMN IF EXISTS fee
    `
  );
  await withRetry(() =>
    sql`
      CREATE TABLE IF NOT EXISTS workshop_registrations (
        id SERIAL PRIMARY KEY,
        workshop_id INTEGER NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
        pass_code VARCHAR(30) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(200) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        year VARCHAR(20) NOT NULL,
        course VARCHAR(200) NOT NULL,
        department VARCHAR(100),
        status VARCHAR(20) DEFAULT 'pending',
        checked_in_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(workshop_id, email)
      )
    `
  );
  // Registrations used to be auto-confirmed; the QR pass now certifies admin
  // approval, so every registration starts pending review instead.
  await withRetry(() => sql`ALTER TABLE workshop_registrations ALTER COLUMN status SET DEFAULT 'pending'`);
  await withRetry(() => sql`UPDATE workshop_registrations SET status = 'pending' WHERE status = 'confirmed'`);
  await withRetry(() => sql`UPDATE workshop_registrations SET status = 'rejected' WHERE status = 'cancelled'`);
  // College/university was dropped from the registration form — no longer collected.
  await withRetry(() => sql`ALTER TABLE workshop_registrations DROP COLUMN IF EXISTS college`);
}
