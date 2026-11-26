import { afterAll, beforeAll, test } from 'bun:test';
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

beforeAll(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
  ({ FeedSection } = await server.ssrLoadModule('/src/components/FeedSection.jsx'));
  ({ FeedReaderModal } = await server.ssrLoadModule('/src/components/FeedReaderModal.jsx'));
  ({ Navbar } = await server.ssrLoadModule('/src/components/Navbar.jsx'));
  ({ Footer } = await server.ssrLoadModule('/src/components/Footer.jsx'));
  ({ LogoLoopSection } = await server.ssrLoadModule('/src/components/LogoLoopSection.jsx'));
}, 60000);

afterAll(async () => { await server?.close(); });
const feed = {
  slug: 'example', title: 'Example research', summary: 'Summary', tags: [],
  author: 'Researcher', category: 'Research', content: 'Content', readingTime: '1 min read',
};


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

test('reader counts parse as nonnegative integers, including zero', () => {
  for (const [value, expected] of [['0', 0], ['42', 42], ['"12"', 12]]) {
    const parsed = parseMarkdown(`---\nreaders: ${value}\n---\nArticle`);
    assert.equal(parsed.readerCount, expected);
  }
});

test('missing or invalid reader counts are not invented', () => {
  assert.equal('readerCount' in parseMarkdown('Article'), false);
  for (const value of ['', '-1', '1.5', '12 readers', '1e3', '9007199254740992', '[1, 2]']) {
    const parsed = parseMarkdown(`---\nreaders: ${value}\n---\nArticle`);
    assert.equal('readerCount' in parsed, false, `readers: ${value}`);
  }
});

test('article cards and search expose native accessible controls', () => {
  const html = renderToStaticMarkup(React.createElement(FeedSection, { feeds: [feed], onSelectFeed() {} }));
  assert.match(html, /<button[^>]*aria-label="Read Example research"/);
  assert.match(html, /<input[^>]*aria-label="Search research feeds"/);
  assert.match(html, /aria-pressed="true"/);
});

test('category is available as a filter but not displayed on cards', () => {
  const html = renderToStaticMarkup(React.createElement(FeedSection, { feeds: [feed], onSelectFeed() {} }));
  assert.match(html, />Research<\/button>/);
  assert.doesNotMatch(html, /data-slot="cutout-card-inset-label"/);
});

test('cards show reading time without the author', () => {
  const html = renderToStaticMarkup(React.createElement(FeedSection, { feeds: [feed], onSelectFeed() {} }));
  assert.match(html, /1 min read/);
  assert.doesNotMatch(html, />Researcher</);
});

test('cards show known counts, including zero, without inventing missing counts', () => {
  for (const [count, label] of [[0, '0 reads (incl. local)'], [1, '1 read (incl. local)'], [42, '42 reads (incl. local)']]) {
    const html = renderToStaticMarkup(React.createElement(FeedSection, {
      feeds: [{ ...feed, readerCount: count }], onSelectFeed() {},
    }));
    assert.ok(html.includes(label));
  }
  const html = renderToStaticMarkup(React.createElement(FeedSection, { feeds: [feed], onSelectFeed() {} }));
  assert.doesNotMatch(html, /\d+\s+reads?/);
});

test('cards identify browser-only reads when no baseline exists', () => {
  const html = renderToStaticMarkup(React.createElement(FeedSection, {
    feeds: [{ ...feed, localReadCount: 2 }], onSelectFeed() {},
  }));
  assert.match(html, /2 reads \(this browser\)/);
  assert.match(html, /Opened/);
});

test('feed labels do not claim live sync or a fixed number of rows', () => {
  const html = renderToStaticMarkup(React.createElement(FeedSection, { feeds: [feed], onSelectFeed() {} }));
  assert.match(html, /Showing 1 research publications/);
  assert.doesNotMatch(html, /Live Research Repository|sync active|2-row Cutout Card grid|feeds\//);
});

test('reader uses a named native dialog', () => {
  const html = renderToStaticMarkup(React.createElement(FeedReaderModal, { feed, open: true, onOpenChange() {} }));
  assert.match(html, /<dialog[^>]*aria-labelledby="feed-reader-title"/);
  assert.match(html, /id="feed-reader-title"/);
});

test('reader strips duplicate leading title, shows section jump, provenance note and theme toggle', () => {
  const richFeed = {
    ...feed,
    summary: 'Short editorial summary.',
    content: '# Example research\n\n## Section One\n\nBody text.\n\n## Section Two\n\nMore text.',
  };
  const nextFeed = { ...feed, slug: 'next-one', title: 'Next Dispatch' };
  const html = renderToStaticMarkup(
    React.createElement(FeedReaderModal, {
      feed: richFeed,
      feeds: [richFeed, nextFeed],
      onSelectFeed() {},
      open: true,
      onOpenChange() {},
    })
  );
  assert.equal(html.match(/<h1\b/g)?.length, 1);
  assert.match(html, /Short editorial summary\./);
  assert.match(html, /aria-label="Article sections"/);
  assert.match(html, /aria-label="Switch to dark theme"/);
  assert.match(html, /Editorial note:/);
  assert.match(html, /Next Dispatch/);
});

test('frontmatter parses optional source and references when provided', () => {
  const parsed = parseMarkdown('---\nsource: "Internal lab"\nreferences: ["https://example.com/paper"]\n---\nBody');
  assert.equal(parsed.source, 'Internal lab');
  assert.deepEqual(parsed.references, ['https://example.com/paper']);
});

test('reader renders mermaid fences with the diagram container', () => {
  const mermaidFeed = {
    ...feed,
    content: '```mermaid\ngraph TD\n  A-->B\n```',
  };
  const html = renderToStaticMarkup(
    React.createElement(FeedReaderModal, { feed: mermaidFeed, open: true, onOpenChange() {} })
  );
  assert.match(html, /MERMAID DIAGRAM/);
  assert.doesNotMatch(html, /Copy MERMAID block/);
});

test('navigation, footer and logo labels avoid unsupported claims', () => {
  const html = [Navbar, Footer, LogoLoopSection].map((Component) => renderToStaticMarkup(React.createElement(Component))).join(' ');
  assert.doesNotMatch(html, /Node status:|Autonomous Protocol|Technology Partners|title="Source Code"/);
});
