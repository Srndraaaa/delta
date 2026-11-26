/**
 * Parses markdown frontmatter and content
 */
export function parseMarkdown(rawContent, fallbackFilename = '') {
  let metadata = {};
  let content = rawContent.trim();

  if (rawContent.startsWith('---')) {
    const endFrontmatter = rawContent.indexOf('---', 3);
    if (endFrontmatter !== -1) {
      const frontmatterText = rawContent.slice(3, endFrontmatter).trim();
      content = rawContent.slice(endFrontmatter + 3).trim();

      frontmatterText.split('\n').forEach((line) => {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const key = line.slice(0, colonIndex).trim();
          let value = line.slice(colonIndex + 1).trim();

          // Clean quotes
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }

          // Array parsing like ["tag1", "tag2"]
          if (value.startsWith('[') && value.endsWith(']')) {
            try {
              value = JSON.parse(value.replace(/'/g, '"'));
            } catch {
              value = value
                .slice(1, -1)
                .split(',')
                .map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
            }
          }

          metadata[key] = value;
        }
      });
    }
  }

  // Fallbacks if metadata is missing
  const slug = metadata.id || fallbackFilename.replace(/\.md$/, '').split('/').pop() || 'article';
  const title = metadata.title || slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const date = metadata.date || '';
  const author = metadata.author || '';
  const category = metadata.category || 'Agentic AI';
  const tags = Array.isArray(metadata.tags) ? metadata.tags : (metadata.tags ? [metadata.tags] : ['AI', 'Research']);
  const readingTime = metadata.readingTime || `${Math.max(2, Math.round(content.split(/\s+/).length / 180))} min read`;
  const summary = metadata.summary || content.slice(0, 180).replace(/[#*`_]/g, '') + '...';
  const image = metadata.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop';
  const badge = metadata.badge || null;
  const source = typeof metadata.source === 'string' ? metadata.source : '';
  const references = Array.isArray(metadata.references)
    ? metadata.references
    : (metadata.references ? [metadata.references] : []);
  const readers = metadata.readers;
  const readerCount = typeof readers === 'string' && /^\d+$/.test(readers) && Number.isSafeInteger(Number(readers))
    ? Number(readers)
    : undefined;

  return {
    slug,
    title,
    date,
    author,
    category,
    tags,
    readingTime,
    summary,
    image,
    badge,
    ...(source ? { source } : {}),
    ...(references.length ? { references } : {}),
    ...(readerCount !== undefined ? { readerCount } : {}),
    content,
    raw: rawContent,
  };
}

/**
 * Formats reader count concisely while distinguishing local vs baseline counts.
 */
export function formatReadCount(feed) {
  if (!feed) return null;
  if (feed.readerCount != null) {
    return `${feed.readerCount} ${feed.readerCount === 1 ? 'read' : 'reads'} (incl. local)`;
  }
  if (feed.localReadCount > 0) {
    return `${feed.localReadCount} ${feed.localReadCount === 1 ? 'read' : 'reads'} (this browser)`;
  }
  return null;
}

/**
 * Loads all markdown feeds from /feeds directory
 */
export function loadFeeds() {
  const modules = import.meta.glob(['/feeds/*.md', '../../feeds/*.md'], {
    query: '?raw',
    import: 'default',
    eager: true,
  });

  const feeds = [];

  for (const [filepath, rawText] of Object.entries(modules)) {
    const filename = filepath.split('/').pop();
    const parsed = parseMarkdown(rawText, filename);
    feeds.push(parsed);
  }

  // Sort descending by date
  return feeds.sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
}
