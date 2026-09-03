import { api } from './api';

export async function getDashboard(token) {
  const [summary, followUps] = await Promise.all([
    api('/dashboard/summary', { token }),
    api('/dashboard/follow-ups', { token }),
  ]);
  return { summary, followUps };
}
