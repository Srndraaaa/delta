import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { useMagneticScroll } from '../src/hooks/useMagneticScroll.js';

test('useMagneticScroll is an exported function', () => {
  assert.equal(typeof useMagneticScroll, 'function');
});
