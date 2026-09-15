'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';
import WorkshopPass, { type WorkshopPassData } from '@/components/WorkshopPass';

function PassSkeleton() {
  return (
    <div className="max-w-lg mx-auto animate-pulse">
      <div className="text-center mb-10">
        <div className="w-12 h-12 bg-border mx-auto mb-4" />
        <div className="h-2.5 w-32 bg-border mx-auto mb-3" />
        <div className="h-8 w-56 bg-border mx-auto mb-2" />
      </div>
      <div className="flex flex-col items-center gap-8">
        <div className="w-full max-w-md bg-ink/10" style={{ height: 220, borderRadius: 10 }} />
        <div className="h-11 w-56 bg-border" />
      </div>
    </div>
  );
}

export default function WorkshopPassPage({ params }: { params: { id: string } }) {
  const [pass, setPass] = useState<WorkshopPassData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/workshop-pass/${params.id}`);
        if (!res.ok) {
          const d = await res.json();
          if (!cancelled) setError(d.error || 'Not found');
          return;
        }
        const data = await res.json();
        if (!cancelled) setPass(data);
      } catch {
        if (!cancelled) setError('Failed to load your pass.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [params.id]);

  // The QR only certifies admin approval once its status is actually
  // "approved" — this lets the student re-check without a full page reload.
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/workshop-pass/${params.id}`);
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || 'Failed to refresh.');
        return;
      }
      const data = await res.json();
      setPass(data);
      setError(null);
      toast.success('Status updated.');
    } catch {
      toast.error('Failed to refresh. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-border bg-bg/80 backdrop-blur-md">
        <Link href="/">
          <span className="font-syne font-bold text-[11px] tracking-[0.25em] uppercase text-ink hover:text-ink-2 transition-colors">
            ← Intellect Studio
          </span>
        </Link>
        <Link href="/workshops" className="font-mono text-[10px] text-ink-3 tracking-widest uppercase hidden md:block hover:text-ink transition-colors">
          All Workshops →
        </Link>
      </nav>

      <div className="pt-28 pb-24 px-6 md:px-10">
        {loading && <PassSkeleton />}

        {error && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center">
            <p className="font-syne font-bold text-xl text-ink">Something went wrong</p>
            <p className="text-sm text-ink-2 font-sans">{error}</p>
            <Link href="/workshops">
              <button className="btn-primary">Browse Workshops →</button>
            </Link>
          </div>
        )}

        {pass && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-lg mx-auto"
          >
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-12 h-12 bg-ink text-white flex items-center justify-center text-xl mx-auto mb-4"
              >
                {pass.status === 'rejected' ? '✕' : '✓'}
              </motion.div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-2">
                {pass.status === 'approved' && 'Registration Approved'}
                {pass.status === 'pending' && 'Registration Received'}
                {pass.status === 'rejected' && 'Registration Rejected'}
              </p>
              <h1 className="font-syne font-black text-3xl text-ink">
                {pass.status === 'approved' && `You're in, ${pass.full_name.split(' ')[0]}.`}
                {pass.status === 'pending' && `Almost there, ${pass.full_name.split(' ')[0]}.`}
                {pass.status === 'rejected' && `Sorry, ${pass.full_name.split(' ')[0]}.`}
              </h1>
              <p className="mt-2 text-sm text-ink-2 font-sans">
                {pass.status === 'approved' && 'Your QR code is now valid — show this pass at the venue entrance.'}
                {pass.status === 'pending' && 'Your registration is awaiting admin approval. Check back here — this page always shows your latest status.'}
                {pass.status === 'rejected' && 'Your registration was not approved for this workshop.'}
              </p>
            </div>

            <WorkshopPass pass={pass} />

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="btn-secondary text-xs px-4 py-2.5 flex items-center gap-2 disabled:opacity-60"
              >
                <span className={refreshing ? 'inline-block animate-spin' : 'inline-block'}>⟳</span>
                {refreshing ? 'Refreshing…' : 'Refresh Status'}
              </button>
            </div>

            <div className="mt-8 text-center">
              <Link href="/workshops">
                <button className="btn-secondary text-xs">← Browse More Workshops</button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
