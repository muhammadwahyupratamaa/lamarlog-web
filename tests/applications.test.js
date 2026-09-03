import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDate, statusMeta } from '../src/lib/applications.js';

test('all backend application statuses have a display badge', () => {
  assert.equal(Object.keys(statusMeta).length, 9);
  assert.equal(statusMeta.TECHNICAL_TEST[0], 'Technical test');
});

test('date-only API values keep their calendar date in Indonesian formatting', () => {
  assert.equal(formatDate('2026-09-03'), '3 September 2026');
});
