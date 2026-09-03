import test from 'node:test';
import assert from 'node:assert/strict';
import { capDevicePixelRatio } from '../src/lib/waves.js';

test('waves renderer caps device pixel ratio for predictable canvas cost', () => {
  assert.equal(capDevicePixelRatio(3), 2);
  assert.equal(capDevicePixelRatio(1.5), 1.5);
  assert.equal(capDevicePixelRatio(0), 1);
});
