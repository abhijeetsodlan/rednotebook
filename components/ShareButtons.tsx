"use client";

import { Copy, MessageCircle, Twitter } from "lucide-react";

export default function ShareButtons({ title, path }: { title: string; path: string }) {
  const shareUrl = typeof window === "undefined" ? path : `${window.location.origin}${path}`;
  return (
    <div className="no-print mt-12 flex flex-wrap gap-3 border-t border-white/10 pt-6 text-sm">
      <button
        className="inline-flex items-center gap-2 rounded border border-white/10 px-3 py-2 hover:border-redflag"
        onClick={() => navigator.clipboard.writeText(shareUrl)}
      >
        <Copy className="h-4 w-4" />Copy link
      </button>
      <a className="inline-flex items-center gap-2 rounded border border-white/10 px-3 py-2 hover:border-redflag" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}>
        <Twitter className="h-4 w-4" />X
      </a>
      <a className="inline-flex items-center gap-2 rounded border border-white/10 px-3 py-2 hover:border-redflag" href={`https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`}>
        <MessageCircle className="h-4 w-4" />WhatsApp
      </a>
    </div>
  );
}
