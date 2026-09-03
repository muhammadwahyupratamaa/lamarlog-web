import { applicationListQuery } from '../lib/applications';
import { api } from './api';

const objectResponse = (value, message) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(message);
  return value;
};

export function listApplications(token, filters) {
  const query = applicationListQuery(filters);
  return api(`/applications${query ? `?${query}` : ''}`, { token, withMeta: true }).then((response) => {
    if (!Array.isArray(response.data) || !response.data.every((application) => application && typeof application === 'object') || !response.pagination || typeof response.pagination.page !== 'number' || typeof response.pagination.totalPages !== 'number') throw new Error('Respons daftar lamaran tidak valid.');
    return response;
  });
}

export const getApplication = (token, id) => api(`/applications/${id}`, { token }).then((data) => objectResponse(data, 'Respons lamaran tidak valid.'));
export const createApplication = (token, values) => api('/applications', { method: 'POST', token, body: JSON.stringify(values) }).then((data) => objectResponse(data, 'Respons lamaran tidak valid.'));
export const updateApplication = (token, id, values) => api(`/applications/${id}`, { method: 'PATCH', token, body: JSON.stringify(values) }).then((data) => objectResponse(data, 'Respons lamaran tidak valid.'));
export const deleteApplication = (token, id) => api(`/applications/${id}`, { method: 'DELETE', token });
export const updateApplicationStatus = (token, id, values) => api(`/applications/${id}/status`, { method: 'POST', token, body: JSON.stringify(values) }).then((data) => objectResponse(data, 'Respons status tidak valid.'));
export const getApplicationHistory = (token, id) => api(`/applications/${id}/history`, { token }).then((data) => { if (!Array.isArray(data)) throw new Error('Respons riwayat status tidak valid.'); return data; });
