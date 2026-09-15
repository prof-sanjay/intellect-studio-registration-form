import Link from 'next/link';
import { notFound } from 'next/navigation';
import { initWorkshopDB } from '@/lib/db';
import { getWorkshopBySlug } from '@/lib/workshop-queries';
import { formatDate } from '@/lib/utils';
import WorkshopRegistrationForm from '@/components/WorkshopRegistrationForm';

export const dynamic = 'force-dynamic';

export default async function WorkshopRegisterPage({ params }: { params: { slug: string } }) {
  await initWorkshopDB();
  const workshop = await getWorkshopBySlug(params.slug) as any;
  if (!workshop || workshop.status !== 'published') notFound();

  return (
    <main className="min-h-screen bg-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-border bg-bg/80 backdrop-blur-md">
        <Link href={`/workshops/${workshop.slug}`}>
          <span className="font-syne font-bold text-[11px] tracking-[0.25em] uppercase text-ink hover:text-ink-2 transition-colors">
            ← {workshop.title}
          </span>
        </Link>
      </nav>

      <div className="pt-28 pb-24 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 text-center">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3">
              {formatDate(workshop.event_date)} · {workshop.venue}
            </p>
            <h1 className="font-syne font-black text-3xl md:text-4xl text-ink">
              Register for the Workshop
            </h1>
            <p className="mt-2 text-sm text-ink-2 font-sans">{workshop.title}</p>
          </div>

          <div className="card p-6 md:p-8">
            <WorkshopRegistrationForm slug={workshop.slug} />
          </div>
        </div>
      </div>
    </main>
  );
}
