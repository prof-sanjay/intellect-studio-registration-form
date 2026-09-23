import WorkshopInterestForm from '@/components/WorkshopInterestForm';

export const dynamic = 'force-dynamic';

export default function InterestedPage() {
  return (
    <main className="min-h-screen bg-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-6 md:px-10 py-5 border-b border-border bg-bg/80 backdrop-blur-md">
        <span className="font-syne font-bold text-[11px] tracking-[0.25em] uppercase text-ink">
          Intellect Studios
        </span>
      </nav>

      <div className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          <div className="mb-8 text-center">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3">Tell us you&apos;re in</p>
            <h1 className="font-syne font-black text-2xl sm:text-3xl text-ink">Workshop Interest Form</h1>
          </div>

          <div className="card p-5 sm:p-8">
            <WorkshopInterestForm />
          </div>
        </div>
      </div>
    </main>
  );
}
