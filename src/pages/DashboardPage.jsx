import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../features/auth/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatDate } from '../lib/applications';
import { getDashboard } from '../services/dashboard';

export default function DashboardPage() {
  usePageTitle('Dashboard');
  const { token, user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setDashboard(await getDashboard(token)); } catch (requestError) { setError(requestError.message); } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);
  return <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
    <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-signal">Overview</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Selamat datang, {user?.name?.split(' ')[0] || 'kembali'}.</h1><p className="mt-2 text-slate-600">Lihat posisi setiap lamaran dan langkah yang perlu dilakukan.</p></div><Link className="btn-primary" to="/applications/new">+ Tambah Lamaran</Link></div>
    {loading && <DashboardSkeleton />}
    {!loading && error && <section role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6"><p className="font-semibold text-red-800">Dashboard belum dapat dimuat</p><p className="mt-1 text-sm text-red-700">{error}</p><button className="mt-4 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-red-800 shadow-sm ring-1 ring-red-200 hover:bg-red-100" onClick={load}>Coba lagi</button></section>}
    {!loading && !error && <DashboardContent dashboard={dashboard} />}
  </main>;
}

function DashboardContent({ dashboard: { summary, followUps } }) {
  const metrics = [['total', 'Total lamaran'], ['active', 'Lamaran aktif'], ['interview', 'Dalam proses interview'], ['followUpDue', 'Perlu follow-up'], ['accepted', 'Diterima'], ['rejected', 'Ditolak']];
  return <><section aria-label="Ringkasan lamaran" className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{metrics.map(([key, label]) => <div key={key} className="rounded-xl border border-line bg-white p-5"><p className="text-sm font-medium text-slate-600">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{summary[key]}</p></div>)}</section>
    {summary.total === 0 && <section className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-6"><p className="font-semibold text-ink">Belum ada lamaran yang tercatat.</p><p className="mt-1 text-sm leading-6 text-slate-600">Tambahkan lamaran pertama untuk mulai memantau proses dan follow-up.</p></section>}
    <section className="mt-8 rounded-xl border border-line bg-white"><div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6"><div><h2 className="font-semibold text-ink">Perlu Follow-up</h2><p className="mt-0.5 text-sm text-slate-500">Lamaran aktif yang memiliki jadwal follow-up.</p></div><span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-signal">{followUps.length}</span></div>{followUps.length ? <ul className="divide-y divide-line">{followUps.map((application) => <li key={application.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6"><div className="min-w-0"><p className="truncate font-semibold text-ink">{application.companyName}</p><p className="mt-0.5 truncate text-sm text-slate-600">{application.jobTitle}</p></div><div className="flex items-center gap-2"><StatusBadge status={application.status} /><FollowUpLabel type={application.followUpType} date={application.nextFollowUpAt} /></div></li>)}</ul> : <div className="p-6 text-sm text-slate-600">Tidak ada follow-up aktif. Jadwal mendatang akan tampil di sini.</div>}</section>
  </>;
}

function FollowUpLabel({ type, date }) {
  const label = type === 'overdue' ? 'Terlambat' : type === 'today' ? 'Hari ini' : formatDate(date);
  return <span className={`text-xs font-semibold ${type === 'overdue' ? 'text-red-700' : type === 'today' ? 'text-amber-700' : 'text-slate-600'}`}>{label}</span>;
}

function DashboardSkeleton() {
  return <div className="mt-8 animate-pulse"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-28 rounded-xl bg-slate-200" />)}</div><div className="mt-8 h-48 rounded-xl bg-slate-200" /></div>;
}
