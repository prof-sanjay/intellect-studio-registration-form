'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

export interface WorkshopPassData {
  id: number;
  pass_code: string;
  full_name: string;
  email: string;
  phone: string;
  year: string;
  course: string;
  department: string | null;
  status: string;
  checked_in_at: string | null;
  created_at: string;
  workshop_title: string;
  workshop_venue: string;
  workshop_event_date: string;
}

const STATUS_CONFIG: Record<string, { label: string; text: string; border: string; bg: string }> = {
  pending: { label: 'Pending Approval', text: 'text-ink-2', border: 'border-ink-3/40', bg: 'bg-ink-3/5' },
  approved: { label: 'Approved', text: 'text-success', border: 'border-success/30', bg: 'bg-success/5' },
  rejected: { label: 'Rejected', text: 'text-error', border: 'border-error/30', bg: 'bg-error/5' },
};

export default function WorkshopPass({ pass }: { pass: WorkshopPassData }) {
  const passRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const statusInfo = STATUS_CONFIG[pass.status] || STATUS_CONFIG.pending;
  const isApproved = pass.status === 'approved';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const QRCode = (await import('qrcode')).default;
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const verifyText = `${origin}/workshop-pass/${pass.id} | ${pass.pass_code}`;
      const url = await QRCode.toDataURL(verifyText, {
        margin: 1,
        width: 800,
        errorCorrectionLevel: 'M',
        color: { dark: '#0C0C0A', light: '#FFFFFF' },
      });
      if (!cancelled) setQrDataUrl(url);
    })();
    return () => { cancelled = true; };
  }, [pass.id, pass.pass_code]);

  const handleDownload = async () => {
    if (!passRef.current || !qrDataUrl) return;
    setDownloading(true);
    let clone: HTMLElement | null = null;
    try {
      const el = passRef.current;
      const width = el.offsetWidth;
      const height = el.offsetHeight;

      clone = el.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.top = '-9999px';
      clone.style.left = '-9999px';
      clone.style.width = `${width}px`;
      clone.style.height = `${height}px`;
      document.body.appendChild(clone);

      const [html2canvas, { jsPDF }] = await Promise.all([
        import('html2canvas').then((m) => m.default),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        width,
        height,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdfWidth = 150; // mm
      const pdfHeight = (canvas.height / canvas.width) * pdfWidth;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${pass.pass_code}-pass.pdf`);
      toast.success('Pass downloaded!');
    } catch {
      toast.error('Download failed. Please try again.');
    } finally {
      if (clone) document.body.removeChild(clone);
      setDownloading(false);
    }
  };

  const DETAIL_ROWS: { label: string; value: string | null }[] = [
    { label: 'Student ID', value: pass.pass_code },
    { label: 'Name', value: pass.full_name },
    { label: 'Email', value: pass.email },
    { label: 'Phone', value: pass.phone },
    { label: 'Course', value: pass.course },
    { label: 'Year', value: pass.year },
    { label: 'Department', value: pass.department },
    { label: 'Workshop', value: pass.workshop_title },
    { label: 'Date', value: formatDate(pass.workshop_event_date) },
    { label: 'Venue', value: pass.workshop_venue },
    { label: 'Registered On', value: formatDate(pass.created_at) },
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div ref={passRef} className="card p-8 bg-white">
          <div className="text-center mb-6">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-2">
              Intellect Studio · Workshop Pass
            </p>
            <h2 className="font-syne font-black text-xl text-ink leading-snug">{pass.workshop_title}</h2>
          </div>

          <div className="flex justify-center mb-4">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="QR Code" width={220} height={220} />
            ) : (
              <div className="w-[220px] h-[220px] bg-ink/5 animate-pulse" />
            )}
          </div>

          <div className="flex justify-center mb-6">
            <span className={`inline-block px-3 py-1 text-[10px] font-mono tracking-widest uppercase border ${statusInfo.border} ${statusInfo.bg} ${statusInfo.text}`}>
              {pass.checked_in_at ? '✓ Checked In' : statusInfo.label}
            </span>
          </div>

          <dl className="divide-y divide-border border-t border-border">
            {DETAIL_ROWS.filter((r) => r.value).map((row) => (
              <div key={row.label} className="flex justify-between gap-4 py-2.5">
                <dt className="text-[11px] font-semibold tracking-wider uppercase text-ink-3 font-syne shrink-0">
                  {row.label}
                </dt>
                <dd className="text-sm text-ink font-sans text-right">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>

      <button
        onClick={handleDownload}
        disabled={downloading || !qrDataUrl}
        className="btn-primary flex items-center justify-center gap-3 min-w-[220px] disabled:opacity-60"
      >
        {downloading ? 'Preparing PDF…' : 'Download Pass (PDF) ↓'}
      </button>
    </div>
  );
}
