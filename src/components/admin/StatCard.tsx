export default function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-6">
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-3 mb-3">{label}</p>
      <p className="font-syne font-black text-3xl md:text-4xl text-ink">{value}</p>
    </div>
  );
}
