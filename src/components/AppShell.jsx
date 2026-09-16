import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '▦' },
  { to: '/applications', label: 'Applications', icon: '⌁' },
];

function Navigation({ mobile = false, onLogout }) {
  return <nav aria-label={mobile ? 'Navigasi mobile' : 'Navigasi utama'} className={mobile ? 'grid grid-cols-3 gap-1' : 'space-y-1'}>{links.map(({ to, label, icon }) => <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''} ${mobile ? 'flex-col gap-1 px-2 py-1.5 text-xs' : ''}`}><span aria-hidden="true" className={mobile ? 'text-base leading-none' : 'text-lg leading-none'}>{icon}</span>{label}</NavLink>)}{mobile && <button className="nav-link flex-col gap-1 px-2 py-1.5 text-xs" onClick={onLogout}><span aria-hidden="true" className="text-base leading-none">↪</span>Logout</button>}</nav>;
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const onLogout = async () => { await logout(); navigate('/login', { replace: true }); };

  return <div className="min-h-screen bg-mist/95 lg:grid lg:grid-cols-[15.5rem_1fr]">
    <aside className="hidden min-h-screen border-r border-line bg-white p-5 lg:flex lg:flex-col">
      <span className="px-3 text-lg font-bold tracking-tight text-ink">Lamar<span className="text-signal">Log</span></span>
      <div className="mt-10"><p className="mb-3 px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Workspace</p><Navigation /></div>
      <div className="mt-auto rounded-xl border border-line bg-slate-50 p-3">
        <p className="truncate text-sm font-semibold text-ink">{user?.name}</p><p className="mt-0.5 truncate text-xs text-slate-500">{user?.email}</p>
        <button className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white" onClick={onLogout}>Logout</button>
      </div>
    </aside>
    <div className="pb-20 lg:pb-0">
      <header className="flex h-16 items-center justify-between border-b border-line bg-white px-5 sm:px-8"><span className="text-lg font-bold tracking-tight text-ink lg:hidden">Lamar<span className="text-signal">Log</span></span><span className="hidden text-sm font-medium text-slate-500 lg:block">LamarLog</span><span className="max-w-[13rem] truncate text-sm text-slate-600">{user?.name}</span></header>
      <Outlet />
    </div>
    <div className="fixed inset-x-0 bottom-0 border-t border-line bg-white px-3 py-2 lg:hidden"><Navigation mobile onLogout={onLogout} /></div>
  </div>;
}
