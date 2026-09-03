import { usePageTitle } from '../hooks/usePageTitle';

export default function ApplicationsPage() {
  usePageTitle('Applications');
  return <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10"><p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-signal">Job tracker</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-semibold tracking-tight text-ink">Applications</h1><p className="mt-2 text-slate-600">Daftar dan pengelolaan lamaran akan tersedia di fase berikutnya.</p></div></div><section className="mt-8 grid min-h-56 place-items-center rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center"><div><p className="font-medium text-ink">Belum ada tampilan data di fase ini.</p><p className="mt-1 text-sm text-slate-500">Data tidak dibuat secara palsu; halaman ini siap untuk integrasi applications.</p></div></section></main>;
}
