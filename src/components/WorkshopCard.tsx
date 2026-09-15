'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';

export interface WorkshopCardData {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  venue: string;
  event_date: string;
  banner_url: string | null;
  registration_count: number;
}

export default function WorkshopCard({ workshop, index }: { workshop: WorkshopCardData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="card overflow-hidden group flex flex-col"
    >
      <div className="relative h-40 bg-ink overflow-hidden">
        {workshop.banner_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={workshop.banner_url}
            alt={workshop.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-syne font-black text-3xl text-white/10">WS</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1">
          <p className="font-mono text-[10px] tracking-widest uppercase text-ink">
            {new Date(workshop.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </p>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-3 mb-2">
          {workshop.venue}
        </p>
        <h3 className="font-syne font-bold text-lg text-ink leading-snug mb-2">{workshop.title}</h3>
        {workshop.description && (
          <p className="text-sm text-ink-2 font-sans leading-relaxed line-clamp-2 mb-4">
            {workshop.description}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-border">
          <p className="text-xs text-ink-3 font-mono">{formatDate(workshop.event_date)}</p>
        </div>

        <Link href={`/workshops/${workshop.slug}`} className="mt-4">
          <button className="btn-primary w-full text-xs">View & Register →</button>
        </Link>
      </div>
    </motion.div>
  );
}
