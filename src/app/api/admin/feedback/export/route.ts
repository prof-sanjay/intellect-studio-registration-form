import { NextRequest, NextResponse } from 'next/server';
import { initWorkshopDB, initWorkshopFeedbackDB } from '@/lib/db';
import { getAllMatchingWorkshopFeedback } from '@/lib/workshop-feedback-queries';

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) {
    await initWorkshopDB();
    await initWorkshopFeedbackDB();
    dbInitialized = true;
  }
}

const EXPORT_COLUMNS: { key: string; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'register_number', label: 'Register Number' },
  { key: 'overall_rating', label: 'Overall Rating' },
  { key: 'content_relevance', label: 'Content Relevance' },
  { key: 'concept_clarity', label: 'Concept Clarity' },
  { key: 'hands_on_rating', label: 'Hands-on Rating' },
  { key: 'trainer_rating', label: 'Trainer Rating' },
  { key: 'future_topics', label: 'Future Topics' },
  { key: 'recommendation', label: 'Recommendation' },
  { key: 'improvement_suggestions', label: 'Improvement Suggestions' },
  { key: 'submitted_at', label: 'Submitted At' },
];

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function cellValue(row: any, key: string) {
  if (key === 'future_topics') {
    const topics: string[] = row.future_topics || [];
    return topics.map((t) => (t === 'Other' && row.other_topic ? `Other (${row.other_topic})` : t)).join('; ');
  }
  return row[key];
}

export async function GET(req: NextRequest) {
  try {
    await ensureDB();
    const sp = req.nextUrl.searchParams;
    const search = sp.get('search') || '';
    const workshopId = sp.get('workshop') || 'all';

    const rows = await getAllMatchingWorkshopFeedback(workshopId, search);
    const today = new Date().toISOString().slice(0, 10);

    const header = EXPORT_COLUMNS.map((c) => csvEscape(c.label)).join(',');
    const lines = rows.map((row: any) => EXPORT_COLUMNS.map((c) => csvEscape(cellValue(row, c.key))).join(','));
    const csv = [header, ...lines].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="workshop-feedback-${today}.csv"`,
      },
    });
  } catch (err) {
    console.error('[admin/feedback/export] Error:', err);
    const msg = err instanceof Error ? err.message : 'Export failed.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
