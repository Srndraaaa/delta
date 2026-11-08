import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Dialog, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Share2, Download } from '@keyline-icons/react';

export function FeedReaderModal({ feed, open, onOpenChange }) {
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => { setCopyStatus(''); }, [open, feed?.slug]);

  if (!feed) return null;

  const handleCopyLink = async () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('feed', feed.slug);
      await navigator.clipboard.writeText(url.toString());
      setCopyStatus('Copied');
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
      {/* Modal Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3 border-b border-white/10 bg-slate-900/80">
        <div className="flex items-center gap-3">
          <Badge variant="default" className="text-xs">
            {feed.category || 'Research'}
          </Badge>
          <span className="text-xs font-sans text-slate-400 hidden sm:inline">
            feeds/{feed.slug}.md
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadMd}
            title="Download original .md file"
            className="text-xs font-sans min-h-11 text-slate-300"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            .md
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            title="Copy URL"
            className="text-xs font-sans min-h-11 text-slate-300"
          >
            <Share2 className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            Share
          </Button>

          <DialogClose onClick={() => onOpenChange(false)} />
        </div>
      </div>

      {copyStatus && <p role="status" className="px-6 pt-2 text-sm text-slate-200">{copyStatus}</p>}

      {/* Modal Body / Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-10 py-8">
        {/* Paper Metadata Banner */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-slate-400 mb-4">
            {feed.author && <span className="flex items-center gap-1.5 text-cyan-400"><User className="w-3.5 h-3.5" />{feed.author}</span>}
            {feed.date && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{feed.date}</span>}
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {feed.readingTime}
            </span>
          </div>

          <h1 id="feed-reader-title" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
            {feed.title}
          </h1>

          {feed.tags && feed.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {feed.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Markdown Rendered Content */}
        <div className="prose-delta max-w-none text-slate-200">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {feed.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3 border-t border-white/10 bg-slate-900/60 text-xs font-sans text-slate-400">
        <span>Delta Feed</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="text-xs min-h-11"
        >
          Close Dispatch
        </Button>
      </div>
    </Dialog>
  );
}
