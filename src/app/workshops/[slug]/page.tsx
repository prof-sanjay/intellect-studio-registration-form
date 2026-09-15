import Link from 'next/link';
import { notFound } from 'next/navigation';
import { initWorkshopDB } from '@/lib/db';
import { getWorkshopBySlug } from '@/lib/workshop-queries';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function WorkshopDetailPage({ params }: { params: { slug: string } }) {
  await initWorkshopDB();
  const workshop = await getWorkshopBySlug(params.slug) as any;
  if (!workshop || workshop.status !== 'published') notFound();

  return (
    <main className="min-h-screen bg-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-border bg-bg/80 backdrop-blur-md">
        <Link href="/workshops">
          <span className="font-syne font-bold text-[11px] tracking-[0.25em] uppercase text-ink hover:text-ink-2 transition-colors">
            ← All Workshops
          </span>
        </Link>
      </nav>

      <div className="pt-28 pb-24 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          {workshop.banner_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={workshop.banner_url}
              alt={workshop.title}
              className="w-full h-56 object-cover border border-border mb-8"
            />
          )}

          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3">
            {workshop.venue}
          </p>
          <h1 className="font-syne font-black text-3xl md:text-4xl text-ink leading-tight mb-6">
            {workshop.title}
          </h1>

          <div className="card p-6 grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-1.5">Date</p>
              <p className="text-sm text-ink font-sans">{formatDate(workshop.event_date)}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-1.5">Venue</p>
              <p className="text-sm text-ink font-sans">{workshop.venue}</p>
            </div>
          </div>

          {workshop.description && (
            <div className="mb-10">
              <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-3">About this workshop</p>
              <p className="text-sm text-ink-2 font-sans leading-relaxed whitespace-pre-line">
                {workshop.description}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/workshops/${workshop.slug}/register`} className="flex-1">
              <button className="btn-primary w-full group flex items-center justify-center gap-3">
                Register Now
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </Link>
            <Link href="/workshops/find-pass" className="flex-1">
              <button className="btn-secondary w-full group flex items-center justify-center gap-3">
                Already Registered? Find My Pass
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
