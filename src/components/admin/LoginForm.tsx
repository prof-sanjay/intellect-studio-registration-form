'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { adminLoginSchema, type AdminLoginData } from '@/lib/admin-validations';
import { cn } from '@/lib/utils';

export default function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginData>({ resolver: zodResolver(adminLoginSchema) });

  const onSubmit = async (data: AdminLoginData) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || 'Login failed.');
        return;
      }
      toast.success('Welcome back.');
      router.push('/admin');
      router.refresh();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="label-upper">Username</label>
        <input
          className={cn('input-base', errors.username && 'input-error')}
          autoComplete="username"
          {...register('username')}
        />
        {errors.username && <p className="error-text">{errors.username.message}</p>}
      </div>

      <div>
        <label className="label-upper">Password</label>
        <input
          type="password"
          className={cn('input-base', errors.password && 'input-error')}
          autoComplete="current-password"
          {...register('password')}
        />
        {errors.password && <p className="error-text">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
        {submitting ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}
