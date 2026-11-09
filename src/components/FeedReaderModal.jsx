import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Dialog, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Users, Share2, Download } from '@keyline-icons/react';

export function FeedReaderModal({ feed, open, onOpenChange }) {
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => { setCopyStatus(''); }, [open, feed?.slug]);

  if (!feed) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange} labelledBy="feed-reader-title">
      {/* Modal Header (Light Theme) */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3 border-b border-slate-200/80 bg-slate-50/90">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-xs font-sans font-semibold text-cyan-800">
            {feed.category || 'Research'}
          </span>
          <span className="text-xs font-sans text-slate-500 hidden sm:inline">
            feeds/{feed.slug}.md
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadMd}
            title="Download original .md file"
            className="text-xs font-sans min-h-11 text-slate-700 hover:text-slate-900 hover:bg-slate-200/60"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-cyan-600" />
            .md
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            title="Copy URL"
            className="text-xs font-sans min-h-11 text-slate-700 hover:text-slate-900 hover:bg-slate-200/60"
          >
            <Share2 className="w-3.5 h-3.5 mr-1.5 text-cyan-600" />
            Share
          </Button>

          <DialogClose onClick={() => onOpenChange(false)} />
        </div>
      </div>

      {copyStatus && (
        <div className="px-6 pt-3">
          <p role="status" className="text-xs font-sans text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg inline-block">
            {copyStatus}
          </p>
        </div>
      )}

      {/* Modal Body / Scrollable Content (Light Theme) */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-10 py-8 bg-white">
        {/* Paper Metadata Banner */}
        <div className="mb-8 border-b border-slate-200/80 pb-6">
          <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-slate-500 mb-4">
            {feed.author && (
              <span className="flex items-center gap-1.5 text-cyan-700 font-medium">
                <User className="w-3.5 h-3.5 text-cyan-600" />
                {feed.author}
              </span>
            )}
            {feed.date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {feed.date}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {feed.readingTime}
            </span>
            {(feed.readerCount != null || feed.localReadCount > 0) && (
              <span className="flex items-center gap-1.5 text-slate-600">
                <Users aria-hidden="true" className="w-3.5 h-3.5 text-slate-500" />
                {feed.readerCount != null
                  ? `${feed.readerCount} ${feed.readerCount === 1 ? 'read' : 'reads'} (baseline + this browser)`
                  : `${feed.localReadCount} ${feed.localReadCount === 1 ? 'read' : 'reads'} on this browser`}
              </span>
            )}
          </div>

          <h1 id="feed-reader-title" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
            {feed.title}
          </h1>

          {feed.tags && feed.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {feed.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Markdown Rendered Content */}
        <div className="prose-delta max-w-none text-slate-700">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {feed.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Modal Footer (Light Theme) */}
      <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3 border-t border-slate-200/80 bg-slate-50/90 text-xs font-sans text-slate-600">
        <span className="font-medium text-slate-700">Delta Feed</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="text-xs min-h-11 bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs"
        >
          Close Dispatch
        </Button>
      </div>
    </Dialog>
  );
}
