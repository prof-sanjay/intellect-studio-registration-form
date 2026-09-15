import { NextRequest, NextResponse } from 'next/server';
import { initWorkshopDB } from '@/lib/db';
import { getAllMatchingWorkshopRegistrations, getWorkshopById } from '@/lib/workshop-queries';
import { slugify } from '@/lib/utils';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) { await initWorkshopDB(); dbInitialized = true; }
}

const EXPORT_COLUMNS: { key: string; label: string }[] = [
  { key: 'pass_code', label: 'Student ID' },
  { key: 'full_name', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'course', label: 'Course' },
  { key: 'department', label: 'Department' },
  { key: 'year', label: 'Year' },
  { key: 'status', label: 'Status' },
  { key: 'checked_in_at', label: 'Checked In At' },
  { key: 'created_at', label: 'Registered At' },
];

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

// Event-wise CSV export — one workshop's registrations at a time.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDB();
    const workshopId = parseInt(params.id, 10);
    if (isNaN(workshopId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const workshop = await getWorkshopById(workshopId);
    if (!workshop) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const sp = req.nextUrl.searchParams;
    const search = sp.get('search') || '';
    const status = sp.get('status') || 'all';

    const rows = await getAllMatchingWorkshopRegistrations(workshopId, status, search);
    const today = new Date().toISOString().slice(0, 10);
    const filenameBase = slugify((workshop as any).title) || `workshop-${workshopId}`;

    const header = EXPORT_COLUMNS.map((c) => csvEscape(c.label)).join(',');
    const lines = rows.map((row: any) => EXPORT_COLUMNS.map((c) => csvEscape(row[c.key])).join(','));
    const csv = [header, ...lines].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filenameBase}-registrations-${today}.csv"`,
      },
    });
  } catch (err) {
    console.error('[admin/workshops/id/registrations/export] Error:', err);
    const msg = err instanceof Error ? err.message : 'Export failed.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
