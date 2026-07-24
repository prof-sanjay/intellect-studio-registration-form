import LoginForm from '@/components/admin/LoginForm';

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3">
            Intellect Studio
          </p>
          <h1 className="font-syne font-black text-3xl text-ink">Admin Portal</h1>
          <p className="mt-2 text-sm text-ink-2 font-sans">Sign in to manage registrations.</p>
        </div>

        <div className="card p-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
