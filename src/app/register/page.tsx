'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import RegistrationForm from '@/components/RegistrationForm';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Navbar */}
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
