'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import IDCard from '@/components/IDCard';

interface InternData {
  id: number;
  temp_emp_number: string;
  full_name: string;
  dob: string;
  department: string;
  phone: string;
  college: string;
  instagram?: string;
  year: string;
  course: string;
  address: string;
  email: string;
  photo_url?: string;
  portfolio_link?: string;
  created_at: string;
  status: string;
}

export default function IDCardPage({ params }: { params: { id: string } }) {
  const [intern, setIntern] = useState<InternData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/intern/${params.id}`);
        if (!res.ok) {
          const d = await res.json();
          if (!cancelled) setError(d.error || 'Not found');
          return;
        }
        const data = await res.json();
        if (!cancelled) setIntern(data);
      } catch {
        if (!cancelled) setError('Failed to load registration data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [params.id]);

  return (
    <main className="min-h-screen bg-bg">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-border bg-bg/80 backdrop-blur-md">
        <Link href="/">
          <span className="font-syne font-bold text-[11px] tracking-[0.25em] uppercase text-ink hover:text-ink-2 transition-colors">
            ← Intellect Studio
          </span>
        </Link>
      </nav>

      <div className="pt-28 pb-24 px-6 md:px-10">
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-ink rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3">
              Loading your ID card…
            </p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center">
            <p className="font-syne font-bold text-xl text-ink">Something went wrong</p>
            <p className="text-sm text-ink-2 font-sans">{error}</p>
            <Link href="/register">
              <button className="btn-primary">Start New Application →</button>
            </Link>
          </div>
        )}

        {intern && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-lg mx-auto"
          >
            {/* Success header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-12 h-12 bg-ink text-white flex items-center justify-center text-xl mx-auto mb-4"
              >
                ✓
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-2">
                  Application Received
                </p>
                <h1 className="font-syne font-black text-3xl text-ink">
                  Welcome, {intern.full_name.split(' ')[0]}.
                </h1>
                <p className="mt-2 text-sm text-ink-2 font-sans">
                  Your temporary employee ID has been generated.
                </p>
              </motion.div>
            </div>

            <IDCard intern={intern} />

            {/* Next steps */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-10 card p-6"
            >
              <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-4">Next Steps</p>
              <div className="space-y-3">
                {[
                  { num: '01', text: 'Download your ID card using the button above.' },
                  { num: '02', text: 'Our team will review your application within 2 business days.' },
                  { num: '03', text: `Watch your inbox at ${intern.email} for onboarding details.` },
                  { num: '04', text: 'Keep your employee number handy: ' + intern.temp_emp_number },
                ].map((s) => (
                  <div key={s.num} className="flex gap-4 items-start">
                    <span className="font-mono text-[10px] text-ink-3 shrink-0 mt-0.5">{s.num}</span>
                    <p className="text-sm text-ink-2 font-sans leading-relaxed">{s.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 text-center"
            >
              <Link href="/">
                <button className="btn-secondary text-xs">
                  ← Back to Home
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
