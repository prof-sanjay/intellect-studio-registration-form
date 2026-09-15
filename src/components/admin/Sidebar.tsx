'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import LogoutButton from './LogoutButton';

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/registrations', label: 'Internship Registrations' },
  { href: '/admin/workshops', label: 'Workshops' },
];

export default function Sidebar({ username }: { username: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-border bg-surface flex md:flex-col justify-between">
      <div className="p-6 md:p-8">
        <p className="font-syne font-bold text-[11px] tracking-[0.25em] uppercase text-ink mb-1">
          Intellect Studio
        </p>
        <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-8">
          Admin Portal
        </p>

        <nav className="space-y-1">
          {NAV_LINKS.map((link) => {
            const active = link.href === '/admin' ? pathname === link.href : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-3 py-2.5 text-sm font-sans transition-colors',
                  active ? 'bg-ink text-white' : 'text-ink-2 hover:bg-bg'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 md:p-8 flex md:block items-center justify-between md:border-t md:border-border">
        <p className="font-mono text-[10px] text-ink-3 tracking-widest uppercase mb-0 md:mb-4">
          {username}
        </p>
        <LogoutButton />
      </div>
    </aside>
  );
}
