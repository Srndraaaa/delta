import React, { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FeedReaderModal } from '../src/components/FeedReaderModal';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const results = [];
const feed = { slug: 'example', title: 'Example research', category: 'Research', tags: [], content: 'Content', readingTime: '1 min read' };

function App() {
  const [open, setOpen] = useState(false);
  return <><button id="open" onClick={() => setOpen(true)}>Open</button><FeedReaderModal feed={feed} open={open} onOpenChange={setOpen} /></>;
}

async function check(name, action) {
  try {
    await action();
    results.push(`PASS ${name}`);
  } catch (error) {
    results.push(`FAIL ${name}: ${error.message}`);
  }
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function luminance(rgb) {
  return rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrast(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const root = createRoot(document.getElementById('root'));
await act(async () => root.render(<App />));
const opener = document.getElementById('open');
opener.focus();
await act(async () => opener.click());

await check('dialog opens and takes focus', () => {
  const dialog = document.querySelector('dialog');
  expect(dialog?.open && dialog.contains(document.activeElement), 'dialog is not open or focused');
});

let copiedUrl;
Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (value) => { copiedUrl = value; } } });
await check('share copies a link to the selected article', async () => {
  await act(async () => document.querySelector('[title="Copy URL"]').click());
  expect(new URL(copiedUrl).searchParams.get('feed') === 'example', 'copied URL does not identify the article');
  expect(document.body.textContent.includes('Copied'), 'success was not reported');
});

Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('denied'); } } });
await check('share reports clipboard failure', async () => {
  await act(async () => document.querySelector('[title="Copy URL"]').click());
  expect(document.body.textContent.includes('Could not copy'), 'clipboard failure was not reported');
});

await check('download prepares the selected Markdown', async () => {
  const create = URL.createObjectURL;
  const revoke = URL.revokeObjectURL;
  const click = HTMLAnchorElement.prototype.click;
  let blob;
  let filename;
  try {
    URL.createObjectURL = (value) => { blob = value; return 'blob:test'; };
    URL.revokeObjectURL = () => {};
    HTMLAnchorElement.prototype.click = function () { filename = this.download; };
    await act(async () => document.querySelector('[title="Download original .md file"]').click());
    expect(filename === 'example.md' && await blob.text() === 'Content', 'wrong download name or content');
  } finally {
    URL.createObjectURL = create;
    URL.revokeObjectURL = revoke;
    HTMLAnchorElement.prototype.click = click;
  }
});

await check('Escape closes the dialog and restores focus', async () => {
  const dialog = document.querySelector('dialog');
  await act(async () => dialog.dispatchEvent(new Event('cancel', { cancelable: true })));
  expect(!dialog.open, 'dialog is still open');
  expect(document.activeElement === opener, 'focus did not return to the opener');
});

await check('clicking the backdrop closes the dialog', async () => {
  await act(async () => opener.click());
  const dialog = document.querySelector('dialog');
  await act(async () => dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 0, clientY: 0 })));
  expect(!dialog.open && document.activeElement === opener, 'backdrop did not close the dialog');
});

await check('footer close button closes the dialog', async () => {
  await act(async () => opener.click());
  const dialog = document.querySelector('dialog');
  await act(async () => [...dialog.querySelectorAll('button')].find((button) => button.textContent.includes('Close Dispatch')).click());
  expect(!dialog.open && document.activeElement === opener, 'footer button did not close the dialog');
});

