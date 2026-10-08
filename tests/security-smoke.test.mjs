import test from 'node:test';
import assert from 'node:assert/strict';
const base = process.env.SECURITY_TEST_URL;

test('anonymous notification requests are rejected before body processing', { skip: !base }, async () => {
  for (const body of ['{}', 'invalid-json']) {
    const response = await fetch(`${base}/api/notify`, { method: 'POST', body, headers: { 'Content-Type': 'application/json' } });
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { error: 'Unauthorized' });
  }
});
test('unpublished article direct URLs are not accessible', { skip: !base || !process.env.SECURITY_DRAFT_ID }, async () => {
  const response = await fetch(`${base}/posts/${process.env.SECURITY_DRAFT_ID}`);
  assert.equal(response.status, 404);
});
test('public pages stay available with browser security headers', { skip: !base }, async () => {
  const response = await fetch(base);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
  assert.equal(response.headers.get('x-powered-by'), null);
});
