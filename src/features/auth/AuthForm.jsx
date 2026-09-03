import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateAuth } from '../../lib/auth-validation';
import { api } from '../../services/api';
import { useAuth } from './AuthContext';

const initialValues = { name: '', email: '', password: '', confirmPassword: '' };

export default function AuthForm({ mode }) {
  const register = mode === 'register';
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { startSession } = useAuth();
  const navigate = useNavigate();
  const title = register ? 'Mulai lacak peluangmu.' : 'Lanjutkan progresmu.';

  const onChange = ({ target }) => setValues((current) => ({ ...current, [target.name]: target.value }));
  const onSubmit = async (event) => {
    event.preventDefault();
    const validation = validateAuth(values, mode);
    setErrors(validation);
    setApiError('');
    if (Object.keys(validation).length) return;
    setSubmitting(true);
    try {
      const body = register ? { ...values, name: values.name.trim(), email: values.email.trim() } : { email: values.email.trim(), password: values.password };
      startSession(await api(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(body) }));
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_34rem]">
      <section className="hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link to="/login" className="text-lg font-bold tracking-tight">Apply<span className="text-cyan-300">Flow</span></Link>
        <div className="max-w-md">
          <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Job search, in focus</p>
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight">Satu tempat tenang untuk setiap langkah pencarian kerja.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">Catat lamaran, lihat perkembangannya, dan jangan lewatkan follow-up penting.</p>
        </div>
        <p className="font-mono text-xs text-slate-400">PERSONAL JOB TRACKER</p>
      </section>
      <section className="flex items-center justify-center bg-white px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/login" className="text-lg font-bold tracking-tight text-ink lg:hidden">Apply<span className="text-signal">Flow</span></Link>
          <p className="mt-12 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-signal">{register ? 'Buat akun' : 'Selamat datang kembali'}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{register ? 'Buat akun untuk mulai mengatur setiap lamaran.' : 'Masuk untuk melihat perjalanan aplikasimu.'}</p>
          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
            {apiError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{apiError}</p>}
            {register && <Field label="Nama" name="name" value={values.name} onChange={onChange} error={errors.name} autoComplete="name" />}
            <Field label="Email" name="email" type="email" value={values.email} onChange={onChange} error={errors.email} autoComplete="email" />
            <Field label="Password" name="password" type="password" value={values.password} onChange={onChange} error={errors.password} autoComplete={register ? 'new-password' : 'current-password'} hint={register ? '8–72 karakter' : undefined} />
            {register && <Field label="Konfirmasi password" name="confirmPassword" type="password" value={values.confirmPassword} onChange={onChange} error={errors.confirmPassword} autoComplete="new-password" />}
            <button className="btn-primary mt-2 w-full" disabled={submitting} type="submit">{submitting ? 'Memproses…' : register ? 'Buat akun' : 'Masuk ke ApplyFlow'}</button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">{register ? 'Sudah punya akun?' : 'Belum punya akun?'} <Link className="font-semibold text-signal hover:underline" to={register ? '/login' : '/register'}>{register ? 'Masuk' : 'Daftar sekarang'}</Link></p>
        </div>
      </section>
    </main>
  );
}

function Field({ label, name, type = 'text', value, onChange, error, hint, autoComplete }) {
  return <label className="block"><span className="form-label">{label} {hint && <span className="font-normal text-slate-400">({hint})</span>}</span><input className="form-input" aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} autoComplete={autoComplete} name={name} onChange={onChange} type={type} value={value} />{error && <span id={`${name}-error`} className="mt-1.5 block text-sm text-red-600">{error}</span>}</label>;
}
