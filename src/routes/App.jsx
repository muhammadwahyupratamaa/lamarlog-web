import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { GuestRoute, ProtectedRoute } from './RouteGuards';

function PrivatePlaceholder() { return <main className="grid min-h-screen place-items-center bg-mist p-6 text-center"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-signal">ApplyFlow</p><h1 className="mt-3 text-2xl font-semibold">Halaman aplikasi sedang disiapkan.</h1></div></main>; }

export default function App() {
  return <Routes>
    <Route element={<GuestRoute />}><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /></Route>
    <Route element={<ProtectedRoute />}><Route path="/dashboard" element={<PrivatePlaceholder />} /><Route path="/applications" element={<PrivatePlaceholder />} /></Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>;
}
