import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { parseMarkdown } from '../src/lib/feedLoader.js';

let server;
let FeedSection;
let FeedReaderModal;
let Navbar;
let Footer;
let LogoLoopSection;

const feed = {
  slug: 'example', title: 'Example research', summary: 'Summary', tags: [],
  author: 'Researcher', category: 'Research', content: 'Content', readingTime: '1 min read',
};

before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
  ({ FeedSection } = await server.ssrLoadModule('/src/components/FeedSection.jsx'));
  ({ FeedReaderModal } = await server.ssrLoadModule('/src/components/FeedReaderModal.jsx'));
  ({ Navbar } = await server.ssrLoadModule('/src/components/Navbar.jsx'));
  ({ Footer } = await server.ssrLoadModule('/src/components/Footer.jsx'));
  ({ LogoLoopSection } = await server.ssrLoadModule('/src/components/LogoLoopSection.jsx'));
});

after(async () => { await server?.close(); });

test('missing article metadata does not invent a date or author', () => {
  const parsed = parseMarkdown('# Article', 'article.md');
  assert.equal(parsed.date, '');
  assert.equal(parsed.author, '');
});

test('provided article metadata is preserved', () => {
  const parsed = parseMarkdown('---\ndate: "2026-11-06"\nauthor: "Researcher"\n---\nArticle');
  assert.equal(parsed.date, '2026-11-06');
  assert.equal(parsed.author, 'Researcher');
});

test('article cards and search expose native accessible controls', () => {
  const html = renderToStaticMarkup(React.createElement(FeedSection, { feeds: [feed], onSelectFeed() {} }));
  assert.match(html, /<button[^>]*aria-label="Read Example research"/);
  assert.match(html, /<input[^>]*aria-label="Search research feeds"/);
  assert.match(html, /aria-pressed="true"/);
});

test('reader uses a named native dialog', () => {
  const html = renderToStaticMarkup(React.createElement(FeedReaderModal, { feed, open: true, onOpenChange() {} }));
  assert.match(html, /<dialog[^>]*aria-labelledby="feed-reader-title"/);
  assert.match(html, /id="feed-reader-title"/);
});

test('navigation, footer and logo labels avoid unsupported claims', () => {
  const html = [Navbar, Footer, LogoLoopSection].map((Component) => renderToStaticMarkup(React.createElement(Component))).join(' ');
  assert.doesNotMatch(html, /Node status:|Autonomous Protocol|Technology Partners|title="Source Code"/);
});
