'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const departments = [
  'UI/UX Design', 'Frontend Dev', 'Digital Marketing', 'Content Creation',
  'Graphic Design', 'Data Analytics', 'Brand Strategy', 'Video Production',
  'Backend Dev', 'AI/ML Research', 'Full Stack', 'Project Management',
];

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-border bg-bg/80 backdrop-blur-md">
        <span className="font-syne font-bold text-[11px] tracking-[0.25em] uppercase text-ink">
          Intellect Studio
        </span>
        <div className="flex items-center gap-3">
          <Link href="/workshops">
            <button className="btn-secondary text-xs px-5 py-2.5">Workshops →</button>
          </Link>
          <Link href="/register">
            <button className="btn-primary text-xs px-5 py-2.5">Internship →</button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-28 px-6 md:px-10 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.p variants={item} className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-10">
            Applications Open · 2026
          </motion.p>

          <motion.h1
            variants={item}
            className="font-syne font-black text-[clamp(3.5rem,10vw,9rem)] leading-[0.9] tracking-tighter text-ink"
          >
            INTELLECT
            <br />
            <span className="text-ink-3">STUDIO</span>
          </motion.h1>

          <motion.div variants={item} className="mt-10 flex items-center gap-6 max-w-xl">
            <div className="h-px flex-1 bg-border" />
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-3 shrink-0">
              Internship Portal
            </p>
            <div className="h-px flex-1 bg-border" />
          </motion.div>

          <motion.p variants={item} className="mt-8 max-w-md text-sm text-ink-2 font-sans leading-relaxed">
            Join our creative &amp; technical studio as an intern. Complete the application
            and receive your employee ID — instantly, no waiting.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4 items-center">
            <Link href="/workshops">
              <button className="btn-primary group flex items-center gap-3">
                Register for Workshops
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </Link>
            <Link href="/register">
              <button className="btn-secondary group flex items-center gap-3">
                Apply for Internship
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Ticker ─────────────────────────────────────────────────────────── */}
      <div className="border-t border-border bg-ink overflow-hidden py-4">
        <div className="flex gap-0 w-max animate-ticker">
          {[...departments, ...departments].map((d, i) => (
            <span key={i} className="font-syne text-[11px] font-semibold tracking-widest uppercase text-white/60 px-8 shrink-0">
              {d}
            </span>
          ))}
        </div>
      </div>

    </main>
  );
}
