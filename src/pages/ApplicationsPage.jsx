import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../features/auth/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatDate, statusMeta } from '../lib/applications';
import { listApplications } from '../services/applications';

export default function ApplicationsPage() {
  usePageTitle('Applications');
  const { token } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const status = statusMeta[searchParams.get('status')] ? searchParams.get('status') : '';
  const followUp = ['today', 'overdue', 'upcoming'].includes(searchParams.get('followUp')) ? searchParams.get('followUp') : '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const [query, setQuery] = useState(q);
  const [result, setResult] = useState({ data: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const requestVersion = useRef(0);
  const updateParams = useCallback((changes, resetPage = true) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key));
    if (resetPage) next.delete('page');
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  useEffect(() => { setQuery(q); }, [q]);
  useEffect(() => {
    const timer = setTimeout(() => { if (query.trim() !== q) updateParams({ q: query.trim() }); }, 350);
    return () => clearTimeout(timer);
  }, [q, query, updateParams]);
  const load = useCallback(async () => {
    const version = ++requestVersion.current;
    setLoading(true); setError('');
    try { const response = await listApplications(token, { page, q, status, followUp }); if (version === requestVersion.current) setResult(response); } catch (requestError) { if (version === requestVersion.current) setError(requestError.message); } finally { if (version === requestVersion.current) setLoading(false); }
  }, [token, page, q, status, followUp]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => () => { requestVersion.current += 1; }, []);

  const hasFilters = Boolean(q || status || followUp);
  return <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
    <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-signal">Job tracker</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Applications</h1><p className="mt-2 text-slate-600">Cari dan pantau semua lamaran dalam satu daftar.</p></div><Link className="btn-primary" to="/applications/new">+ Tambah Lamaran</Link></div>
    {location.state?.notice && <p role="status" className="mt-5 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-800">{location.state.notice}</p>}
    <section aria-label="Filter lamaran" className="mt-8 rounded-xl border border-line bg-white p-4 sm:p-5"><div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_13rem_13rem_auto]"><label><span className="form-label">Cari</span><input className="form-input" onChange={(event) => setQuery(event.target.value)} placeholder="Perusahaan atau posisi" type="search" value={query} /></label><label><span className="form-label">Status</span><select className="form-input" onChange={(event) => updateParams({ status: event.target.value })} value={status}><option value="">Semua status</option>{Object.entries(statusMeta).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}</select></label><label><span className="form-label">Follow-up</span><select className="form-input" onChange={(event) => updateParams({ followUp: event.target.value })} value={followUp}><option value="">Semua jadwal</option><option value="overdue">Terlambat</option><option value="today">Hari ini</option><option value="upcoming">Mendatang</option></select></label><div className="flex items-end">{hasFilters && <button className="min-h-11 text-sm font-semibold text-signal hover:underline" onClick={() => updateParams({ q: '', status: '', followUp: '' })}>Reset filter</button>}</div></div></section>
    {loading && <ListSkeleton />}
    {!loading && error && <section role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6"><p className="font-semibold text-red-800">Daftar lamaran belum dapat dimuat</p><p className="mt-1 text-sm text-red-700">{error}</p><button className="mt-4 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-red-800 shadow-sm ring-1 ring-red-200 hover:bg-red-100" onClick={load}>Coba lagi</button></section>}
    {!loading && !error && <ApplicationList result={result} hasFilters={hasFilters} onReset={() => updateParams({ q: '', status: '', followUp: '' })} onPage={(nextPage) => updateParams({ page: String(nextPage) }, false)} />}
  </main>;
}

function ApplicationList({ result: { data, pagination }, hasFilters, onReset, onPage }) {
  if (!data.length) return <section className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center"><p className="font-semibold text-ink">{hasFilters ? 'Tidak ada lamaran yang sesuai.' : 'Belum ada lamaran.'}</p><p className="mt-1 text-sm text-slate-600">{hasFilters ? 'Ubah atau reset filter untuk melihat hasil lain.' : 'Tambahkan lamaran pertama untuk mulai melacak prosesnya.'}</p>{hasFilters && <button className="mt-4 text-sm font-semibold text-signal hover:underline" onClick={onReset}>Reset filter</button>}</section>;
  return <><p className="mt-6 text-sm text-slate-600">{pagination.total} lamaran ditemukan</p><ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-white">{data.map((application) => <li key={application.id}><Link className="block p-5 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal sm:px-6" to={`/applications/${application.id}`}><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><p className="font-semibold text-ink">{application.companyName}</p><p className="mt-0.5 text-sm text-slate-600">{application.jobTitle}</p>{(application.location || application.source) && <p className="mt-2 text-xs text-slate-500">{[application.location, application.source].filter(Boolean).join(' · ')}</p>}</div><StatusBadge status={application.status} /></div><div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500"><span>Dilamar {formatDate(application.appliedAt)}</span>{application.nextFollowUpAt && <span>Follow-up {formatDate(application.nextFollowUpAt)}</span>}</div></Link></li>)}</ul>{pagination.totalPages > 1 && <nav aria-label="Pagination" className="mt-5 flex items-center justify-between"><button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40" disabled={pagination.page === 1} onClick={() => onPage(pagination.page - 1)}>Sebelumnya</button><span className="text-sm text-slate-600">Halaman {pagination.page} dari {pagination.totalPages}</span><button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40" disabled={pagination.page === pagination.totalPages} onClick={() => onPage(pagination.page + 1)}>Berikutnya</button></nav>}</>;
}

function ListSkeleton() {
  return <div className="mt-6 animate-pulse rounded-xl border border-line bg-white">{Array.from({ length: 5 }, (_, index) => <div key={index} className="border-b border-line p-5 last:border-0"><div className="h-4 w-40 rounded bg-slate-200" /><div className="mt-3 h-3 w-28 rounded bg-slate-200" /></div>)}</div>;
}
