import Link from 'next/link';
import WorkshopForm from '@/components/admin/WorkshopForm';

export default function NewWorkshopPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/workshops" className="font-mono text-[10px] tracking-widest uppercase text-ink-3 hover:text-ink">
          ← Back to Workshops
        </Link>
        <h1 className="font-syne font-black text-3xl md:text-4xl text-ink mt-3">New Workshop</h1>
      </div>

      <div className="max-w-3xl">
        <WorkshopForm />
      </div>
    </div>
  );
}
