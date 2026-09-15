import Link from 'next/link';
import { initWorkshopDB } from '@/lib/db';
import { getPublishedWorkshops } from '@/lib/workshop-queries';
import WorkshopCard, { type WorkshopCardData } from '@/components/WorkshopCard';

export const dynamic = 'force-dynamic';

export default async function WorkshopsPage() {
  await initWorkshopDB();
  const workshops = (await getPublishedWorkshops()) as unknown as WorkshopCardData[];

  return (
    <main className="min-h-screen bg-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-border bg-bg/80 backdrop-blur-md">
        <Link href="/">
          <span className="font-syne font-bold text-[11px] tracking-[0.25em] uppercase text-ink hover:text-ink-2 transition-colors">
            ← Intellect Studio
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/workshops/find-pass" className="font-mono text-[10px] text-ink-3 tracking-widest uppercase hidden md:block hover:text-ink transition-colors">
            Already Registered? Find My QR Pass
          </Link>
          <Link href="/register" className="font-mono text-[10px] text-ink-3 tracking-widest uppercase hidden md:block hover:text-ink transition-colors">
            Apply for Internship →
          </Link>
        </div>
      </nav>

      <div className="pt-28 pb-24 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3">
              Intellect Studio
            </p>
            <h1 className="font-syne font-black text-4xl md:text-5xl text-ink">
              Upcoming <span className="text-ink-3">Workshops</span>
            </h1>
            <p className="mt-3 text-sm text-ink-2 font-sans max-w-md mx-auto">
              Register for a workshop and get your entry pass — complete with QR code —
              instantly.
            </p>
          </div>

          {workshops.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-ink-2 font-sans">No workshops are open for registration right now. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map((w, i) => (
                <WorkshopCard key={w.id} workshop={w} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
