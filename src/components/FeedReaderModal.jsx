import React, { createContext, memo, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Dialog, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatReadCount } from '@/lib/feedLoader';
import {
  Calendar,
  Clock,
  User,
  Users,
  Share2,
  Download,
  Sun,
  Moon,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from '@keyline-icons/react';

function slugifyHeading(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function getNodeText(node) {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join('');
  if (React.isValidElement(node)) return getNodeText(node.props?.children);
  return '';
}

function stripLeadingTitle(content = '', title = '') {
  const trimmed = content.trimStart();
  const match = trimmed.match(/^#\s+([^\n]+)\r?\n*/);
  if (!match) return content;
  const firstHeading = match[1].trim().toLowerCase();
  if (!title || firstHeading === title.trim().toLowerCase()) {
    return trimmed.slice(match[0].length).trimStart();
  }
  return content;
}

function extractSections(markdown = '') {
  const sections = [];
  let inFence = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (line.trim().startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (!inFence && line.startsWith('## ')) {
      const label = line.slice(3).trim();
      if (label) sections.push({ label, id: slugifyHeading(label) });
    }
  }
  return sections;
}

const ReaderThemeContext = createContext(false);
const mermaidSvgCache = new Map();

function MermaidDiagram({ chart }) {
  const isDark = useContext(ReaderThemeContext);
  const rawId = useId();
  const renderId = `mermaid-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const cacheKey = `${isDark ? 'd' : 'l'}:${chart}`;
  const [svg, setSvg] = useState(() => mermaidSvgCache.get(cacheKey) || '');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const cached = mermaidSvgCache.get(cacheKey);
    if (cached) {
      setSvg(cached);
      setFailed(false);
      return undefined;
    }

    let active = true;
    setFailed(false);

    import('mermaid')
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: isDark ? 'dark' : 'neutral',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        });
        const { svg: rendered } = await mermaid.render(`${renderId}-${isDark ? 'd' : 'l'}`, chart);
        mermaidSvgCache.set(cacheKey, rendered);
        if (active) setSvg(rendered);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, [cacheKey, chart, isDark, renderId]);

  if (failed || !svg) {
    return (
      <div className="my-6 overflow-hidden rounded-xl border border-slate-800 bg-[#0b1120] shadow-sm">
        <div className="border-b border-slate-800/90 bg-slate-900/90 px-4 py-2 text-[11px] font-mono tracking-wider text-slate-400">
          MERMAID DIAGRAM
        </div>
        <pre className="!border-0 !rounded-none !bg-transparent">
          <code>{chart}</code>
        </pre>
      </div>
    );
  }

  return (
    <figure
      className={`my-6 overflow-hidden rounded-xl border ${
        isDark ? 'border-slate-800 bg-slate-900/70' : 'border-stone-200/90 bg-white'
      }`}
    >
      <div
        className="overflow-x-auto p-4 sm:p-6 flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </figure>
  );
}

function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false);
  const child = React.Children.toArray(children)[0];
  const className = React.isValidElement(child) ? child.props?.className || '' : '';
  const rawText = getNodeText(child).replace(/\n$/, '');
  const langMatch = className.match(/language-([\w-]+)/);
  const lang = langMatch ? langMatch[1].toLowerCase() : 'diagram';

  if (lang === 'mermaid') {
    return <MermaidDiagram chart={rawText} />;
  }

  const label = lang.toUpperCase();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-slate-800 bg-[#0b1120] shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/90 bg-slate-900/90 px-4 py-1 text-[11px] font-mono tracking-wider text-slate-400">
        <span className="min-w-0 truncate">{label}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${label} block`}
          className="inline-flex shrink-0 min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-sans text-slate-300 hover:bg-slate-800 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="!border-0 !rounded-none !bg-transparent">{children}</pre>
    </div>
  );
}

function MarkdownH2({ children }) {
  const id = slugifyHeading(getNodeText(children));
  return (
    <h2 id={id} className="scroll-mt-6">
      {children}
    </h2>
  );
}

function MarkdownTable({ children }) {
  const isDark = useContext(ReaderThemeContext);
  return (
    <div
      className={`my-6 w-full overflow-x-auto rounded-xl border ${
        isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200/90 bg-white'
      }`}
    >
      <table>{children}</table>
    </div>
  );
}

// Keep component references module-stable so scroll progress updates never remount diagrams.
const MARKDOWN_COMPONENTS = {
  h2: MarkdownH2,
  pre: CodeBlock,
  table: MarkdownTable,
};

const ArticleMarkdown = memo(function ArticleMarkdown({ content }) {
  return (
    <div className="prose-delta max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
        {content}
      </ReactMarkdown>
    </div>
  );
});

export function FeedReaderModal({
  feed,
  open,
  onOpenChange,
  feeds = [],
  onSelectFeed,
  onSelectTag,
}) {
  const [copyStatus, setCopyStatus] = useState('');
  const [readerTheme, setReaderTheme] = useState('paper');
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollBodyRef = useRef(null);

  useEffect(() => {
    setCopyStatus('');
    setScrollProgress(0);
    if (scrollBodyRef.current) {
      scrollBodyRef.current.scrollTop = 0;
    }
  }, [open, feed?.slug]);

  const articleBody = useMemo(
    () => (feed ? stripLeadingTitle(feed.content, feed.title) : ''),
    [feed]
  );

  const sections = useMemo(() => extractSections(articleBody), [articleBody]);

  const { prevFeed, nextFeed } = useMemo(() => {
    if (!feed || !feeds.length) return { prevFeed: null, nextFeed: null };
    const idx = feeds.findIndex((item) => item.slug === feed.slug);
    if (idx === -1) return { prevFeed: null, nextFeed: null };
    return {
      prevFeed: idx > 0 ? feeds[idx - 1] : null,
      nextFeed: idx < feeds.length - 1 ? feeds[idx + 1] : null,
    };
  }, [feed, feeds]);

  if (!feed) return null;

  const isDark = readerTheme === 'dark';
  const readCountLabel = formatReadCount(feed);
  const hasReferences = Boolean(feed.source || feed.references?.length);

  const handleScroll = (event) => {
    const el = event.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const next = maxScroll > 0 ? Math.min(100, Math.round((el.scrollTop / maxScroll) * 100)) : 0;
    setScrollProgress((prev) => (prev === next ? prev : next));
  };

  const scrollToSection = (id) => {
    const target = scrollBodyRef.current?.querySelector(`#${CSS.escape(id)}`);
    if (!target) return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const handleCopyLink = async () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('feed', feed.slug);
      await navigator.clipboard.writeText(url.toString());
      setCopyStatus('Copied to clipboard');
    } catch {
      setCopyStatus('Could not copy the link. Check clipboard permissions.');
    }
  };

  const handleDownloadMd = () => {
    const blob = new Blob([feed.raw || feed.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${feed.slug || 'research-feed'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ReaderThemeContext.Provider value={isDark}>
      <Dialog open={open} onOpenChange={onOpenChange} labelledBy="feed-reader-title">
      <div
        data-reader-theme={readerTheme}
        className={`flex flex-1 min-h-0 flex-col transition-colors duration-200 ${
          isDark ? 'bg-[#0f172a] text-slate-200' : 'bg-[#fcfbf8] text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2.5 border-b ${
            isDark
              ? 'border-slate-800 bg-slate-900/95'
              : 'border-stone-200/90 bg-[#f6f4ee]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-sans font-semibold ${
                isDark
                  ? 'border-cyan-800/70 bg-cyan-950/60 text-cyan-300'
                  : 'border-cyan-200 bg-cyan-50 text-cyan-800'
              }`}
            >
              {feed.category || 'Research'}
            </span>
            <span
              className={`text-xs font-sans hidden sm:inline truncate ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {feed.date || 'Research Dispatch'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReaderTheme(isDark ? 'paper' : 'dark')}
              aria-pressed={isDark}
              aria-label={isDark ? 'Switch to paper theme' : 'Switch to dark theme'}
              title={isDark ? 'Paper theme' : 'Dark theme'}
              className={`min-w-11 min-h-11 px-2.5 text-xs font-sans ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-stone-200/70'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadMd}
              title="Download original .md file"
              className={`text-xs font-sans min-w-11 min-h-11 ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-stone-200/70'
              }`}
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-cyan-600" />
              .md
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              title="Copy URL"
              className={`text-xs font-sans min-w-11 min-h-11 ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-stone-200/70'
              }`}
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5 text-cyan-600" />
              Share
            </Button>

            <DialogClose
              onClick={() => onOpenChange(false)}
              className={
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800 focus-visible:outline-cyan-400'
                  : 'hover:bg-stone-200/70'
              }
            />
          </div>
        </div>

        {/* Reading progress indicator */}
        <div
          aria-hidden="true"
          className={`h-0.5 w-full ${isDark ? 'bg-slate-800' : 'bg-stone-200'}`}
        >
          <div
            className="h-full bg-cyan-600 transition-[width] duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {copyStatus && (
          <div className="px-6 pt-3">
            <p role="status" className="text-xs font-sans text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg inline-block">
              {copyStatus}
            </p>
          </div>
        )}

        {/* Modal Body / Scrollable Reading Column */}
        <div
          ref={scrollBodyRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-10 py-8 sm:py-10"
        >
          <article className="mx-auto max-w-[66ch]">
            {feed.image && (
              <div className="mb-7 overflow-hidden rounded-2xl border border-black/10">
                <img
                  src={feed.image}
                  alt={feed.title}
                  onError={(e) => {
                    e.currentTarget.parentElement.style.display = 'none';
                  }}
                  className="h-44 sm:h-56 w-full object-cover"
                />
              </div>
            )}

            {/* Paper Metadata Banner */}
            <header
              className={`mb-8 border-b pb-6 ${
                isDark ? 'border-slate-800' : 'border-stone-200'
              }`}
            >
              <div
                className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-sans mb-4 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {feed.author && (
                  <span
                    className={`flex items-center gap-1.5 font-medium ${
                      isDark ? 'text-cyan-400' : 'text-cyan-800'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-cyan-600" />
                    {feed.author}
                  </span>
                )}
                {feed.date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 opacity-70" />
                    {feed.date}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 opacity-70" />
                  {feed.readingTime}
                </span>
                {readCountLabel && (
                  <span className="flex items-center gap-1.5">
                    <Users aria-hidden="true" className="w-3.5 h-3.5 opacity-70" />
                    {readCountLabel}
                  </span>
                )}
              </div>

              <h1
                id="feed-reader-title"
                className={`font-display text-2xl sm:text-3xl lg:text-[2.125rem] font-bold tracking-tight leading-[1.2] ${
                  isDark ? 'text-slate-50' : 'text-slate-900'
                }`}
              >
                {feed.title}
              </h1>

              {feed.summary && (
                <p
                  className={`mt-4 text-base sm:text-[1.0625rem] leading-relaxed font-sans ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {feed.summary}
                </p>
              )}

              {feed.tags && feed.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {feed.tags.map((tag, idx) =>
                    onSelectTag ? (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onSelectTag(tag)}
                        className={`min-h-11 px-3 py-1 rounded-full border text-xs font-sans font-medium transition-colors cursor-pointer ${
                          isDark
                            ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-cyan-500 hover:text-cyan-300'
                            : 'bg-stone-100 text-slate-700 border-stone-200/90 hover:border-cyan-600 hover:text-cyan-800'
                        }`}
                      >
                        #{tag}
                      </button>
                    ) : (
                      <span
                        key={idx}
                        className={`text-xs font-sans px-2.5 py-0.5 rounded-full border font-medium ${
                          isDark
                            ? 'bg-slate-800/80 text-slate-300 border-slate-700'
                            : 'bg-stone-100 text-slate-700 border-stone-200/90'
                        }`}
                      >
                        #{tag}
                      </span>
                    )
                  )}
                </div>
              )}
            </header>

            {/* Quick Section Jump for Multi-Section Papers */}
            {sections.length >= 2 && (
              <nav
                aria-label="Article sections"
                className={`mb-8 rounded-xl border p-4 ${
                  isDark
                    ? 'border-slate-800 bg-slate-900/60'
                    : 'border-stone-200/90 bg-[#f6f4ee]'
                }`}
              >
                <p
                  className={`text-[11px] font-mono uppercase tracking-widest mb-2 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  In This Dispatch
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className={`min-h-11 px-3 py-2 rounded-lg text-left text-xs font-sans font-medium transition-colors cursor-pointer ${
                        isDark
                          ? 'text-slate-300 hover:bg-slate-800 hover:text-cyan-300'
                          : 'text-slate-700 hover:bg-stone-200/60 hover:text-cyan-800'
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              </nav>
            )}

            {/* Markdown Rendered Content */}
            <ArticleMarkdown content={articleBody} />

            {/* Sources / Editorial Provenance Note */}
            <aside
              aria-label="Sources and methodology"
              className={`mt-10 rounded-xl border p-4 text-xs font-sans leading-relaxed ${
                isDark
                  ? 'border-slate-800 bg-slate-900/50 text-slate-400'
                  : 'border-stone-200/90 bg-[#f6f4ee] text-slate-600'
              }`}
            >
              {hasReferences ? (
                <div className="space-y-2">
                  <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Sources & References
                  </p>
                  {feed.source && <p>{feed.source}</p>}
                  {feed.references?.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1">
                      {feed.references.map((ref, idx) => (
                        <li key={idx}>
                          {/^https?:\/\//.test(ref) ? (
                            <a
                              href={ref}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="inline-flex items-center gap-1 underline text-cyan-600 hover:text-cyan-500"
                            >
                              <span>{ref}</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          ) : (
                            ref
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <p>
                  <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                    Editorial note:
                  </strong>{' '}
                  This dispatch is an engineering synthesis brief; figures and benchmark examples summarize representative scenarios without external citations attached yet.
                </p>
              )}
            </aside>

            {/* Previous / Next Dispatch Navigation */}
            {onSelectFeed && (prevFeed || nextFeed) && (
              <nav
                aria-label="Adjacent dispatches"
                className={`mt-8 pt-6 border-t grid grid-cols-1 sm:grid-cols-2 gap-3 ${
                  isDark ? 'border-slate-800' : 'border-stone-200'
                }`}
              >
                {prevFeed ? (
                  <button
                    type="button"
                    onClick={() => onSelectFeed(prevFeed)}
                    className={`min-h-11 min-w-0 w-full overflow-hidden flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                      isDark
                        ? 'border-slate-800 bg-slate-900/60 hover:border-cyan-700 text-slate-200'
                        : 'border-stone-200 bg-white hover:border-slate-400 text-slate-800'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 shrink-0 text-cyan-600" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        Previous Dispatch
                      </span>
                      <span className="block text-xs font-semibold truncate">
                        {prevFeed.title}
                      </span>
                    </span>
                  </button>
                ) : (
                  <div />
                )}

                {nextFeed && (
                  <button
                    type="button"
                    onClick={() => onSelectFeed(nextFeed)}
                    className={`min-h-11 min-w-0 w-full overflow-hidden flex items-center justify-end gap-3 rounded-xl border p-3.5 text-right transition-colors cursor-pointer ${
                      isDark
                        ? 'border-slate-800 bg-slate-900/60 hover:border-cyan-700 text-slate-200'
                        : 'border-stone-200 bg-white hover:border-slate-400 text-slate-800'
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        Next Dispatch
                      </span>
                      <span className="block text-xs font-semibold truncate">
                        {nextFeed.title}
                      </span>
                    </span>
                    <ChevronRight className="w-4 h-4 shrink-0 text-cyan-600" />
                  </button>
                )}
              </nav>
            )}
          </article>
        </div>

        {/* Modal Footer */}
        <div
          className={`flex items-center justify-between gap-2 px-4 sm:px-6 py-2.5 border-t text-xs font-sans ${
            isDark
              ? 'border-slate-800 bg-slate-900/95 text-slate-400'
              : 'border-stone-200/90 bg-[#f6f4ee] text-slate-600'
          }`}
        >
          <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Delta Feed {scrollProgress > 0 ? `· ${scrollProgress}% read` : ''}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={`text-xs min-h-11 shadow-xs ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-stone-100 text-slate-700 border-stone-300'
            }`}
          >
            Close Dispatch
          </Button>
        </div>
      </div>
    </Dialog>
    </ReaderThemeContext.Provider>
  );
}
