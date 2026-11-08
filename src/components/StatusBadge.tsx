interface StatusBadgeProps {
  status: string;
}

const config: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  'In Progress': 'bg-blue-50 text-blue-950 ring-blue-900/20',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Cancelled: 'bg-red-50 text-red-700 ring-red-600/20',
  Promo: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Regular: 'bg-blue-50 text-blue-950 ring-blue-900/20',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cls = config[status] ?? 'bg-gray-100 text-gray-600 ring-gray-500/20';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
      {status}
    </span>
  );
}

