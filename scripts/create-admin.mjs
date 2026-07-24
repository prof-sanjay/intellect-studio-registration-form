// One-off CLI script to seed the first admin account. There is no admin
// signup UI/API by design — only admins should ever be created, and this
// keeps account creation off the public network surface entirely.
//
// Usage: node scripts/create-admin.mjs <username> <password>
// Requires DATABASE_URL to be set in the environment (e.g. via
// `node --env-file=.env.local scripts/create-admin.mjs <username> <password>`).

import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const [, , username, password] = process.argv;

if (!username || !password) {
  console.error('Usage: node scripts/create-admin.mjs <username> <password>');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Set it in your shell or pass --env-file=.env.local.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`;

const existing = await sql`SELECT id FROM admins WHERE username = ${username}`;
if (existing.length > 0) {
  console.error(`Admin "${username}" already exists.`);
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);
await sql`INSERT INTO admins (username, password_hash) VALUES (${username}, ${passwordHash})`;

console.log(`Admin "${username}" created successfully.`);
