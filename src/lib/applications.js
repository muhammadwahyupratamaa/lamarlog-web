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
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value.slice(0, 10)}T00:00:00`));
}

export function applicationListQuery({ page = 1, q, status, followUp }) {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', page);
  if (q) params.set('q', q);
  if (status) params.set('status', status);
  if (followUp) params.set('followUp', followUp);
  return params.toString();
}
