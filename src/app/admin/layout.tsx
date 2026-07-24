import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — Intellect Studio',
  description: 'Admin portal for managing internship registrations.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
