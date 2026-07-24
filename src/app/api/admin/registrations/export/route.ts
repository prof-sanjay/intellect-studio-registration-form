import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { initDB, initAdminDB } from '@/lib/db';
import { getAllMatchingRegistrations } from '@/lib/admin-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) {
    await initDB();
    await initAdminDB();
    dbInitialized = true;
  }
}

const EXPORT_COLUMNS: { key: string; label: string }[] = [
  { key: 'temp_emp_number', label: 'Employee Number' },
  { key: 'full_name', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'college', label: 'Institution' },
  { key: 'course', label: 'Course' },
  { key: 'department', label: 'Department' },
  { key: 'year', label: 'Year' },
  { key: 'dob', label: 'Date of Birth' },
  { key: 'address', label: 'Address' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'portfolio_link', label: 'Portfolio Link' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Registration Date' },
];

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  try {
    await ensureDB();
    const sp = req.nextUrl.searchParams;
    const format = sp.get('format') === 'xlsx' ? 'xlsx' : 'csv';
    const search = sp.get('search') || '';
    const status = sp.get('status') || 'all';

    const rows = await getAllMatchingRegistrations(status, search);
    const today = new Date().toISOString().slice(0, 10);

    if (format === 'xlsx') {
      const sheetRows = rows.map((row: any) =>
        Object.fromEntries(EXPORT_COLUMNS.map((c) => [c.label, row[c.key] ?? '']))
      );
      const worksheet = XLSX.utils.json_to_sheet(sheetRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="registrations-${today}.xlsx"`,
        },
      });
    }

    const header = EXPORT_COLUMNS.map((c) => csvEscape(c.label)).join(',');
    const lines = rows.map((row: any) =>
      EXPORT_COLUMNS.map((c) => csvEscape(row[c.key])).join(',')
    );
    const csv = [header, ...lines].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="registrations-${today}.csv"`,
      },
    });
  } catch (err) {
    console.error('[admin/registrations/export] Error:', err);
    const msg = err instanceof Error ? err.message : 'Export failed.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
