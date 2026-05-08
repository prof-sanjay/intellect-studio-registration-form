'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

function FormSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto animate-pulse">
      <div className="mb-10 flex justify-center">
        <div className="flex items-center">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div className="w-7 h-7 bg-border" />
              {i < 4 && <div className="w-8 md:w-14 h-px bg-border" />}
            </div>
          ))}
        </div>
      </div>

      <div className="h-2.5 w-36 bg-border mb-6" />
      <div className="h-7 w-44 bg-border mb-2" />
      <div className="h-4 w-60 bg-border mb-8" />

      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="mb-5">
          <div className="h-2.5 w-24 bg-border mb-2" />
          <div className="h-11 w-full bg-border" />
        </div>
      ))}

      <div className="mt-8 flex justify-end">
        <div className="h-11 w-32 bg-border" />
      </div>
    </div>
  );
}

const RegistrationForm = dynamic(() => import('@/components/RegistrationForm'), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-border bg-bg/80 backdrop-blur-md">
        <Link href="/">
          <span className="font-syne font-bold text-[11px] tracking-[0.25em] uppercase text-ink hover:text-ink-2 transition-colors">
            ← Intellect Studio
          </span>
        </Link>
        <span className="font-mono text-[10px] text-ink-3 tracking-widest uppercase hidden md:block">
          Internship Application
        </span>
      </nav>

      <div className="pt-28 pb-24 px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto"
        >
          <div className="mb-10 text-center">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3">
              Intellect Studio
            </p>
            <h1 className="font-syne font-black text-3xl md:text-4xl text-ink">
              Internship Application
            </h1>
            <p className="mt-2 text-sm text-ink-2 font-sans">
              Complete all steps to receive your temporary employee ID card.
            </p>
          </div>

          <RegistrationForm />
        </motion.div>
      </div>
    </main>
  );
}
