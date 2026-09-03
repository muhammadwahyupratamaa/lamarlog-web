import test from 'node:test';
import assert from 'node:assert/strict';
import { ApiError, api } from '../src/services/api.js';

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

test('api turns backend and malformed responses into clear errors', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => new Response(JSON.stringify({ error: { message: 'Application not found' } }), { status: 404 });
  await assert.rejects(api('/applications/missing', { baseUrl: 'https://api.example/api' }), (error) => error instanceof ApiError && error.status === 404 && error.message === 'Application not found');
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: true }), { status: 200 });
  await assert.rejects(api('/applications', { baseUrl: 'https://api.example/api' }), /Respons server tidak valid/);
});
