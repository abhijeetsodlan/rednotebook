"use client";

import { Edit, LogOut, Trash2 } from "lucide-react";
import Link from "next/link";

export function LogoutButton() {
  return (
    <button
      className="rounded border border-white/10 px-3 py-2 text-sm hover:border-redflag"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/admin/login";
      }}
    >
      <LogOut className="mr-2 inline h-4 w-4" />Logout
    </button>
  );
}

export function PostRowActions({ id, status }: { id: string; status: string }) {
  return (
    <div className="flex justify-end gap-2">
      <button
        className="rounded border border-white/10 px-3 py-2 text-xs hover:border-redflag"
        onClick={async () => {
          const nextStatus = status === "published" ? "draft" : "published";
          const response = await fetch(`/api/posts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: nextStatus })
          });
          if (response.ok) window.location.reload();
        }}
      >
        {status === "published" ? "Unpublish" : "Publish"}
      </button>
      <Link className="rounded border border-white/10 p-2 hover:border-redflag" href={`/admin/edit/${id}`} aria-label="Edit post"><Edit className="h-4 w-4" /></Link>
      <button
        className="rounded border border-white/10 p-2 hover:border-redflag"
        aria-label="Delete post"
        onClick={async () => {
          if (!confirm("Delete this post permanently?")) return;
          const response = await fetch(`/api/posts/${id}`, { method: "DELETE" });
          if (response.ok) window.location.reload();
        }}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
