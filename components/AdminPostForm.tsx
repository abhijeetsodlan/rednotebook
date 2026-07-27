"use client";

import { Save } from "lucide-react";
import { useMemo, useState } from "react";
import MarkdownView from "@/components/MarkdownView";
import { slugify } from "@/lib/markdown";

type PostFormData = {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  coverAlt?: string | null;
  tags: string[];
  status: string;
};

export default function AdminPostForm({ post }: { post?: PostFormData }) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [content, setContent] = useState(post?.content || "");
  const [status, setStatus] = useState(post?.status || "draft");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const initialTags = useMemo(() => post?.tags?.join(", ") || "", [post]);

  async function submit(formData: FormData) {
    setBusy(true);
    setMessage("");
    const payload = {
      title,
      slug: slug || slugify(title),
      excerpt: formData.get("excerpt"),
      content,
      coverImage: formData.get("coverImage"),
      coverAlt: formData.get("coverAlt"),
      tags: formData.get("tags"),
      status
    };
    const response = await fetch(post?.id ? `/api/posts/${post.id}` : "/api/posts", {
      method: post?.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setBusy(false);
    if (response.ok) {
      setMessage("Saved.");
      if (!post?.id) window.location.href = "/admin";
      return;
    }
    const data = await response.json().catch(() => ({}));
    setMessage(data.error || "Save failed.");
  }

  return (
    <form action={submit} className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <input value={title} onChange={(event) => { setTitle(event.target.value); if (!post?.slug) setSlug(slugify(event.target.value)); }} placeholder="Title" className="w-full rounded border border-white/10 bg-coal px-4 py-3 text-cream" required />
        <input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="slug" className="w-full rounded border border-white/10 bg-coal px-4 py-3 text-cream" required />
        <textarea name="excerpt" defaultValue={post?.excerpt || ""} placeholder="Excerpt" rows={3} className="w-full rounded border border-white/10 bg-coal px-4 py-3 text-cream" />
        <input name="coverImage" defaultValue={post?.coverImage || ""} placeholder="Cover image URL" className="w-full rounded border border-white/10 bg-coal px-4 py-3 text-cream" />
        <input name="coverAlt" defaultValue={post?.coverAlt || ""} placeholder="Cover image alt text" className="w-full rounded border border-white/10 bg-coal px-4 py-3 text-cream" />
        <input name="tags" defaultValue={initialTags} placeholder="tags, comma separated" className="w-full rounded border border-white/10 bg-coal px-4 py-3 text-cream" />
        <div className="flex gap-2">
          {["draft", "published"].map((value) => <button key={value} type="button" onClick={() => setStatus(value)} className={`rounded px-4 py-2 capitalize ${status === value ? "bg-redflag" : "border border-white/10"}`}>{value}</button>)}
        </div>
        <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Markdown content" rows={18} className="w-full rounded border border-white/10 bg-coal px-4 py-3 font-mono text-sm text-cream" />
        <button disabled={busy} className="inline-flex items-center gap-2 rounded bg-redflag px-5 py-3 font-semibold text-white disabled:opacity-50"><Save className="h-4 w-4" />Save post</button>
        {message ? <p className="text-sm text-poster">{message}</p> : null}
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[.035] p-5">
        <p className="mb-4 font-display uppercase text-cream/70">Live Preview</p>
        <MarkdownView content={content || "Start writing to preview markdown."} />
      </div>
    </form>
  );
}
