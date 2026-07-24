import { cn } from '@/lib/utils';

const STYLES: Record<string, string> = {
  pending: 'text-ink-2 border-ink-3/40 bg-ink-3/5',
  approved: 'text-success border-success/30 bg-success/5',
  rejected: 'text-error border-error/30 bg-error/5',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-block px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase border',
        STYLES[status] || STYLES.pending
      )}
    >
      {status}
    </span>
  );
}
