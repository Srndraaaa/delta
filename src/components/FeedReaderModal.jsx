import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Dialog, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Share2, Check, Download, FileText } from 'lucide-react';

export function FeedReaderModal({ feed, open, onOpenChange }) {
  const [copied, setCopied] = useState(false);

  if (!feed) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Badge variant="default" className="text-xs">
            {feed.category || 'Research'}
          </Badge>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            feeds/{feed.slug}.md
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadMd}
            title="Download original .md file"
            className="text-xs font-mono h-8 text-slate-300"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            .md
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            title="Copy URL"
            className="text-xs font-mono h-8 text-slate-300"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                Copied
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                Share
              </>
            )}
          </Button>

          <DialogClose onClick={() => onOpenChange(false)} />
        </div>
      </div>

      {/* Modal Body / Scrollable Content */}
      <div className="overflow-y-auto px-6 sm:px-10 py-8 max-h-[calc(90vh-140px)]">
        {/* Paper Metadata Banner */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mb-4">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <User className="w-3.5 h-3.5" />
              {feed.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {feed.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {feed.readingTime}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
            {feed.title}
          </h1>

          {feed.tags && feed.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {feed.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/20"
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
      <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-slate-900/60 text-xs font-mono text-slate-400">
        <span>Delta Research Node • 2026</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="text-xs h-8"
        >
          Close Dispatch
        </Button>
      </div>
    </Dialog>
  );
}
