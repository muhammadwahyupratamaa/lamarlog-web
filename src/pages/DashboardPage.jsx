import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export default function DashboardPage() {
  usePageTitle('Dashboard');
  return <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10"><p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-signal">Overview</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Dashboard</h1><section className="mt-8 max-w-2xl rounded-xl border border-dashed border-slate-300 bg-white p-6 sm:p-8"><p className="text-lg font-semibold text-ink">Ringkasan lamaran akan tampil di sini.</p><p className="mt-2 max-w-xl leading-7 text-slate-600">Mulai dengan menambahkan lamaran untuk melihat progres dan jadwal follow-up dalam satu tempat.</p><Link className="btn-primary mt-6" to="/applications">Buka Applications</Link></section></main>;
}
