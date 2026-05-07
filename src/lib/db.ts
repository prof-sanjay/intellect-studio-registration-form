import { neon } from '@neondatabase/serverless';

export function getDB() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not configured. Create a .env.local file with:\n' +
      'DATABASE_URL=your_neon_connection_string\n\n' +
      'Get your connection string from: https://console.neon.tech'
    );
  }
  return neon(process.env.DATABASE_URL);
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
