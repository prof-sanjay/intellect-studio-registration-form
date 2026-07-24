import { SignJWT, jwtVerify } from 'jose';

export const ADMIN_COOKIE_NAME = 'admin_session';

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days, matches token expiry
};

function getSecretKey() {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      'JWT_SECRET is not configured. Create a .env.local file with:\n' +
      'JWT_SECRET=a_long_random_string\n\n' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"'
    );
  }
  return new TextEncoder().encode(process.env.JWT_SECRET);
}

export interface AdminTokenPayload {
  id: number;
  username: string;
}

export async function signAdminToken({ id, username }: AdminTokenPayload): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(id))
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey());
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload> {
  const { payload } = await jwtVerify(token, getSecretKey());
  return { id: Number(payload.sub), username: payload.username as string };
}
