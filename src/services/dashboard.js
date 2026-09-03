import { api } from './api';

export async function getDashboard(token) {
  const [summary, followUps] = await Promise.all([
    api('/dashboard/summary', { token }),
    api('/dashboard/follow-ups', { token }),
  ]);
  const metrics = ['total', 'active', 'interview', 'accepted', 'rejected', 'followUpDue'];
  if (!summary || metrics.some((metric) => typeof summary[metric] !== 'number') || !Array.isArray(followUps) || !followUps.every((application) => application && typeof application === 'object')) throw new Error('Respons dashboard tidak valid.');
  return { summary, followUps };
}
