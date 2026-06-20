interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-[var(--color-surface-alt)] p-4 rounded-xl border border-[var(--color-surface)] shadow-lg transition-transform hover:scale-105">
      <div className="flex items-center gap-3 mb-2 text-[var(--color-text-secondary)]">
        {icon && <div className="text-[var(--color-chec-cyan)]">{icon}</div>}
        <h4 className="text-sm font-medium">{label}</h4>
      </div>
      <p className="text-3xl font-bold text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
}
