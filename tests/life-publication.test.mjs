import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectPublished } from '../src/lib/life-publication.ts';
const now = Date.parse('2026-09-29T00:00:00+08:00');
const entry = (id, changes = {}) => ({id, status: 'published', publishedAt: '2026-09-28T00:00:00+08:00', source: {reviewed: true}, ...changes});
test('drafts, unreviewed content, missing dates, invalid dates and scheduled articles stay private', () => {
 const posts = [entry('public'), entry('draft', {status: 'draft'}), entry('unreviewed', {source:{reviewed:false}}), entry('missing', {publishedAt:undefined}), entry('invalid', {publishedAt:'bad-date'}), entry('future', {publishedAt:'2026-09-29T00:00:01+08:00'})];
 assert.deepEqual(selectPublished(posts, now).map(p=>p.id), ['public']);
});
test('publication boundary uses timezone-aware timestamps and sorts without mutating source', () => {
 const posts = [entry('older'), entry('at-boundary', {publishedAt:'2026-09-28T16:00:00Z'})];
 assert.deepEqual(selectPublished(posts, now).map(p=>p.id), ['at-boundary','older']);
 assert.deepEqual(posts.map(p=>p.id), ['older','at-boundary']);
 assert.deepEqual(selectPublished(posts, now - 1).map(p=>p.id), ['older']);
});
