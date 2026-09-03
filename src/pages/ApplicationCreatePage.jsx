import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationForm from '../features/applications/ApplicationForm';
import { useAuth } from '../features/auth/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { createApplication } from '../services/applications';

export default function ApplicationCreatePage() {
  usePageTitle('Tambah Lamaran');
  const { token } = useAuth(); const navigate = useNavigate(); const [submitting, setSubmitting] = useState(false);
  const submit = async (values) => { setSubmitting(true); try { const application = await createApplication(token, values); navigate(`/applications/${application.id}`, { replace: true }); } finally { setSubmitting(false); } };
  return <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10"><p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-signal">Applications</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Tambah Lamaran</h1><p className="mt-2 text-slate-600">Status awal otomatis ditetapkan sebagai Dilamar.</p><ApplicationForm onCancel={() => navigate('/applications')} onSubmit={submit} submitting={submitting} /></main>;
}
