import test from 'node:test';
import assert from 'node:assert/strict';
import { applicationListQuery, formatDate, statusMeta } from '../src/lib/applications.js';

test('all backend application statuses have a display badge', () => {
  assert.equal(Object.keys(statusMeta).length, 9);
  assert.equal(statusMeta.TECHNICAL_TEST[0], 'Technical test');
});

test('date-only API values keep their calendar date in Indonesian formatting', () => {
  assert.equal(formatDate('2026-09-03'), '3 September 2026');
});

test('list query only sends supported API filters', () => {
  assert.equal(applicationListQuery({ page: 2, q: 'Apply Flow', status: 'INTERVIEW', followUp: 'today' }), 'page=2&q=Apply+Flow&status=INTERVIEW&followUp=today');
});
