import test from 'node:test';
import assert from 'node:assert/strict';
import { applicationFormValues, applicationListQuery, applicationPayload, formatDate, statusMeta, validateApplication } from '../src/lib/applications.js';

test('all backend application statuses have a display badge', () => {
  assert.equal(Object.keys(statusMeta).length, 9);
  assert.equal(statusMeta.TECHNICAL_TEST[0], 'Technical test');
});

test('date-only API values keep their calendar date in Indonesian formatting', () => {
  assert.equal(formatDate('2026-09-03'), '3 September 2026');
});

test('list query only sends supported API filters', () => {
  assert.equal(applicationListQuery({ page: 2, q: 'LamarLog', status: 'INTERVIEW', followUp: 'today' }), 'page=2&q=LamarLog&status=INTERVIEW&followUp=today');
});

test('application form requires backend mandatory fields and serializes empty optionals as null', () => {
  const values = applicationFormValues({ companyName: 'Acme', jobTitle: 'Engineer', appliedAt: '2026-09-03' });
  assert.deepEqual(validateApplication(values), {});
  assert.equal(applicationPayload(values).location, null);
  assert.ok(validateApplication({ ...values, companyName: '' }).companyName);
});

test('invalid backend dates degrade to a safe placeholder instead of crashing the UI', () => {
  assert.equal(formatDate('not-a-date'), '—');
});
