import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { routeAccess } from '../lib/auth';

function LoadingScreen() { return <div className="grid min-h-screen place-items-center bg-mist text-sm text-slate-600">Memuat LamarLog…</div>; }

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const access = routeAccess(user, loading);
  if (access === 'loading') return <LoadingScreen />;
  return access === 'allow' ? <Outlet /> : <Navigate to={access} replace />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();
  const access = routeAccess(user, loading, true);
  if (access === 'loading') return <LoadingScreen />;
  return access === 'allow' ? <Outlet /> : <Navigate to={access} replace />;
}
