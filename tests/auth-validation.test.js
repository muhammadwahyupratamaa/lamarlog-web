import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAuth } from '../src/lib/auth-validation.js';

test('register validation follows the API password and confirmation rules', () => {
  assert.deepEqual(validateAuth({ name: ' ', email: 'invalid', password: 'short', confirmPassword: 'other' }, 'register'), {
    name: 'Nama wajib diisi.', email: 'Masukkan email yang valid.', password: 'Password harus 8–72 karakter.', confirmPassword: 'Konfirmasi password tidak cocok.',
  });
});
