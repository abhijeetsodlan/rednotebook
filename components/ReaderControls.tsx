"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const sizes = { sm: "17px", md: "19px", lg: "21px", xl: "24px" };

export default function ReaderControls() {
  const [progress, setProgress] = useState(0);
  const [size, setSize] = useState<keyof typeof sizes>("md");

  useEffect(() => {
    const savedSize = localStorage.getItem("reader:size") as keyof typeof sizes | null;
    if (savedSize && sizes[savedSize]) setSize(savedSize);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--reader-size", sizes[size]);
    localStorage.setItem("reader:size", size);
  }, [size]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed left-0 top-0 z-50 h-1 bg-redflag no-print" style={{ width: `${progress}%` }} />
      <div className="no-print flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/45 p-2 text-sm backdrop-blur">
        <div className="flex items-center gap-1">
          {Object.keys(sizes).map((key) => (
            <button
              key={key}
              onClick={() => setSize(key as keyof typeof sizes)}
              className={`h-9 min-w-10 rounded px-3 uppercase transition ${size === key ? "bg-redflag text-white" : "text-cream/65 hover:bg-white/10 hover:text-cream"}`}
            >
              {key}
            </button>
          ))}
        </div>
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded text-cream/70 hover:bg-white/10 hover:text-cream"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}
