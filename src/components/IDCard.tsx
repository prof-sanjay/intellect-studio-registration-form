'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { formatDateShort } from '@/lib/utils';

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

interface Props {
  intern: InternData;
}

export default function IDCard({ intern }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#000000',
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `${intern.temp_emp_number}-ID-Card.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      toast.success('ID card downloaded!');
    } catch {
      toast.error('Download failed. Try right-clicking to save the image.');
    } finally {
      setDownloading(false);
    }
  }, [intern.temp_emp_number]);

  const validUntil = () => {
    const d = new Date(intern.created_at);
    d.setMonth(d.getMonth() + 3);
    return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* The actual ID card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <div
          ref={cardRef}
          className="relative bg-black text-white overflow-hidden select-none"
          style={{ aspectRatio: '85.6/54', borderRadius: '6px' }}
        >
          {/* Subtle shimmer overlay */}
          <div className="absolute inset-0 id-card-shimmer pointer-events-none z-10" />

          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
              backgroundSize: '12px 12px',
            }}
          />

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-white/30 via-white/60 to-white/30" />

          <div className="relative z-20 h-full flex flex-col p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-syne font-black text-[8px] tracking-[0.3em] uppercase text-white/90">
                  Intellect Studio
                </p>
                <p className="font-mono text-[6px] tracking-[0.2em] uppercase text-white/40 mt-0.5">
                  Internship Pass · 2024
                </p>
              </div>
              <div className="border border-white/20 px-1.5 py-0.5">
                <p className="font-mono text-[6px] tracking-[0.15em] uppercase text-white/50">TEMP</p>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-center gap-3">
              {/* Photo */}
              <div
                className="shrink-0 bg-white/10 border border-white/20 overflow-hidden"
                style={{ width: 52, height: 60 }}
              >
                {intern.photo_url ? (
                  <img
                    src={intern.photo_url}
                    alt={intern.full_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white/20 text-xl">?</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-syne font-bold text-[10px] leading-tight text-white truncate">
                  {intern.full_name}
                </p>
                <p className="font-sans text-[7px] text-white/60 mt-0.5 truncate">{intern.department}</p>
                <p className="font-sans text-[7px] text-white/50 truncate">{intern.college}</p>
                <p className="font-sans text-[7px] text-white/40 mt-0.5 truncate">
                  {intern.course} · {intern.year}
                </p>

                {/* Emp number */}
                <div className="mt-2 border-t border-white/10 pt-1.5">
                  <p className="font-mono text-[8px] font-bold tracking-[0.15em] text-white/90">
                    {intern.temp_emp_number}
                  </p>
                  <p className="font-mono text-[6px] text-white/30 tracking-wider">
                    Valid until {validUntil()}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-2">
              <p className="font-mono text-[6px] tracking-widest uppercase text-white/25">
                intellect.studio
              </p>
              <div className="flex gap-0.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/20"
                    style={{
                      width: i % 3 === 0 ? 2 : 1,
                      height: i % 2 === 0 ? 8 : 6,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Download button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={handleDownload}
        disabled={downloading}
        className="btn-primary flex items-center gap-2 min-w-[180px] justify-center"
      >
        {downloading ? (
          <>
            <span className="animate-pulse">Generating…</span>
          </>
        ) : (
          <>
            ↓ Download ID Card
          </>
        )}
      </motion.button>

      {/* Details card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-sm card p-6 space-y-3"
      >
        <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3">Registration Details</p>
        {[
          { label: 'Employee No.', value: intern.temp_emp_number },
          { label: 'Name', value: intern.full_name },
          { label: 'Email', value: intern.email },
          { label: 'Department', value: intern.department },
          { label: 'College', value: intern.college },
          { label: 'Registered', value: formatDateShort(intern.created_at) },
          { label: 'Status', value: intern.status.toUpperCase() },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4 py-1.5 border-b border-border last:border-0">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-ink-3 font-syne shrink-0">
              {label}
            </span>
            <span className="text-sm text-ink font-sans text-right">{value}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
