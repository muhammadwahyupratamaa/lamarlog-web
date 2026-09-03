import { statusMeta } from '../lib/applications';

export default function StatusBadge({ status }) {
  const [label, color] = statusMeta[status] || [status, 'bg-slate-100 text-slate-700'];
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{label}</span>;
}
