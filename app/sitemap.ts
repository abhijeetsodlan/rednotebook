export const dynamic = 'force-dynamic';

import type { MetadataRoute } from "next";
import { getAllPublishedPostLinks } from "@/lib/mongo-store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const posts = await getAllPublishedPostLinks();

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blogs`, lastModified: new Date() },
    ...posts.map((post) => ({
      url: `${baseUrl}/blogs/${post.slug}`,
      lastModified: post.updatedAt
    }))
  ];
}
