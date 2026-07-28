export const dynamic = 'force-dynamic';

import Link from "next/link";
import { Plus } from "lucide-react";
import { LogoutButton, PostRowActions } from "@/components/AdminActions";
import NoticeManager from "@/components/NoticeManager";
import { getAllAdminPosts, getLatestNotice } from "@/lib/mongo-store";
import { normalizeTags } from "@/lib/markdown";

export default async function AdminPage() {
  const [posts, notice] = await Promise.all([getAllAdminPosts(), getLatestNotice()]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-5xl uppercase">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/new" className="rounded bg-redflag px-4 py-2 font-semibold"><Plus className="mr-2 inline h-4 w-4" />New</Link>
          <LogoutButton />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[.06] text-cream/70">
              <tr><th className="p-3">Title</th><th className="p-3">Status</th><th className="p-3">Tags</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-white/10">
                  <td className="p-3 font-medium">{post.title}</td>
                  <td className="p-3"><span className={`rounded px-2 py-1 text-xs ${post.status === "published" ? "bg-redflag" : "bg-white/10"}`}>{post.status}</span></td>
                  <td className="p-3 text-cream/55">{normalizeTags(post.tags).join(", ")}</td>
                  <td className="p-3"><PostRowActions id={post.id} status={post.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!posts.length ? <p className="p-5 text-cream/55">No posts yet.</p> : null}
        </div>
        <NoticeManager notice={notice ? { message: notice.message, active: notice.active, expiresAt: notice.expiresAt?.toISOString() || null } : null} />
      </div>
    </section>
  );
}
