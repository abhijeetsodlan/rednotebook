"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function NoticeBanner({ id, message }: { id: string; message: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(`notice:${id}`) !== "dismissed");
  }, [id]);

  if (!visible) return null;

  return (
    <div className="no-print border-y border-redflag/50 bg-redflag/15">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 text-sm text-cream">
        <p>{message}</p>
        <button
          className="rounded p-1 text-cream/75 hover:bg-white/10 hover:text-cream"
          aria-label="Dismiss notice"
          onClick={() => {
            localStorage.setItem(`notice:${id}`, "dismissed");
            setVisible(false);
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
