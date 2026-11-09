import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('dither shader outputs transparent ink with an alpha-enabled renderer', async () => {
  const source = await readFile(new URL('../src/components/reactbits/DitherVeil.jsx', import.meta.url), 'utf8');
  assert.match(source, /alpha: true/);
  assert.match(source, /fragColor = vec4\(color, opacity\)/);
});
