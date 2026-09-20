'use client';

import { useEffect, useState } from 'react';

export default function FeedbackQRCode() {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [feedbackUrl, setFeedbackUrl] = useState('');

  useEffect(() => {
    let cancelled = false;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/finish`;
    setFeedbackUrl(url);
    (async () => {
      const QRCode = (await import('qrcode')).default;
      const dataUrl = await QRCode.toDataURL(url, {
        margin: 1,
        width: 400,
        errorCorrectionLevel: 'M',
        color: { dark: '#0C0C0A', light: '#FFFFFF' },
      });
      if (!cancelled) setQrDataUrl(dataUrl);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="card p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
      <div className="w-[140px] h-[140px] shrink-0 flex items-center justify-center bg-bg">
        {qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrDataUrl} alt="Feedback QR Code" width={140} height={140} />
        ) : (
          <div className="w-[140px] h-[140px] bg-ink/5 animate-pulse" />
        )}
      </div>
      <div className="flex-1 text-center sm:text-left">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-3 mb-2">Feedback QR Code</p>
        <p className="text-sm text-ink-2 font-sans mb-3">
          Display or print this at the end of a workshop so students can scan it and leave feedback.
        </p>
        <p className="font-mono text-xs text-ink-3 break-all mb-3">{feedbackUrl}</p>
        {qrDataUrl && (
          <a href={qrDataUrl} download="workshop-feedback-qr.png" className="btn-secondary text-xs px-4 py-2 inline-block">
            Download QR
          </a>
        )}
      </div>
    </div>
  );
}
