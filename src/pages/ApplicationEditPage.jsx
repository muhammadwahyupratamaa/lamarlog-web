import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationForm from '../features/applications/ApplicationForm';
import { useAuth } from '../features/auth/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { getApplication, updateApplication } from '../services/applications';

export default function ApplicationEditPage() {
  const { id } = useParams(); const { token } = useAuth(); const navigate = useNavigate(); const [application, setApplication] = useState(null); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false);
  usePageTitle('Edit Lamaran');
  const load = useCallback(async () => { setError(''); try { setApplication(await getApplication(token, id)); } catch (requestError) { setError(requestError.message); } }, [token, id]);
  useEffect(() => { load(); }, [load]);
  const submit = async (values) => { setSubmitting(true); try { await updateApplication(token, id, values); navigate(`/applications/${id}`, { replace: true }); } finally { setSubmitting(false); } };
  if (error) return <PageError message={error} retry={load} />;
  if (!application) return <FormSkeleton />;
  return <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10"><p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-signal">Applications</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Edit Lamaran</h1><ApplicationForm application={application} onCancel={() => navigate(`/applications/${id}`)} onSubmit={submit} submitting={submitting} /></main>;
}

function PageError({ message, retry }) { return <main className="mx-auto max-w-3xl px-5 py-10"><section role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6"><p className="font-semibold text-red-800">Lamaran belum dapat dimuat</p><p className="mt-1 text-sm text-red-700">{message}</p><button className="mt-4 text-sm font-semibold text-red-800 underline" onClick={retry}>Coba lagi</button></section></main>; }
function FormSkeleton() { return <main className="mx-auto max-w-6xl animate-pulse px-5 py-10"><div className="h-8 w-56 rounded bg-slate-200" /><div className="mt-8 h-96 max-w-3xl rounded-xl bg-slate-200" /></main>; }
