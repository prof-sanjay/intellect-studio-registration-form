'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const STATUS_OPTIONS = ['all', 'pending', 'approved', 'rejected'];

export default function SearchFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');

  // Debounce search input so we don't push a new URL on every keystroke.
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

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === 'all') params.delete('status');
    else params.set('status', status);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        className="input-base sm:max-w-xs"
        placeholder="Search name, email, phone, college…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="input-base sm:max-w-[180px]"
        value={searchParams.get('status') || 'all'}
        onChange={(e) => handleStatusChange(e.target.value)}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
