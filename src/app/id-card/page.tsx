import Link from 'next/link';
import EmployeeLookup from '@/components/EmployeeLookup';

export default function FindIdCardPage() {
  return (
    <main className="min-h-screen bg-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-border bg-bg/80 backdrop-blur-md">
        <Link href="/">
          <span className="font-syne font-bold text-[11px] tracking-[0.25em] uppercase text-ink hover:text-ink-2 transition-colors">
            ← Intellect Studio
          </span>
        </Link>
      </nav>

      <div className="pt-28 pb-24 px-6 md:px-10 flex flex-col items-center">
        <div className="text-center mb-10 max-w-md">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3">
            Already Applied?
          </p>
          <h1 className="font-syne font-black text-3xl md:text-4xl text-ink">Find Your ID Card</h1>
          <p className="mt-2 text-sm text-ink-2 font-sans">
            Enter the temporary employee number you received after registering to view your ID card again.
          </p>
        </div>

        <EmployeeLookup />

        <p className="mt-8 text-sm text-ink-3 font-sans">
          Haven&apos;t applied yet?{' '}
          <Link href="/register" className="text-ink underline hover:text-ink-2">
            Start your application →
          </Link>
        </p>
      </div>
    </main>
  );
}
