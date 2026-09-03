import { applicationListQuery } from '../lib/applications';
import { api } from './api';

export function listApplications(token, filters) {
  const query = applicationListQuery(filters);
  return api(`/applications${query ? `?${query}` : ''}`, { token, withMeta: true });
}
