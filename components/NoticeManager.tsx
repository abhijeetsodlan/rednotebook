"use client";

import { useState } from "react";

export default function NoticeManager({ notice }: { notice?: { message: string; active: boolean; expiresAt: string | null } | null }) {
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    const response = await fetch("/api/notice", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: formData.get("message"),
        active: formData.get("active") === "on",
        expiresAt: formData.get("expiresAt")
      })
    });
    setMessage(response.ok ? "Notice saved." : "Notice save failed.");
  }

  async function remove() {
    if (!confirm("Delete all notices?")) return;
    const response = await fetch("/api/notice", { method: "DELETE" });
    if (response.ok) window.location.reload();
  }

  return (
    <form action={submit} className="space-y-3 rounded-lg border border-white/10 bg-white/[.035] p-5">
      <h2 className="font-display text-2xl uppercase">Notice Manager</h2>
      <textarea name="message" defaultValue={notice?.message || ""} rows={3} placeholder="Site notice" className="w-full rounded border border-white/10 bg-coal px-4 py-3 text-cream" />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={notice?.active || false} /> Active</label>
      <input name="expiresAt" type="datetime-local" defaultValue={notice?.expiresAt ? notice.expiresAt.slice(0, 16) : ""} className="w-full rounded border border-white/10 bg-coal px-4 py-3 text-cream" />
      <div className="flex gap-2">
        <button className="rounded bg-redflag px-4 py-2 font-semibold">Save notice</button>
        <button type="button" onClick={remove} className="rounded border border-white/10 px-4 py-2">Delete</button>
      </div>
      {message ? <p className="text-sm text-poster">{message}</p> : null}
    </form>
  );
}
