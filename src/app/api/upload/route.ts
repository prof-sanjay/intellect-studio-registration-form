import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_RESUME_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_RESUME_TYPES = ['application/pdf'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!type || !['photo', 'resume'].includes(type)) {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 });
    }

    const isPhoto = type === 'photo';
    const maxBytes = isPhoto ? MAX_PHOTO_BYTES : MAX_RESUME_BYTES;
    const allowedTypes = isPhoto ? ALLOWED_PHOTO_TYPES : ALLOWED_RESUME_TYPES;

    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `File too large. Max ${isPhoto ? '5' : '10'} MB allowed.` },
        { status: 400 }
      );
    }
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const uniqueName = `${type}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    await writeFile(path.join(uploadDir, uniqueName), buffer);

    return NextResponse.json({ url: `/uploads/${uniqueName}` });
  } catch (err) {
    console.error('[upload] Error:', err);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