await check('an article link opens the selected article', async () => {
  const frame = document.createElement('iframe');
  frame.style.width = '320px';
  frame.style.height = '700px';
  frame.src = '/?feed=self-healing-agent-swarms';
  document.body.appendChild(frame);
  await new Promise((resolve) => { frame.onload = () => setTimeout(resolve, 1500); });
  const title = frame.contentDocument.querySelector('dialog[open] #feed-reader-title');
  expect(title?.textContent.includes('Self-Healing Swarms'), 'shared link did not open the article');

  await check('galaxy context survives Strict Mode', () => {
    const gl = frame.contentDocument.querySelector('.galaxy-canvas').getContext('webgl2');
    expect(!gl || !gl.isContextLost(), 'galaxy WebGL context was lost');
  });

  if (frame.contentWindow.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    await check('reduced motion disables hero entrance animation', () => {
      for (const element of frame.contentDocument.querySelectorAll('.animate-fade-in')) {
        expect(frame.contentWindow.getComputedStyle(element).animationName === 'none', 'hero entrance still animates');
        expect(frame.contentWindow.getComputedStyle(element).opacity === '1', 'hero content is hidden');
      }
    });
  }

  await check('primary action text has sufficient contrast', () => {
    const button = [...frame.contentDocument.querySelectorAll('button')].find((item) => item.textContent.includes('Browse Research Feeds'));
    const style = frame.contentWindow.getComputedStyle(button);
    const rgb = (value) => value.match(/[\d.]+/g).slice(0, 3).map(Number);
    const backgrounds = style.backgroundImage.match(/rgba?\([^)]+\)/g) || [style.backgroundColor];
    for (const background of backgrounds) {
      const ratio = contrast(rgb(style.color), rgb(background));
      expect(ratio >= 4.5, `text contrast is ${ratio.toFixed(2)}:1`);
    }
  });

  await check('reader controls fit a 320px viewport', () => {
    const dialog = frame.contentDocument.querySelector('dialog');
    const bounds = dialog.getBoundingClientRect();
    for (const button of dialog.querySelectorAll('button')) {
      const rect = button.getBoundingClientRect();
      expect(rect.left >= bounds.left && rect.right <= bounds.right, `${button.textContent.trim() || button.getAttribute('aria-label')} is clipped`);
      expect(rect.width >= 44 && rect.height >= 44, `${button.textContent.trim() || button.getAttribute('aria-label')} has a small touch target`);
    }
  });

  await check('logo links have mobile-sized touch targets', () => {
    const link = frame.contentDocument.querySelector('.logoloop__content[href]');
    const rect = link.getBoundingClientRect();
    expect(rect.width >= 44 && rect.height >= 44, `logo target is ${rect.width} by ${rect.height}`);
  });

  await check('search, category filter and reset work', async () => {
    const doc = frame.contentDocument;
    doc.querySelector('dialog [aria-label="Close"]').click();
    const category = doc.querySelector('button[aria-pressed="false"]');
    expect(category, 'category filter missing');
    category.click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(category.getAttribute('aria-pressed') === 'true', 'category filter did not activate');
    const input = doc.querySelector('[aria-label="Search research feeds"]');
    const setter = Object.getOwnPropertyDescriptor(frame.contentWindow.HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'no-such-article-987654');
    input.dispatchEvent(new frame.contentWindow.Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(doc.body.textContent.includes('No research feeds match your search'), 'empty search state did not appear');
    const clear = [...doc.querySelectorAll('button')].find((button) => button.textContent.includes('Clear Filters'));
    const rect = clear.getBoundingClientRect();
    expect(rect.height >= 44, `clear filters target is ${rect.height}px high`);
    clear.click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(input.value === '' && doc.querySelector('button[aria-pressed="true"]').textContent === 'All', 'filters did not reset');
    expect(doc.querySelectorAll('button[aria-label^="Read "]').length > 0, 'articles did not return');
  });

  await check('article card opens the reader and close returns focus', async () => {
    const doc = frame.contentDocument;
    const card = doc.querySelector('button[aria-label^="Read "]');
    card.focus();
    card.click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(doc.querySelector('dialog[open]'), 'card did not open the reader');
    doc.querySelector('dialog [aria-label="Close"]').click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(!doc.querySelector('dialog[open]') && doc.activeElement === card, 'reader did not close or restore focus');
  });

  await check('navigation focus indicator contrasts with its background', async () => {
    const button = frame.contentDocument.querySelector('header button');
    button.focus();
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(button.matches(':focus-visible'), 'keyboard focus is not visible');
    const ringColor = frame.contentWindow.getComputedStyle(button).getPropertyValue('--tw-ring-color');
    const values = ringColor.match(/[\d.]+/g);
    expect(values, 'focus ring is missing');
    const ring = values.map(Number);
    const background = [5, 5, 8];
    const alpha = ring[3] ?? 1;
    const blended = background.map((color, index) => color * (1 - alpha) + ring[index] * alpha);
    const ratio = contrast(blended, background);
    expect(ratio >= 3, `focus contrast is ${ratio.toFixed(2)}:1`);
  });

  await check('navigation and hero actions target the feed', async () => {
    const doc = frame.contentDocument;
    const prototype = frame.contentWindow.Element.prototype;
    const scroll = prototype.scrollIntoView;
    let target;
    let options;
    try {
      prototype.scrollIntoView = function (value) { target = this; options = value; };
      for (const label of ['Research Feed', 'Browse Research Feeds']) {
        target = null;
        [...doc.querySelectorAll('button')].find((button) => button.textContent.includes(label)).click();
        expect(target?.id === 'feeds', `${label} did not target the feed`);
        if (frame.contentWindow.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          expect(options?.behavior !== 'smooth', `${label} ignores reduced motion`);
        }
      }
    } finally {
      prototype.scrollIntoView = scroll;
    }
  });

  await check('cards and navigation fit phone, tablet and desktop widths', async () => {
    const doc = frame.contentDocument;
    for (const width of [320, 375, 768, 1024, 1440]) {
      frame.style.width = `${width}px`;
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(doc.documentElement.scrollWidth <= width, `page overflows at ${width}px`);
      for (const item of doc.querySelectorAll('header button, button[aria-label^="Read "]')) {
        const rect = item.getBoundingClientRect();
        expect(rect.left >= 0 && rect.right <= width, `control is clipped at ${width}px`);
      }
    }
  });
  frame.remove();
});

document.getElementById('results').textContent = results.join('\n');
