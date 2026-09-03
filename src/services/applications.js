import { applicationListQuery } from '../lib/applications';
import { api } from './api';

export function listApplications(token, filters) {
  const query = applicationListQuery(filters);
  return api(`/applications${query ? `?${query}` : ''}`, { token, withMeta: true });
}

export const getApplication = (token, id) => api(`/applications/${id}`, { token });
export const createApplication = (token, values) => api('/applications', { method: 'POST', token, body: JSON.stringify(values) });
export const updateApplication = (token, id, values) => api(`/applications/${id}`, { method: 'PATCH', token, body: JSON.stringify(values) });
export const deleteApplication = (token, id) => api(`/applications/${id}`, { method: 'DELETE', token });
export const updateApplicationStatus = (token, id, values) => api(`/applications/${id}/status`, { method: 'POST', token, body: JSON.stringify(values) });
export const getApplicationHistory = (token, id) => api(`/applications/${id}/history`, { token });
