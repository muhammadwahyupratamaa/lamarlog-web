import test from 'node:test';
import assert from 'node:assert/strict';
import { authStorageKey, readToken, removeToken, routeAccess, saveToken } from '../src/lib/auth.js';

test('auth session helpers persist and clear the token used by AuthContext', () => {
  const storage = new Map();
  storage.getItem = storage.get.bind(storage); storage.setItem = storage.set.bind(storage); storage.removeItem = storage.delete.bind(storage);
  saveToken(storage, 'jwt');
  assert.equal(storage.get(authStorageKey), 'jwt');
  assert.equal(readToken(storage), 'jwt');
  removeToken(storage);
  assert.equal(readToken(storage), undefined);
});

test('route guard decisions protect private routes and redirect authenticated guests', () => {
  assert.equal(routeAccess(null, true), 'loading');
  assert.equal(routeAccess(null, false), '/login');
  assert.equal(routeAccess({ id: 'user-1' }, false), 'allow');
  assert.equal(routeAccess({ id: 'user-1' }, false, true), '/dashboard');
  assert.equal(routeAccess(null, false, true), 'allow');
});
