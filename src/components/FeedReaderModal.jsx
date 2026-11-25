import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Dialog, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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

function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false);
  const child = React.Children.toArray(children)[0];
  const className = React.isValidElement(child) ? child.props?.className || '' : '';
  const rawText = getNodeText(child).replace(/\n$/, '');
  const langMatch = className.match(/language-([\w-]+)/);
  const lang = langMatch ? langMatch[1].toLowerCase() : 'diagram';
  const label = lang === 'mermaid' ? 'Architecture Diagram (Mermaid)' : lang.toUpperCase();

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

export function FeedReaderModal({ feed, open, onOpenChange, feeds = [], onSelectFeed }) {
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

  const handleScroll = (event) => {
    const el = event.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    setScrollProgress(maxScroll > 0 ? Math.min(100, Math.round((el.scrollTop / maxScroll) * 100)) : 0);
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

  const markdownComponents = {
    h2: ({ children }) => {
      const id = slugifyHeading(getNodeText(children));
      return (
        <h2 id={id} className="scroll-mt-6">
          {children}
        </h2>
      );
    },
    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
    table: ({ children }) => (
      <div
        className={`my-6 w-full overflow-x-auto rounded-xl border ${
          isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200/90 bg-white'
        }`}
      >
        <table>{children}</table>
      </div>
    ),
  };

  return (
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
              className={`text-xs font-mono hidden sm:inline truncate ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              feeds/{feed.slug}.md
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
                {(feed.readerCount != null || feed.localReadCount > 0) && (
                  <span className="flex items-center gap-1.5">
                    <Users aria-hidden="true" className="w-3.5 h-3.5 opacity-70" />
                    {feed.readerCount != null
                      ? `${feed.readerCount} ${feed.readerCount === 1 ? 'read' : 'reads'} (baseline + this browser)`
                      : `${feed.localReadCount} ${feed.localReadCount === 1 ? 'read' : 'reads'} on this browser`}
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
                  {feed.tags.map((tag, idx) => (
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
                  ))}
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
            <div className="prose-delta max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {articleBody}
              </ReactMarkdown>
            </div>

            {/* Previous / Next Dispatch Navigation */}
            {onSelectFeed && (prevFeed || nextFeed) && (
              <nav
                aria-label="Adjacent dispatches"
                className={`mt-12 pt-6 border-t grid grid-cols-1 sm:grid-cols-2 gap-3 ${
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
  );
}
