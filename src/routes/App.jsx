import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from '../components/AppShell';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ApplicationsPage from '../pages/ApplicationsPage';
import { GuestRoute, ProtectedRoute } from './RouteGuards';

export default function App() {
  return <Routes>
    <Route element={<GuestRoute />}><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /></Route>
    <Route element={<ProtectedRoute />}><Route element={<AppShell />}><Route path="/dashboard" element={<DashboardPage />} /><Route path="/applications" element={<ApplicationsPage />} /></Route></Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>;
}
