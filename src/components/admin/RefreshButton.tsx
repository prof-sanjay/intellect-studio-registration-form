'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

export default function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      className="btn-secondary text-xs px-4 py-2.5 flex items-center gap-2 disabled:opacity-60"
    >
      <span className={cn('inline-block', isPending && 'animate-spin')}>⟳</span>
      {isPending ? 'Refreshing…' : 'Refresh'}
    </button>
  );
}
