'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { COLLEGE_OPTIONS } from '@/lib/workshop-interest-validations';

export default function InterestSearchFilterBar() {
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

  const handleCollegeChange = (college: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (college === 'all') params.delete('college');
    else params.set('college', college);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        className="input-base sm:max-w-xs"
        placeholder="Search name or roll number…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="input-base sm:max-w-[200px]"
        value={searchParams.get('college') || 'all'}
        onChange={(e) => handleCollegeChange(e.target.value)}
      >
        <option value="all">All Colleges</option>
        {COLLEGE_OPTIONS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
