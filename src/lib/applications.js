export const statusMeta = {
  APPLIED: ['Dilamar', 'bg-slate-100 text-slate-700'],
  SCREENING: ['Screening', 'bg-blue-50 text-blue-700'],
  INTERVIEW: ['Interview', 'bg-violet-50 text-violet-700'],
  TECHNICAL_TEST: ['Technical test', 'bg-amber-50 text-amber-800'],
  USER_INTERVIEW: ['User interview', 'bg-indigo-50 text-indigo-700'],
  OFFER: ['Offer', 'bg-emerald-50 text-emerald-700'],
  ACCEPTED: ['Diterima', 'bg-green-50 text-green-700'],
  REJECTED: ['Ditolak', 'bg-red-50 text-red-700'],
  WITHDRAWN: ['Dibatalkan', 'bg-slate-200 text-slate-700'],
};

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export function applicationListQuery({ page = 1, q, status, followUp }) {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', page);
  if (q) params.set('q', q);
  if (status) params.set('status', status);
  if (followUp) params.set('followUp', followUp);
  return params.toString();
}

const optionalFields = ['location', 'workType', 'source', 'applicationUrl', 'salaryRange', 'contactName', 'contactEmail', 'nextFollowUpAt', 'notes'];

export function applicationFormValues(application = {}) {
  return { companyName: '', jobTitle: '', appliedAt: '', ...Object.fromEntries(optionalFields.map((field) => [field, ''])), ...Object.fromEntries(Object.entries(application).filter(([key]) => key === 'companyName' || key === 'jobTitle' || key === 'appliedAt' || optionalFields.includes(key)).map(([key, value]) => [key, value || ''])) };
}

export function validateApplication(values) {
  const errors = {};
  if (!values.companyName.trim() || values.companyName.trim().length > 255) errors.companyName = 'Nama perusahaan wajib diisi (maks. 255 karakter).';
  if (!values.jobTitle.trim() || values.jobTitle.trim().length > 255) errors.jobTitle = 'Posisi wajib diisi (maks. 255 karakter).';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.appliedAt)) errors.appliedAt = 'Tanggal melamar wajib diisi.';
  ['location', 'source', 'salaryRange', 'contactName'].forEach((field) => { if (values[field].trim().length > 255) errors[field] = 'Maksimal 255 karakter.'; });
  if (values.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contactEmail)) errors.contactEmail = 'Masukkan email yang valid.';
  if (values.applicationUrl) { try { new URL(values.applicationUrl); } catch { errors.applicationUrl = 'Masukkan URL yang valid.'; } }
  return errors;
}

export function applicationPayload(values) {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, typeof value === 'string' ? value.trim() || null : value]));
}

export function formatDateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
