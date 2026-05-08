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

const portalFeatures = [
  { num: '01', title: 'Instant ID Card', desc: 'Upon successful registration, receive your official temporary employee ID card immediately.' },
  { num: '02', title: 'Verified Status', desc: 'Your application is reviewed and your intern status is formally acknowledged.' },
  { num: '03', title: 'Mentorship', desc: 'Work alongside senior professionals who guide your growth through every project milestone.' },
  { num: '04', title: 'Portfolio Ready', desc: 'Leave with tangible work samples, a professional reference, and certified experience.' },
];

const internBenefits = [
  {
    index: '01',
    label: 'Internship Duration',
    highlight: '2–6 Months',
    sub: 'Flexible Timeline',
    desc: 'Choose a programme length that fits your academic calendar — from focused summer sprints to full-semester deep dives.',
  },
  {
    index: '02',
    label: 'Upon Completion',
    highlight: 'Certified + Projects',
    sub: 'Certificate & Live Work',
    desc: 'Walk away with an official completion certificate and a portfolio of real work you shipped with our team for actual clients.',
  },
  {
    index: '03',
    label: 'From Day One',
    highlight: 'Real-Time Work',
    sub: 'Industry-Grade Experience',
    desc: 'No mock assignments. You work on live client briefs with real deadlines, mentored by specialists who\'ve delivered for global brands.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-border bg-bg/80 backdrop-blur-md">
        <span className="font-syne font-bold text-[11px] tracking-[0.25em] uppercase text-ink">
          Intellect Studio
        </span>
        <div className="flex items-center gap-6">
          <span className="hidden md:block font-mono text-[10px] text-ink-3 tracking-widest uppercase">
            Intern Enrollment · 2025
          </span>
          <Link href="/register">
            <button className="btn-primary text-xs px-5 py-2.5">Apply Now →</button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-28 px-6 md:px-10 max-w-7xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.p variants={item} className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-10">
            Applications Open · 2025
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

      {/* ── Ticker ─────────────────────────────────────────────────────────── */}
      <div className="border-y border-border bg-ink overflow-hidden py-4">
        <div className="flex gap-0 w-max animate-ticker">
          {[...departments, ...departments].map((d, i) => (
            <span key={i} className="font-syne text-[11px] font-semibold tracking-widest uppercase text-white/60 px-8 shrink-0">
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* ── About ──────────────────────────────────────────────────────────── */}
      <section id="about" className="py-28 border-b border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start"
          >
            {/* Left column */}
            <div>
              <motion.p variants={item} className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-8">
                About the Studio
              </motion.p>
              <motion.h2
                variants={item}
                className="font-syne font-black text-[clamp(3rem,7vw,5.5rem)] leading-[0.88] tracking-tighter text-ink"
              >
                WE BUILD
                <br />
                <span className="text-ink-3">CAREERS.</span>
              </motion.h2>

              <motion.div variants={item} className="mt-12 grid grid-cols-3 gap-0 border border-border">
                {[
                  { val: '2019', label: 'Founded' },
                  { val: '500+', label: 'Interns placed' },
                  { val: '14', label: 'Departments' },
                ].map((s, i) => (
                  <div
                    key={s.label}
                    className={`px-5 py-6 text-center ${i < 2 ? 'border-r border-border' : ''}`}
                  >
                    <p className="font-syne font-black text-2xl md:text-3xl text-ink">{s.val}</p>
                    <p className="font-mono text-[9px] tracking-widest uppercase text-ink-3 mt-1.5">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right column */}
            <motion.div variants={item} className="space-y-6 lg:pt-20">
              <p className="text-base text-ink-2 font-sans leading-[1.8]">
                Intellect Studio is a full-service creative and technology studio built for ambitious ideas.
                We partner with brands, startups, and enterprises to design, build, and launch exceptional
                digital experiences — from brand identity to scalable web products.
              </p>
              <p className="text-base text-ink-2 font-sans leading-[1.8]">
                Our internship programme is central to how we grow — both our team and the next generation
                of creative professionals. Every intern works on live briefs with real stakes, mentored by
                specialists who have delivered work for global clients.
              </p>

              <div className="space-y-5 pt-4">
                {[
                  {
                    label: 'Our Mission',
                    text: 'To bridge the gap between education and industry through hands-on creative and technical work.',
                  },
                  {
                    label: 'Our Vision',
                    text: 'A studio where every young mind finds their professional identity and leaves better than they arrived.',
                  },
                ].map((v) => (
                  <div key={v.label} className="border-l-2 border-ink pl-5">
                    <p className="font-syne font-bold text-[11px] tracking-widest uppercase text-ink mb-1.5">{v.label}</p>
                    <p className="text-sm text-ink-2 font-sans leading-relaxed">{v.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Internship Benefits ────────────────────────────────────────────── */}
      <section className="bg-ink py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div variants={item} className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-4">
                  Why Join Us
                </p>
                <h2 className="font-syne font-black text-4xl md:text-6xl text-white leading-[0.92] tracking-tight">
                  What you
                  <br />
                  <span className="text-white/30">get.</span>
                </h2>
              </div>
              <Link href="/register" className="shrink-0">
                <button className="border border-white/20 text-white text-xs font-syne font-semibold tracking-widest uppercase px-6 py-3 hover:border-white/50 hover:bg-white/5 transition-all duration-200">
                  Apply Now →
                </button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 border border-white/10">
              {internBenefits.map((b) => (
                <motion.div
                  key={b.index}
                  variants={item}
                  className="relative p-8 md:p-10 group hover:bg-white/[0.03] transition-colors duration-300 overflow-hidden"
                >
                  {/* Ghost number */}
                  <span className="absolute -bottom-4 -right-2 font-syne font-black text-[9rem] leading-none text-white/[0.03] select-none pointer-events-none">
                    {b.index}
                  </span>

                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/25 mb-8">
                    {b.index} · {b.label}
                  </p>

                  <p className="font-syne font-black text-3xl md:text-4xl text-white leading-tight mb-2">
                    {b.highlight}
                  </p>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-white/30 mb-5">
                    {b.sub}
                  </p>

                  <div className="w-8 h-px bg-white/20 mb-5" />

                  <p className="text-sm text-white/45 font-sans leading-relaxed">
                    {b.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Portal Features grid ───────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p variants={item} className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-12">
            How the portal works
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {portalFeatures.map((f) => (
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

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
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
            { val: '6', label: 'Max months' },
            { val: '100%', label: 'Real projects' },
          ].map((s) => (
            <motion.div key={s.label} variants={item} className="text-center">
              <p className="font-syne font-black text-4xl md:text-5xl text-ink">{s.val}</p>
              <p className="mt-2 font-mono text-[10px] tracking-widest uppercase text-ink-3">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
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

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 pb-12 border-b border-white/10">

            {/* Brand */}
            <div className="space-y-5">
              <div>
                <p className="font-syne font-black text-[11px] tracking-[0.3em] uppercase text-white mb-3">
                  Intellect Studio
                </p>
                <p className="text-sm text-white/40 font-sans leading-relaxed">
                  A creative &amp; technical studio shaping the next generation of digital professionals through real-world work.
                </p>
              </div>
              <Link href="/register">
                <button className="mt-2 border border-white/20 text-white text-[11px] font-syne font-semibold tracking-widest uppercase px-5 py-2.5 hover:border-white/50 hover:bg-white/5 transition-all duration-200">
                  Apply for Internship →
                </button>
              </Link>
            </div>

            {/* Contact */}
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/30 mb-7">
                Contact Us
              </p>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <span className="text-white/25 mt-0.5 text-base shrink-0">✉</span>
                  <div>
                    <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-1">Email</p>
                    <a
                      href="mailto:hello@intellect.studio"
                      className="text-sm text-white/65 font-sans hover:text-white transition-colors duration-200"
                    >
                      hello@intellect.studio
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-white/25 mt-0.5 text-base shrink-0">✆</span>
                  <div>
                    <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-1">Phone</p>
                    <a
                      href="tel:+919876543210"
                      className="text-sm text-white/65 font-sans hover:text-white transition-colors duration-200"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-white/25 mt-0.5 text-base shrink-0">◎</span>
                  <div>
                    <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-1">Office Hours</p>
                    <p className="text-sm text-white/65 font-sans">
                      Mon – Sat, 9:00 AM – 6:00 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/30 mb-7">
                Our Office
              </p>
              <div className="flex items-start gap-4">
                <span className="text-white/25 mt-1 text-base shrink-0">⌖</span>
                <address className="not-italic text-sm text-white/65 font-sans leading-[1.9]">
                  42, Creative Hub,<br />
                  Koramangala 5th Block,<br />
                  Bengaluru, Karnataka<br />
                  India — 560 095
                </address>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 space-y-2">
                {[
                  { label: 'Internship Portal', href: '/register' },
                  { label: 'About the Studio', href: '#about' },
                ].map((l) => (
                  <div key={l.label}>
                    <Link href={l.href} className="font-mono text-[10px] tracking-widest uppercase text-white/35 hover:text-white/70 transition-colors duration-200">
                      {l.label} →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-mono text-[10px] text-white/20 tracking-wider">
              © 2025 Intellect Studio. All rights reserved.
            </p>
            <p className="font-mono text-[10px] text-white/20 tracking-wider">
              Intern Portal · Cohort 2025
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
