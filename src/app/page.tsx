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

const features = [
  {
    num: '01',
    title: 'Instant ID Card',
    desc: 'Upon successful registration, receive your official temporary employee ID card immediately.',
  },
  {
    num: '02',
    title: 'Verified Status',
    desc: 'Your application is reviewed and your intern status is formally acknowledged.',
  },
  {
    num: '03',
    title: 'Real Experience',
    desc: 'Work on live projects alongside senior professionals in a collaborative studio environment.',
  },
  {
    num: '04',
    title: 'Portfolio Ready',
    desc: 'Leave with tangible work samples, a professional reference, and certified experience.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-border bg-bg/80 backdrop-blur-md">
        <span className="font-syne font-bold text-[11px] tracking-[0.25em] uppercase text-ink">
          Intellect Studio
        </span>
        <div className="flex items-center gap-6">
          <span className="hidden md:block font-mono text-[10px] text-ink-3 tracking-widest uppercase">
            Intern Portal · 2024
          </span>
          <Link href="/register">
            <button className="btn-primary text-xs px-5 py-2.5">
              Apply Now →
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-28 px-6 md:px-10 max-w-7xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.p variants={item} className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-10">
            Applications Open · Cohort 2024
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
            Join our creative & technical studio as an intern. Complete the application
            below and receive your temporary employee ID card — instantly, no waiting.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4 items-center">
            <Link href="/register">
              <button className="btn-primary group flex items-center gap-3">
                Begin Application
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </Link>
            <div className="flex items-center gap-2 text-ink-3">
              <span className="font-mono text-[10px] tracking-widest">~5 MIN</span>
              <span className="text-ink-4">·</span>
              <span className="font-mono text-[10px] tracking-widest">FREE</span>
              <span className="text-ink-4">·</span>
              <span className="font-mono text-[10px] tracking-widest">INSTANT ID</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Ticker */}
      <div className="border-y border-border bg-ink overflow-hidden py-4">
        <div className="flex gap-0 w-max animate-ticker">
          {[...departments, ...departments].map((d, i) => (
            <span key={i} className="font-syne text-[11px] font-semibold tracking-widest uppercase text-white/60 px-8 shrink-0">
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {features.map((f) => (
              <motion.div
                key={f.num}
                variants={item}
                className="bg-bg p-8 flex flex-col gap-4 group hover:bg-white transition-colors duration-300"
              >
                <span className="font-mono text-[10px] tracking-widest text-ink-3">{f.num}</span>
                <h3 className="font-syne font-bold text-base text-ink">{f.title}</h3>
                <p className="text-xs text-ink-2 leading-relaxed font-sans">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats row */}
      <section className="border-t border-border py-16 px-6 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { val: '50+', label: 'Interns per cohort' },
            { val: '14', label: 'Departments' },
            { val: '3', label: 'Month program' },
            { val: '100%', label: 'Real projects' },
          ].map((s) => (
            <motion.div key={s.label} variants={item} className="text-center">
              <p className="font-syne font-black text-4xl md:text-5xl text-ink">{s.val}</p>
              <p className="mt-2 font-mono text-[10px] tracking-widest uppercase text-ink-3">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA section */}
      <section className="py-24 px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-7xl mx-auto border border-border bg-ink text-white p-12 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4">
              Ready to apply?
            </p>
            <h2 className="font-syne font-black text-3xl md:text-5xl leading-tight">
              Apply today.<br />Get your ID today.
            </h2>
          </div>
          <Link href="/register" className="shrink-0">
            <button className="bg-white text-ink px-8 py-4 font-syne font-bold text-sm tracking-wide hover:bg-white/90 transition-colors group flex items-center gap-3">
              Start Application
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-syne font-bold text-[11px] tracking-[0.25em] uppercase text-ink">
          Intellect Studio
        </span>
        <p className="font-mono text-[10px] text-ink-3 tracking-wider">
          © 2024 Intellect Studio. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
