'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    toast.success('Logged out.');
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="btn-secondary text-xs px-4 py-2.5">
      Logout
    </button>
  );
}
