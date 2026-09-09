import test from 'node:test';
import assert from 'node:assert/strict';
import { ApiError, api, apiUrl, unauthorizedEvent } from '../src/services/api.js';

test('api URL joins the configured /api base without duplicate slashes', () => {
  assert.equal(apiUrl('/health', 'https://api.example/api/'), 'https://api.example/api/health');
  assert.equal(apiUrl('auth/login', 'https://api.example/api'), 'https://api.example/api/auth/login');
});

test('api has no localhost fallback when VITE_API_BASE_URL is absent', () => {
  assert.throws(() => apiUrl('/health', ''), /VITE_API_BASE_URL/);
});

test('api sends JSON and Bearer token, then returns data', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  let request;
  globalThis.fetch = async (url, options) => { request = { url, options }; return new Response(JSON.stringify({ data: { id: 'app-1' } }), { status: 200 }); };
  assert.deepEqual(await api('/applications', { baseUrl: 'https://api.example/api', token: 'token-1', method: 'POST', body: '{}' }), { id: 'app-1' });
  assert.equal(request.url, 'https://api.example/api/applications');
  assert.equal(request.options.headers.Authorization, 'Bearer token-1');
  assert.equal(request.options.headers['Content-Type'], 'application/json');
});

test('login and register use the auth endpoints', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  const urls = [];
  globalThis.fetch = async (url) => { urls.push(url); return new Response(JSON.stringify({ data: { token: 'jwt', user: {} } }), { status: 200 }); };
  await api('/auth/login', { baseUrl: 'https://api.example/api', method: 'POST', body: '{}' });
  await api('/auth/register', { baseUrl: 'https://api.example/api', method: 'POST', body: '{}' });
  assert.deepEqual(urls, ['https://api.example/api/auth/login', 'https://api.example/api/auth/register']);
});

test('api turns backend and malformed responses into clear errors', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => new Response(JSON.stringify({ error: { message: 'Application not found' } }), { status: 404 });
  await assert.rejects(api('/applications/missing', { baseUrl: 'https://api.example/api' }), (error) => error instanceof ApiError && error.status === 404 && error.message === 'Application not found');
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: true }), { status: 200 });
  await assert.rejects(api('/applications', { baseUrl: 'https://api.example/api' }), /Respons server tidak valid/);
});

test('api reports network and CORS failures clearly', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); };
  await assert.rejects(api('/health', { baseUrl: 'https://api.example/api' }), /Tidak dapat terhubung/);
});

test('api emits a session-clear signal when a protected request returns 401', async (t) => {
  const originalFetch = globalThis.fetch; const originalWindow = globalThis.window;
  t.after(() => { globalThis.fetch = originalFetch; globalThis.window = originalWindow; });
  const events = new EventTarget(); let received = false;
  events.addEventListener(unauthorizedEvent, () => { received = true; });
  globalThis.window = events;
  globalThis.fetch = async () => new Response(JSON.stringify({ error: { message: 'Invalid or expired token' } }), { status: 401 });
  await assert.rejects(api('/dashboard/summary', { baseUrl: 'https://api.example/api', token: 'expired' }), /Invalid or expired token/);
  assert.equal(received, true);
});
