import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export default function ApplicationCreatePage() {
  usePageTitle('Tambah Lamaran');
  return <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10"><p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-signal">Applications</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Tambah Lamaran</h1><section className="mt-8 max-w-2xl rounded-xl border border-dashed border-slate-300 bg-white p-6 sm:p-8"><p className="text-lg font-semibold text-ink">Form lamaran akan hadir di fase berikutnya.</p><Link className="mt-5 inline-block text-sm font-semibold text-signal hover:underline" to="/dashboard">Kembali ke Dashboard</Link></section></main>;
}
