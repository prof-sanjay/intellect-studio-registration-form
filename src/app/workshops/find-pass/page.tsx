'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import WorkshopIdLookup from '@/components/WorkshopIdLookup';

export default function FindWorkshopPassPage() {
  return (
    <main className="min-h-screen bg-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-border bg-bg/80 backdrop-blur-md">
        <Link href="/workshops">
          <span className="font-syne font-bold text-[11px] tracking-[0.25em] uppercase text-ink hover:text-ink-2 transition-colors">
            ← All Workshops
          </span>
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
              QR
            </div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3">
              Already Registered?
            </p>
            <h1 className="font-syne font-black text-3xl md:text-4xl text-ink leading-tight">
              Find Your <span className="text-ink-3">QR Pass.</span>
            </h1>
            <p className="mt-3 text-sm text-ink-2 font-sans leading-relaxed max-w-sm mx-auto">
              Enter the student ID you received after registering to pull up
              your QR pass and check your approval status.
            </p>
          </div>

          <div className="card p-8">
            <WorkshopIdLookup />
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-3 shrink-0">Or</p>
            <div className="h-px flex-1 bg-border" />
          </div>

          <p className="mt-6 text-center text-sm text-ink-3 font-sans">
            Haven&apos;t registered yet?{' '}
            <Link href="/workshops" className="text-ink underline hover:text-ink-2 transition-colors">
              Browse workshops →
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
