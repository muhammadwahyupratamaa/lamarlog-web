import { useState } from 'react';
import { applicationFormValues, applicationPayload, validateApplication } from '../../lib/applications';

export default function ApplicationForm({ application, onCancel, onSubmit, submitting }) {
  const [values, setValues] = useState(() => applicationFormValues(application));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const update = ({ target }) => setValues((current) => ({ ...current, [target.name]: target.value }));
  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validateApplication(values);
    setErrors(nextErrors); setSubmitError('');
    if (Object.keys(nextErrors).length) return;
    try { await onSubmit(applicationPayload(values)); } catch (error) { setSubmitError(error.message); }
  };
  return <form className="mt-8 max-w-3xl space-y-7" noValidate onSubmit={submit}>
    {submitError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{submitError}</p>}
    <section className="rounded-xl border border-line bg-white p-5 sm:p-6"><h2 className="font-semibold text-ink">Informasi utama</h2><div className="mt-5 grid gap-5 sm:grid-cols-2"><Field label="Nama perusahaan" name="companyName" value={values.companyName} onChange={update} error={errors.companyName} required /><Field label="Posisi" name="jobTitle" value={values.jobTitle} onChange={update} error={errors.jobTitle} required /><Field label="Tanggal melamar" name="appliedAt" type="date" value={values.appliedAt} onChange={update} error={errors.appliedAt} required /><Field label="Lokasi" name="location" value={values.location} onChange={update} error={errors.location} /><Select label="Tipe kerja" name="workType" value={values.workType} onChange={update}><option value="">Tidak dipilih</option><option value="WFO">WFO</option><option value="WFH">WFH</option><option value="HYBRID">Hybrid</option></Select><Field label="Sumber lowongan" name="source" value={values.source} onChange={update} error={errors.source} /></div></section>
    <section className="rounded-xl border border-line bg-white p-5 sm:p-6"><h2 className="font-semibold text-ink">Detail lamaran</h2><div className="mt-5 grid gap-5 sm:grid-cols-2"><Field label="URL lowongan" name="applicationUrl" type="url" value={values.applicationUrl} onChange={update} error={errors.applicationUrl} /><Field label="Rentang gaji" name="salaryRange" value={values.salaryRange} onChange={update} error={errors.salaryRange} /><Field label="Nama kontak / recruiter" name="contactName" value={values.contactName} onChange={update} error={errors.contactName} /><Field label="Email kontak" name="contactEmail" type="email" value={values.contactEmail} onChange={update} error={errors.contactEmail} /><Field label="Follow-up berikutnya" name="nextFollowUpAt" type="date" value={values.nextFollowUpAt} onChange={update} /></div><label className="mt-5 block"><span className="form-label">Catatan</span><textarea className="form-input min-h-28 resize-y" name="notes" onChange={update} value={values.notes} /></label></section>
    <div className="flex flex-wrap-reverse justify-end gap-3"><button className="min-h-11 rounded-lg px-4 text-sm font-semibold text-slate-700 hover:bg-slate-200" onClick={onCancel} type="button">Batal</button><button className="btn-primary" disabled={submitting} type="submit">{submitting ? 'Menyimpan…' : application ? 'Simpan perubahan' : 'Simpan lamaran'}</button></div>
  </form>;
}

function Field({ label, name, type = 'text', value, onChange, error, required }) {
  return <label className="block"><span className="form-label">{label}{required && ' *'}</span><input className="form-input" name={name} onChange={onChange} type={type} value={value} />{error && <span className="mt-1.5 block text-sm text-red-600">{error}</span>}</label>;
}

function Select({ label, name, value, onChange, children }) {
  return <label className="block"><span className="form-label">{label}</span><select className="form-input" name={name} onChange={onChange} value={value}>{children}</select></label>;
}
