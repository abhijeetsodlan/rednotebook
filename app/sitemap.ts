export const dynamic = 'force-dynamic';

import { Prisma } from "@prisma/client";
import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  let posts: Array<{ slug: string; updatedAt: Date }> = [];

  try {
    posts = await prisma.post.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true }
    });
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError && ["P2021", "P2022", "P1001", "P1003"].includes(error.code))) {
      throw error;
    }
  }

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blogs`, lastModified: new Date() },
    ...posts.map((post) => ({
      url: `${baseUrl}/blogs/${post.slug}`,
      lastModified: post.updatedAt
    }))
  ];
}
