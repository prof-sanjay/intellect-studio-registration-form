'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { WorkshopWithCounts } from '@/lib/workshop-types';

export default function FeedbackSearchFilterBar({ workshops }: { workshops: WorkshopWithCounts[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const handle = setTimeout(() => {
      const current = searchParams.get('search') || '';
      if (search === current) return;
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set('search', search);
      else params.delete('search');
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleWorkshopChange = (workshopId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (workshopId === 'all') params.delete('workshop');
    else params.set('workshop', workshopId);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        className="input-base sm:max-w-xs"
        placeholder="Search name or register number…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="input-base sm:max-w-[240px]"
        value={searchParams.get('workshop') || 'all'}
        onChange={(e) => handleWorkshopChange(e.target.value)}
      >
        <option value="all">All Workshops</option>
        {workshops.map((w) => (
          <option key={w.id} value={w.id}>
            {w.title}
          </option>
        ))}
      </select>
    </div>
  );
}
