'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
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
        <Link href="/register">
          <button className="btn-secondary text-xs px-5 py-2.5">Apply Now →</button>
        </Link>
      </nav>

      <div className="min-h-screen flex items-center justify-center px-6 md:px-10 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <div className="w-12 h-12 border border-ink/20 text-ink flex items-center justify-center mx-auto mb-6 font-syne font-black text-sm">
              ID
            </div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3">
              Already Applied?
            </p>
            <h1 className="font-syne font-black text-3xl md:text-4xl text-ink leading-tight">
              Find Your <span className="text-ink-3">ID Card.</span>
            </h1>
            <p className="mt-3 text-sm text-ink-2 font-sans leading-relaxed max-w-sm mx-auto">
              Enter the temporary employee number you received after registering
              to pull up your ID card and application status.
            </p>
          </div>

          <div className="card p-8">
            <EmployeeLookup />
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-3 shrink-0">Or</p>
            <div className="h-px flex-1 bg-border" />
          </div>

          <p className="mt-6 text-center text-sm text-ink-3 font-sans">
            Haven&apos;t applied yet?{' '}
            <Link href="/register" className="text-ink underline hover:text-ink-2 transition-colors">
              Start your application →
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
